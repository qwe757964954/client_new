import { _decorator, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import { EventType } from '../../config/EventType';
import { GameRes } from '../../GameRes';
import { inf_SpineAniCreate } from '../../manager/InterfaceDefines';
import { SoundMgr } from '../../manager/SoundMgr';
import { ViewsMgr } from '../../manager/ViewsManager';
import { GradeSkipExercisesSubmitReply, UnitData } from '../../models/AdventureModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import { GradeSkipSubjectMgr, SubjectType, UnitSubject } from './GradeSkipSubjectManager';
import { ExerciseChoiceSubject } from './subject/ExerciseChoiceSubject';
import { WordExamSubject } from './subject/WordExamSubject';
import { WordMeanSubject } from './subject/WordMeanSubject';
import { WordReadingSubject } from './subject/WordReadingSubject';
import { WordSpellSubject } from './subject/WordSpellSubject';
const { ccclass, property } = _decorator;

@ccclass('UnitExerciseView')
export class UnitExerciseView extends BaseView {
    @property(Sprite)
    public bg: Sprite = null;
    @property(Label)
    public titleLabel: Label = null;
    @property(Node)
    public closeBtn: Node = null;
    @property(Node)
    public subjectNode: Node = null;
    @property(Label)
    public progressLabel: Label = null;
    @property(Label)
    public wrongLabel: Label = null;
    @property(Prefab)
    public wordMeanSubject: Prefab = null;
    @property(Prefab)
    public wordSpellSubject: Prefab = null;
    @property(Prefab)
    public wordReadingSubject: Prefab = null;
    @property(Prefab)
    public wordExamSubject: Prefab = null;
    @property(Prefab)
    public exerciseChoiceSubject: Prefab = null;
    @property(Node)
    public rightAniNode: Node = null;

    private _currentSubjectView: Node;

    private _unitData: UnitData;
    private _comboNum: number = 0;
    private _wrongNum: number = 0;
    private _subjectNum: number = 0;
    private _currentSubjectIdx: number = 0;
    private _result: number;


    setData(data: UnitData) {
        this._unitData = data;
        this.titleLabel.string = data.unit;
        this._subjectNum = GradeSkipSubjectMgr.totalSubjectLen;
        this.showProgress();
        this.showCurrentSubject();
    }

    showProgress() {
        this.progressLabel.string = `当前进度：${this._currentSubjectIdx + 1}/${this._subjectNum}`;
        this.wrongLabel.string = `错误次数：${this._wrongNum}`;
    }

    showCurrentSubject() {
        if (this._currentSubjectView) {
            this._currentSubjectView.destroy();
        }
        let subject: UnitSubject = GradeSkipSubjectMgr.getSubjet();
        console.log("当前题目：", subject);
        switch (subject.type) {
            case SubjectType.WordMeaning:
                this._currentSubjectView = instantiate(this.wordMeanSubject);
                this._currentSubjectView.getComponent(WordMeanSubject).setData(subject.word, subject.wordOpts);
                break;
            case SubjectType.WordSpelling:
                this._currentSubjectView = instantiate(this.wordSpellSubject);
                this._currentSubjectView.getComponent(WordSpellSubject).setData(subject.word, subject.unitGroup);
                break;
            case SubjectType.WordReading:
                this._currentSubjectView = instantiate(this.wordReadingSubject);
                this._currentSubjectView.getComponent(WordReadingSubject).setData(subject.word);
                break;
            case SubjectType.WordExam:
                this._currentSubjectView = instantiate(this.wordExamSubject);
                this._currentSubjectView.getComponent(WordExamSubject).setData(subject.word);
                break;
            case SubjectType.UnitPractice:
                this._currentSubjectView = instantiate(this.exerciseChoiceSubject);
                this._currentSubjectView.getComponent(ExerciseChoiceSubject).setData(subject.exercises);
                break;
        }
        this._currentSubjectView.parent = this.subjectNode;
    }

    showRightSpAni() {
        SoundMgr.correct();
        this.rightAniNode.active = true;
        let aniName = "";
        if (this._comboNum == 1) {
            aniName = "animation_2"
        } else if (this._comboNum == 2) {
            aniName = "animation_1"
        } else if (this._comboNum > 2) {
            aniName = Math.random() > 0.5 ? "animation_3" : "animation_4";
        }
        let spinePrams: inf_SpineAniCreate = {
            resConf: GameRes.Spine_Correct,
            aniName: aniName,
            trackIndex: 0,
            parentNode: this.rightAniNode,
            isLoop: false,
            callEndFunc: () => {
                this.rightAniNode.active = false;
            }
        }
        this.rightAniNode.removeAllChildren();
        EventMgr.dispatch(EventType.Sys_Ani_Play, spinePrams);
    }

    onSubjectResult(isRight: boolean) {
        if (isRight) {
            this._comboNum++;
            this.showRightSpAni();
        } else {
            this._comboNum = 0;
            this._wrongNum++;
            SoundMgr.wrong();
        }
        this.showProgress();

        this.scheduleOnce(() => {
            if (this._currentSubjectIdx < this._subjectNum - 1) {
                this._currentSubjectIdx++;
                this.showCurrentSubject();
            } else {
                this.showResult();
            }
        }, 0.5);
    }

    showResult() {
        console.log("展示结果");
        this._result = this._wrongNum / this._subjectNum > 0.4 ? 0 : 1;
        ServiceMgr.studyService.gradeSkipExercisesSubmit(this._unitData.big_id, this._unitData.unit, this._result);
    }
    onClose() {
        this.node.destroy();
    }

    onExercisesSubmit(data: GradeSkipExercisesSubmitReply) {
        if (data.code != 200) {
            ViewsMgr.showTip(data.msg);
            return;
        }
        let resultStr = this._result == 1 ? "未到达跳级标准,继续努力！" : "恭喜跳级成功！";
        ViewsMgr.showAlert(resultStr, () => {
            this.node.destroy();
        })
    }

    protected onInitModuleEvent(): void {
        this.addModelListener(InterfacePath.GradeSkip_ExercisesSubmit, this.onExercisesSubmit);
    }
    protected initEvent(): void {
        EventMgr.addListener(EventType.GradeSkip_Subject_Result, this.onSubjectResult, this);
        CCUtil.onTouch(this.closeBtn, this.onClose, this);
    }

    protected removeEvent(): void {
        EventMgr.removeListener(EventType.GradeSkip_Subject_Result, this);
        CCUtil.offTouch(this.closeBtn, this.onClose, this);
    }
}


