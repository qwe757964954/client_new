import { _decorator, Component, Label, Node, Sprite } from 'cc';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('CaleBagView')
export class CaleBagView extends Component {
    @property(Node)
    public reduce_btn: Node = null;

    @property(Node)
    public add_btn: Node = null;

    @property(Label)
    public cale_text: Label = null;

    private _min_value: number = 1;//null;
    private _max_value: number = 1;//null;
    private _curValue: number = 1;

    private _selectListener: (num: number) => void = null;
    private _valMinMaxToGray: boolean = false;

    protected start(): void {
        this.initEvent();
    }

    setSelectListener(listener: (num: number) => void) {
        this._selectListener = listener;
    }

    set curValue(value: number) {
        this._curValue = value;
        this.refreshShow();
    }

    set valMinMaxToGray(val: boolean) {
        this._valMinMaxToGray = val;
        this.refreshShow();
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.reduce_btn, this.reduceClickEvent.bind(this));
        CCUtil.onBtnClick(this.add_btn, this.addClickEvent.bind(this));
    }

    reduceClickEvent() {
        console.log("reduceClickEvent");
        this._curValue--;
        this.refreshShow();
        this._selectListener?.(this.getCaleNumber());
    }

    addClickEvent() {
        console.log("addClickEvent");
        this._curValue++;
        this.refreshShow();
        this._selectListener?.(this.getCaleNumber());
    }

    getCaleNumber() {
        return this._curValue;
    }

    setCaleMax(max: number) {
        this._max_value = max;
        this.refreshShow();
    }
    /**更新显示 */
    refreshShow() {
        if (null != this._min_value && this._curValue < this._min_value) {
            this._curValue = this._min_value;
        }
        if (null != this._max_value && this._curValue > this._max_value) {
            this._curValue = this._max_value;
        }

        if (this._valMinMaxToGray && this._min_value == this._curValue) {
            this.reduce_btn.getComponent(Sprite).grayscale = true;
        } else {
            this.reduce_btn.getComponent(Sprite).grayscale = false;
        }
        if (this._valMinMaxToGray && this._max_value == this._curValue) {
            this.add_btn.getComponent(Sprite).grayscale = true;
        } else {
            this.add_btn.getComponent(Sprite).grayscale = false;
        }
        this.cale_text.string = this._curValue.toString();
    }
}

