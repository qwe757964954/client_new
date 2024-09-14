import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('SymbolItem')
export class SymbolItem extends Component {
    @property(Sprite)
    public bg: Sprite = null;
    @property(Label)
    public symbolLabel: Label = null;
    @property(Node)
    public rightIcon: Node = null;

    @property(SpriteFrame)
    public whiteBg: SpriteFrame = null;
    @property(SpriteFrame)
    public greenBg: SpriteFrame = null;

    private _data: any = null;

    protected onEnable(): void {
        CCUtil.onTouch(this.node, this.onClick, this);
    }

    onClick() {
        if (!this._data) return;
        EventMgr.dispatch(EventType.Symbol_Click, this._data);
    }

    setData(data: any) {
        this.symbolLabel.string = data.symbol;
        this.rightIcon.active = false;
        this._data = data;
        this.isSelect = false;
    }

    public set isSelect(val: boolean) {
        if (val) {
            this.bg.spriteFrame = this.greenBg;
        } else {
            this.bg.spriteFrame = this.whiteBg;
        }
    }

    public get data() {
        return this._data;
    }

    protected onDestroy(): void {
        CCUtil.offTouch(this.node, this.onClick, this);
    }

}


