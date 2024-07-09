import { _decorator, Component, Label, Node } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import List from '../../util/list/List';
import { ThemeWordItem } from './ThemeWordItem';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('SentencePatternView')
export class SentencePatternView extends BasePopup {
    @property(Node)
    public closeBtn: Node;
    @property(Label)
    public title: Label;
    @property(List)
    public wordList: List;
    private _data: any;

    public setData(data: any) {
        this._data = data;
        this._data.words = [1, 2, 3, 4];
        this.title.string = data.title;
        this.wordList.numItems = this._data.words.length;
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.closeBtn, this.closePop, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.closeBtn, this.closePop, this);
    }

    onWordItemRender(item: Node, idx: number) {
        let word = item.getComponent(ThemeWordItem);
        word.initData(this._data.words[idx]);
    }
}


