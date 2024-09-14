import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { PhonicsGameData } from '../../../manager/DataMgr';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('PhonicsGameItem')
export class PhonicsGameItem extends Component {
    @property(Sprite)
    public bg: Sprite = null;
    @property(Label)
    public contentLabel: Label = null;

    @property(SpriteFrame)
    public whiteBg: SpriteFrame = null;
    @property(SpriteFrame)
    public greenBg: SpriteFrame = null;

    public data: PhonicsGameData = null;

    protected onEnable(): void {
        CCUtil.onTouch(this.node, this.onClick, this);
    }

    onClick() {
        if (!this.data) return;
        EventMgr.dispatch(EventType.Phonics_Game_Item_Click, this.data);
    }

    setData(data: PhonicsGameData) {
        this.data = data;
        this.contentLabel.string = data.content;
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


