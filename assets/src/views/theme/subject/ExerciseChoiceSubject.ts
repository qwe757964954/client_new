import { _decorator, Component, Label, Node } from 'cc';
import { BaseView } from '../../../script/BaseView';
import List from '../../../util/list/List';
import { ArticleExercise } from '../../../models/AdventureModel';
import { ChoiceAnswerItem } from '../item/ChoiceAnswerItem';
import { EventMgr } from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('ExerciseChoiceSubject')
export class ExerciseChoiceSubject extends BaseView {
    @property(Label)
    public topicLabel: Label;
    @property(List)
    public answerList: List;
    private _data: ArticleExercise;
    private _optionList: string[];

    private _selectLock: boolean = false;

    public setData(data: ArticleExercise) {
        this._data = data;
        this._optionList = [...data.options, data.answer];
        this._optionList.sort((a, b) => {
            return Math.random() > .5 ? 1 : -1;
        })
        this.topicLabel.string = data.content;
    }

    protected initUI(): void {
        this.answerList.numItems = this._optionList.length;
    }

    onAnswerListRender(item: Node, idx: number) {
        let answer = item.getComponent(ChoiceAnswerItem);
        answer.setData(idx, this._optionList[idx]);
    }

    onItemChoice(item: ChoiceAnswerItem) {
        if (this._selectLock) return;
        this._selectLock = true;
        let isRight = true;
        if (item.answer == this._data.answer) { // 正确
            item.showRight();
        } else {
            item.showWrong();
            isRight = false;
        }
        EventMgr.dispatch(EventType.GradeSkip_Subject_Result, isRight);
    }

    protected initEvent(): void {
        EventMgr.addListener(EventType.Subject_ItemChoice, this.onItemChoice, this);
    }

    protected removeEvent(): void {
        EventMgr.removeListener(EventType.Subject_ItemChoice, this);
    }
}


