import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('PhoincsGameOptItem')
export class PhoincsGameOptItem extends Component {
    @property(Sprite)
    public bg: Sprite = null;
    @property(Label)
    public contentLabel: Label = null;

    @property(SpriteFrame)
    public whiteBg: SpriteFrame = null;
    @property(SpriteFrame)
    public greenBg: SpriteFrame = null;

    public data: string = null;

    protected onEnable(): void {
        CCUtil.onTouch(this.node, this.onClick, this);
    }

    onClick() {
        if (!this.data) return;
        EventMgr.dispatch(EventType.Phonics_Game_Opt_Click, this.data);
    }

    setData(data: string) {
        this.data = data;
        this.contentLabel.string = data;
        this.isSelect = false;
    }

    public set isSelect(val: boolean) {
        if (val) {
            this.bg.spriteFrame = this.greenBg;
        } else {
            this.bg.spriteFrame = this.whiteBg;
        }
    }

    protected onDestroy(): void {
        CCUtil.offTouch(this.node, this.onClick, this);
    }
}


