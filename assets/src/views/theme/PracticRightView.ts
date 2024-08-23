import { _decorator, Label, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { ArticleExercise, QuestionKind, WordGameSubjectReply } from '../../models/AdventureModel';
import { ServiceMgr } from '../../net/ServiceManager';
import { BasePopRight } from '../../script/BasePopRight';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
const { ccclass, property } = _decorator;

@ccclass('PracticRightView')
export class PracticRightView extends BasePopRight {
    @property(Node)
    public questionNode: Node;
    @property(Node)
    public preBtn: Node;
    @property(Node)
    public nextBtn: Node;
    @property(Label)
    public pageLabel: Label;
    private _currentQuestionIdx: number = 0; //当前题目索引
    private _questionList: ArticleExercise[] = [];
    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("content")]).then(()=>{
            EventMgr.dispatch(EventType.Practic_Right_View_Hiden);
        });
    }

    updateData(data:WordGameSubjectReply){
        ServiceMgr.studyService.getArticleExercisesList(data.subject.subject_id);
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.preBtn, this.preQuestion.bind(this));
        CCUtil.onBtnClick(this.nextBtn, this.nextQuestion.bind(this));
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

    showQuestion() {
        let question = this._questionList[this._currentQuestionIdx];
        if (!question) return;
        if (question.kind == QuestionKind.Choice) { //选择题
        }
        this.pageLabel.string = (this._currentQuestionIdx + 1) + "/" + this._questionList.length;
    }
}

