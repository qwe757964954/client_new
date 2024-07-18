import { _decorator, Component, Label, Node, SpriteFrame } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { ArticleExercise } from '../../models/AdventureModel';
import { ChoiceAnswerItem } from './item/ChoiceAnswerItem';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('ChoiceQuestion')
export class ChoiceQuestion extends BaseView {
    @property(Label)
    public topicLabel: Label;
    @property(List)
    public answerList: List;
    private _data: ArticleExercise;
    private _optionList: string[];
    public setData(data: ArticleExercise, idx: number) {
        this._data = data;
        this._optionList = [...data.options, data.answer];
        this._optionList.sort((a, b) => {
            return Math.random() > .5 ? 1 : -1;
        })
        this.answerList.numItems = this._optionList.length;
        this.topicLabel.string = (idx + 1) + ". " + data.content;
    }

    onAnswerListRender(item: Node, idx: number) {
        let answer = item.getComponent(ChoiceAnswerItem);
        answer.setData(idx, this._optionList[idx]);
    }

    onItemChoice(item: ChoiceAnswerItem) {
        console.log("answer::", item.answer);
        if (item.answer == this._data.answer) { // 正确
            item.showRight();
        } else {
            item.showWrong();
        }
    }

    protected initEvent(): void {
        EventMgr.addListener(EventType.Subject_ItemChoice, this.onItemChoice, this);
    }

    protected removeEvent(): void {
        EventMgr.removeListener(EventType.Subject_ItemChoice, this);
    }
}


