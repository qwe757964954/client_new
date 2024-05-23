import { _decorator, Component, Label, Sprite, SpriteFrame } from 'cc';
import { RewordUIInfo } from './RewardDialogView';
const { ccclass, property } = _decorator;

@ccclass('NewbieAwardItem')
export class NewbieAwardItem extends Component {

    @property({ type: Sprite, tooltip: "图标" })
    iconSpr: Sprite = null;

    @property({ type: Label, tooltip: "数量文字" })
    countTxt: Label = null;

    @property({ type: [SpriteFrame], tooltip: "0:晶石  1:钻石  2:金币" })
    public giftIconSpr: SpriteFrame[] = [];


    private _awardData: RewordUIInfo = null;

    initData(data: RewordUIInfo) {
        if (!data) {
            return;
        }

        this._awardData = data;
        switch (data.skinType) {
            case 0:
                this.iconSpr.spriteFrame = this.giftIconSpr[0];
                break;
            case 1:
                this.iconSpr.spriteFrame = this.giftIconSpr[1];
                break;
            case 2:
                this.iconSpr.spriteFrame = this.giftIconSpr[2];
                break;
        }
        this.countTxt.string = "x" + data.count;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


