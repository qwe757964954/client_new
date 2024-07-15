import { _decorator, Component, Label, Node } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import List from '../../util/list/List';
import { ThemeWordItem } from './ThemeWordItem';
import CCUtil from '../../util/CCUtil';
import { WordGameSubjectReply } from '../../models/AdventureModel';
const { ccclass, property } = _decorator;

@ccclass('SubjectView')
export class SubjectView extends BasePopup {
    @property(Node)
    public closeBtn: Node;
    @property(Label)
    public title: Label;
    @property(List)
    public wordList: List;
    private _data: WordGameSubjectReply;

    public setData(data: WordGameSubjectReply) {
        this._data = data;
        this.title.string = data.subject.subject_name;
        this.wordList.numItems = this._data.word_list.length;
    }

    showAnim(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.initUI();
            resolve();
        });

    }

    protected initEvent(): void {
        CCUtil.onTouch(this.closeBtn, this.closePop, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.closeBtn, this.closePop, this);
    }

    onWordItemRender(item: Node, idx: number) {
        let word = item.getComponent(ThemeWordItem);
        word.initData(this._data.word_list[idx]);
    }
}


