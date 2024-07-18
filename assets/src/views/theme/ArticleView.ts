import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, tween, UITransform, Vec3 } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import List from '../../util/list/List';
import { Article, ArticleExercise, ArticleExercisesListReply, QuestionKind, Subject, SubjectArticleListReply } from '../../models/AdventureModel';
import { ServiceMgr } from '../../net/ServiceManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import { ChoiceQuestion } from './ChoiceQuestion';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import { InterfacePath } from '../../net/InterfacePath';
import { ArticleItem } from './item/ArticleItem';
import { BaseView } from '../../script/BaseView';
const { ccclass, property } = _decorator;

@ccclass('ArticleView')
export class ArticleView extends BaseView {
    @property(Node)
    public closeBtn: Node;
    @property(Label)
    public title: Label;
    @property(Sprite)
    public comicImg: Sprite;
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
    public preArticleBtn: Node;
    @property(Node)
    public nextArticleBtn: Node;
    @property(Label)
    public pageLabel: Label;
    @property(Node)
    public preQuestionBtn: Node;
    @property(Node)
    public nextQuestionBtn: Node;
    @property(Label)
    public questionPageLabel: Label;
    @property(Label)
    public articleLabel: Label;

    private _questionView: Node;

    private _isTweening: boolean = false;
    private _isShowPractice: boolean = false;
    private _isGettingPractice: boolean = false;
    private _questionList: ArticleExercise[] = [];
    private _currentQuestionIdx: number = 0; //当前题目索引

    private _currentArticleIdx: number = 0; //当前文章索引

    private _subjectData: Subject;
    private _articleDatas: Article[];

    public setData(subjectData: Subject, data: SubjectArticleListReply) {
        this._articleDatas = data.article_list;
        this._subjectData = subjectData;
        this.title.string = subjectData.subject_name;
        this._isGettingPractice = true;
        this.showArticle();
        ServiceMgr.studyService.getArticleExercisesList(subjectData.subject_id, this._articleDatas[this._currentArticleIdx].article_id);
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
                this.practiceLabel.string = "<< 去阅读";
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
        if (this._questionList.length == 0) {
            this.practiceBtn.active = false;
        } else {
            this.practiceBtn.active = true;
            this.showQuestion();
        }
    }

    showQuestion() {
        if (this._questionView) {
            this._questionView.destroy();
        }
        let question = this._questionList[this._currentQuestionIdx];
        if (!question) {
            ViewsMgr.showTip("没有对应的练习题");
            return;
        }
        if (question.kind == QuestionKind.Choice) { //选择题
            this._questionView = instantiate(this.choiceQuestionPrefab);
            this._questionView.parent = this.questionNode;
            this._questionView.getComponent(ChoiceQuestion).setData(question, this._currentQuestionIdx);
        }
        this.questionPageLabel.string = (this._currentQuestionIdx + 1) + "/" + this._questionList.length;
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

    preArticle() {
        this._currentArticleIdx--;
        if (this._currentArticleIdx < 0) {
            this._currentArticleIdx = this._articleDatas.length - 1;
        }
        this.showArticle();
    }
    nextArticle() {
        this._currentArticleIdx++;
        if (this._currentArticleIdx >= this._articleDatas.length) {
            this._currentArticleIdx = 0;
        }
        this.showArticle();
    }

    showArticle() {
        this.articleLabel.string = this._articleDatas[this._currentArticleIdx].article;
        this.pageLabel.string = (this._currentArticleIdx + 1) + "/" + this._articleDatas.length;
        ServiceMgr.studyService.getArticleExercisesList(this._subjectData.subject_id, this._articleDatas[this._currentArticleIdx].article_id);
        this._isGettingPractice = true;
    }

    closePop() {
        this.node.destroy();
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.closeBtn, this.closePop, this);
        CCUtil.onTouch(this.practiceBtn, this.gotoPractice, this);
        CCUtil.onTouch(this.preQuestionBtn, this.preQuestion, this);
        CCUtil.onTouch(this.nextQuestionBtn, this.nextQuestion, this);
        CCUtil.onTouch(this.preArticleBtn, this.preArticle, this);
        CCUtil.onTouch(this.nextArticleBtn, this.nextArticle, this);
        EventMgr.addListener(InterfacePath.Article_ExercisesList, this.onGetExerciseList, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.closeBtn, this.closePop, this);
        CCUtil.offTouch(this.practiceBtn, this.gotoPractice, this);
        CCUtil.offTouch(this.preQuestionBtn, this.preQuestion, this);
        CCUtil.offTouch(this.nextQuestionBtn, this.nextQuestion, this);
        CCUtil.offTouch(this.preArticleBtn, this.preArticle, this);
        CCUtil.offTouch(this.nextArticleBtn, this.nextArticle, this);
        EventMgr.removeListener(InterfacePath.Article_ExercisesList, this);
    }
}


