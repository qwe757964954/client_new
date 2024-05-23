import { _decorator, Component, Label } from 'cc';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('ReviewWordItem')
export class ReviewWordItem extends Component {
    @property(Label)
    public labelWord: Label = null;//单词
    @property(Label)
    public labelMean: Label = null;//释义

    private _data: any = null;

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.node, this.onClick, this);
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.node, this.onClick, this);
    }
    /**点击事件 */
    onClick() {
        this._data.meanShow = true;
        this.labelMean.node.active = true;
    }
    init(data: any) {
        this._data = data;
        this.labelWord.string = data.word;
        this.labelMean.string = data.mean;
        this.labelWord.node.active = true;
        this.labelMean.node.active = data.meanShow ? true : false;
    }
}


