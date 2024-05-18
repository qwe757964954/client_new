import { _decorator, Component, Label, Sprite, SpriteFrame } from 'cc';

import { RewordUIInfo } from '../gift/RewardDialogView';
const { ccclass, property } = _decorator;

@ccclass('AchieveAwardItem')
export class AchieveAwardItem extends Component {

    @property({ type: Sprite, tooltip: "图标" })
    iconSpr: Sprite = null;

    @property({ type: Label, tooltip: "数量文字" })
    countTxt: Label = null;

    @property({ type: [SpriteFrame], tooltip: "0:金币  1:钻石" })
    public giftIconSpr: SpriteFrame[] = [];


    private _awardData: RewordUIInfo = null;

    initData(data: RewordUIInfo) {
        if (!data) {
            return;
        }

        this._awardData = data;
        switch (data.skinType) {
            case 0: //紫晶石
                this.iconSpr.spriteFrame = this.giftIconSpr[0];
                break;
            case 1: //钻石
                this.iconSpr.spriteFrame = this.giftIconSpr[1];
                break;
            case 2: //金币
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


