import { _decorator, instantiate, Label, Node, Prefab, tween, UITransform, Vec3 } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsMgr } from '../../manager/ViewsManager';
import { ArticleExercise, ArticleExercisesListReply, QuestionKind, SubjectArticleListReply, WordGameSubjectReply } from '../../models/AdventureModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { ArticleView } from './ArticleView';
import { ChoiceQuestion } from './ChoiceQuestion';
import { ArticleItem } from './item/ArticleItem';
const { ccclass, property } = _decorator;

@ccclass('PracticeView')
export class PracticeView extends BaseView {
    @property(Node)
    public top_layout: Node;
    @property(Node)
    public content_layout: Node;
    @property(List)
    public articleList: List;
    @property(Node)
    public practiceBtn: Node;
    @property(Label)
    public practiceLabel: Label;
    @property(Node)
    public articleNode: Node;
    @property(Node)
    public mainFrame: Node;

    @property(Node)
    public questionNode: Node;
    @property(Prefab)
    public choiceQuestionPrefab: Prefab; // 选择题
    @property(Node)
    public preBtn: Node;
    @property(Node)
    public nextBtn: Node;
    @property(Label)
    public pageLabel: Label;
    private _questionView: Node;

    private _data: WordGameSubjectReply;
    private _isTweening: boolean = false;
    private _isShowPractice: boolean = false;
    private _isGettingPractice: boolean = false;
    private _questionList: ArticleExercise[] = [];
    private _currentQuestionIdx: number = 0; //当前题目索引

    private _isGettingArticle: boolean = false;

    protected initUI(): void {
        this.initNavTitle();
    }

    public setData(data: WordGameSubjectReply) {
        this._data = data;
        // this._navTitleView.setTitleName(data.subject.subject_name);
        return;
        this.articleList.numItems = this._data.subject.dialogue_content.length;
        console.log("ddddddddddd", data);
        this.scheduleOnce(() => {
            this.articleList.updateAll();
        }, 0.05);
        this._isGettingPractice = true;
        ServiceMgr.studyService.getArticleExercisesList(data.subject.subject_id);
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

    gotoPractice() {
        if (this._isGettingPractice) {
            ViewsMgr.showTip("题目获取中,请稍后");
            return;
        }
        if (this._questionList.length == 0) {
            ViewsMgr.showTip("没有对应的练习题");
            return;
        }
        if (this._isTweening) return;
        this._isTweening = true;
        let articleTrans = this.articleNode.getComponent(UITransform);
        let frameTrans = this.mainFrame.getComponent(UITransform);
        let targetPos = this.mainFrame.position;
        if (!this._isShowPractice) {
            let startPosX = this.articleNode.position.x - articleTrans.width / 2;
            tween(this.mainFrame).to(0.3, { position: new Vec3(-startPosX - frameTrans.width / 2 + 75, targetPos.y, targetPos.z) }).call(() => {
                this._isTweening = false;
                this._isShowPractice = true;
                this.practiceLabel.string = "<< 看漫画";
            }).start();
        } else {
            tween(this.mainFrame).to(0.3, { position: new Vec3(-frameTrans.width / 2, targetPos.y, targetPos.z) }).call(() => {
                this._isTweening = false;
                this._isShowPractice = false;
                this.practiceLabel.string = "去练习 >>";
            }).start();
        }
    }

    onGetExerciseList(data: ArticleExercisesListReply) {
        console.log("ArticleExercisesListReply", data);
        EventMgr.removeListener(InterfacePath.Article_ExercisesList, this);
        this._isGettingPractice = false;
        this._questionList = data.exercises_list;
        this._currentQuestionIdx = 0;
        if (this._questionList.length == 0) {
            this.practiceBtn.active = false;
        } else {
            this.showQuestion();
        }
    }

    showQuestion() {
        if (this._questionView) {
            this._questionView.destroy();
        }
        let question = this._questionList[this._currentQuestionIdx];
        if (!question) return;
        if (question.kind == QuestionKind.Choice) { //选择题
            this._questionView = instantiate(this.choiceQuestionPrefab);
            this._questionView.parent = this.questionNode;
            this._questionView.getComponent(ChoiceQuestion).setData(question, this._currentQuestionIdx);
        }
        this.pageLabel.string = (this._currentQuestionIdx + 1) + "/" + this._questionList.length;
    }

    preQuestion() {
        this._currentQuestionIdx--;
        if (this._currentQuestionIdx < 0) {
            this._currentQuestionIdx = this._questionList.length - 1;
        }
        this.showQuestion();
    }
    nextQuestion() {
        this._currentQuestionIdx++;
        if (this._currentQuestionIdx >= this._questionList.length) {
            this._currentQuestionIdx = 0;
        }
        this.showQuestion();
    }

    closePop() {
        this.node.destroy();
    }
    private initNavTitle() {
        this.createNavigation("I hava a fream",this.top_layout, () => {
            ViewsMgr.closeView(PrefabType.PracticeView);
        });
    }
    protected initEvent(): void {
        CCUtil.onTouch(this.practiceBtn, this.gotoPractice, this);
        CCUtil.onTouch(this.preBtn, this.preQuestion, this);
        CCUtil.onTouch(this.nextBtn, this.nextQuestion, this);
        EventMgr.addListener(InterfacePath.Article_ExercisesList, this.onGetExerciseList, this);
        EventMgr.addListener(InterfacePath.Subject_ArticleList, this.onGetArticle, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.practiceBtn, this.gotoPractice, this);
        CCUtil.offTouch(this.preBtn, this.preQuestion, this);
        CCUtil.offTouch(this.nextBtn, this.nextQuestion, this);
        EventMgr.removeListener(InterfacePath.Article_ExercisesList, this);
        EventMgr.removeListener(InterfacePath.Subject_ArticleList, this);
    }

    onArticleListRender(item: Node, idx: number) {
        let itemSp = item.getComponent(ArticleItem);
        itemSp.setData(this._data.subject.dialogue_content[idx]);
    }
}


