import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, tween, UITransform, Vec3 } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import List from '../../util/list/List';
import { ArticleItem } from './item/ArticleItem';
import { ArticleExercise, ArticleExercisesListReply, QuestionKind, SubjectArticleListReply, WordGameSubjectReply } from '../../models/AdventureModel';
import CCUtil from '../../util/CCUtil';
import { ServiceMgr } from '../../net/ServiceManager';
import { EventMgr } from '../../util/EventManager';
import { InterfacePath } from '../../net/InterfacePath';
import { ViewsMgr } from '../../manager/ViewsManager';
import { ChoiceQuestion } from './ChoiceQuestion';
const { ccclass, property } = _decorator;

@ccclass('PracticeView')
export class PracticeView extends BasePopup {
    @property(Node)
    public closeBtn: Node;
    @property(Label)
    public title: Label;
    @property(Sprite)
    public comicImg: Sprite;
    @property(List)
    public articleList: List;
    @property(Node)
    public readBtn: Node;
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

    public setData(data: WordGameSubjectReply) {
        this._data = data;
        this.title.string = data.subject.subject_name;
        this.articleList.numItems = this._data.subject.dialogue_content.length;
        console.log("ddddddddddd", data);
        this.scheduleOnce(() => {
            this.articleList.updateAll();
        }, 0.05);
        this._isGettingPractice = true;
        ServiceMgr.studyService.getArticleExercisesList(data.subject.subject_id);
    }

    showAnim(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.initUI();
            resolve();
        });
    }

    gotoRead() {

    }

    gotoPractice() {
        if (this._isGettingPractice) {
            ViewsMgr.showTip("题目获取中,请稍后");
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
        this._isGettingPractice = false;
        this._questionList = data.exercises_list;
        this._currentQuestionIdx = 0;
        this.showQuestion();
    }

    showQuestion() {
        if (this._questionView) {
            this._questionView.destroy();
        }
        let question = this._questionList[this._currentQuestionIdx];
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

    protected initEvent(): void {
        CCUtil.onTouch(this.closeBtn, this.closePop, this);
        CCUtil.onTouch(this.readBtn, this.gotoRead, this);
        CCUtil.onTouch(this.practiceBtn, this.gotoPractice, this);
        CCUtil.onTouch(this.preBtn, this.preQuestion, this);
        CCUtil.onTouch(this.nextBtn, this.nextQuestion, this);
        EventMgr.addListener(InterfacePath.Article_ExercisesList, this.onGetExerciseList, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.closeBtn, this.closePop, this);
        CCUtil.offTouch(this.readBtn, this.gotoRead, this);
        CCUtil.offTouch(this.practiceBtn, this.gotoPractice, this);
        CCUtil.offTouch(this.preBtn, this.preQuestion, this);
        CCUtil.offTouch(this.nextBtn, this.nextQuestion, this);
        EventMgr.removeListener(InterfacePath.Article_ExercisesList, this);
    }

    onArticleListRender(item: Node, idx: number) {
        let itemSp = item.getComponent(ArticleItem);
        itemSp.setData(this._data.subject.dialogue_content[idx]);
    }
}


