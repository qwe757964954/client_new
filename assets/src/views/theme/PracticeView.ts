import { _decorator, Label, Node, Prefab } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { PopMgr } from '../../manager/PopupManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import { ArticleExercisesListReply, SubjectArticleListReply, WordGameSubjectReply } from '../../models/AdventureModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseView } from '../../script/BaseView';
import { ArticleView } from './ArticleView';
import { ComicController } from './ComicController';
import { ArticleItem } from './item/ArticleItem';
import { ReadArticleView } from './ReadArticleView';
import { SwitchComponent } from './SwitchComponent';
const { ccclass, property } = _decorator;

@ccclass('PracticeView')
export class PracticeView extends BaseView {
    @property(Node)
    public top_layout: Node;
    @property(Node)
    public content_layout: Node;
    @property(Label)
    public practiceLabel: Label;
    @property(Prefab)
    public choiceQuestionPrefab: Prefab; // 选择题

    @property(SwitchComponent)
    public switchComponent: SwitchComponent;
    private _data: WordGameSubjectReply;

    private _isGettingArticle: boolean = false;

    private _comicController:ComicController = null;
    private _readArticleView:ReadArticleView = null;

    protected async initUI() {
        this.initNavTitle();
        await this.initViews();
        this._navTitleView.setTitleName(this._data.subject.subject_name);
        this._readArticleView.updateData(this._data);
        this.switchComponent.setSwichListener(this.swichChangeListener.bind(this));
    }
    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [InterfacePath.Article_ExercisesList, this.onGetExerciseList],
            [InterfacePath.Subject_ArticleList, this.onGetArticle],
            [EventType.Practic_Right_View_Hiden,this.onPracticHiden]
        ]);
    }
    private async initViews() {
        const viewComponents = [
            {
                prefabType: PrefabType.ComicController,
                initCallback: (node: Node) => this._comicController = node.getComponent(ComicController),
                alignOptions: { isAlignTop: true,isAlignLeft: true, top: 130.735,left:41.954},
                parentNode: this.content_layout
            },
            {
                prefabType: PrefabType.ReadArticleView,
                initCallback: (node: Node) => this._readArticleView = node.getComponent(ReadArticleView),
                alignOptions: { isAlignTop: true,isAlignRight:true, top: 130.735,right:54.642},
                parentNode: this.content_layout
            },
        ]

        await Promise.all(viewComponents.map(config => 
            this.initViewComponent(config.prefabType, config.initCallback, config.alignOptions, config.parentNode)
        ));
    }

    public setData(data: WordGameSubjectReply) {
        this._data = data;
        console.log("setData......",this._data,this._readArticleView);
    }
    onPracticHiden(){
        this.switchComponent.setSwitchState(false);
    }
    gotoRead() {
        if (this._isGettingArticle) return;
        this._isGettingArticle = true;
        ServiceMgr.studyService.getSubjectArticleList(this._data.subject.subject_id);
    }

    onGetArticle(data: SubjectArticleListReply) {
        ViewsMgr.showView(PrefabType.ArticleView, (node) => {
            this._isGettingArticle = false;
            node.getComponent(ArticleView).setData(this._data.subject, data);
        })
    }

    async swichChangeListener(status:boolean){
        let practiceStr = status ? "<去练习":"去练习>"
        this.practiceLabel.string = practiceStr;
        if (status) {
            await PopMgr.showPopRight(PrefabType.PracticRightView,"content");
        } else {
            PopMgr.closePopup(PrefabType.PracticRightView);
        }

    }
    onGetExerciseList(data: ArticleExercisesListReply) {
        console.log("ArticleExercisesListReply", data);
        // this._isGettingPractice = false;
        // this._questionList = data.exercises_list;
        // this._currentQuestionIdx = 0;
        // if (this._questionList.length == 0) {
        //     this.practiceBtn.active = false;
        // } else {
        //     this.showQuestion();
        // }
    }
    closePop() {
        this.node.destroy();
    }
    private initNavTitle() {
        this.createNavigation("I hava a fream",this.top_layout, () => {
            ViewsMgr.closeView(PrefabType.PracticeView);
        });
    }

    

    onArticleListRender(item: Node, idx: number) {
        let itemSp = item.getComponent(ArticleItem);
        itemSp.setData(this._data.article_list[idx]);
    }
}


