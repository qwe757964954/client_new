import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { BieGiftBaseInfo, BieGiftInfo, NetGetBigGiftAwardInfo } from './NewbieGiftDialogView';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('NewbieGiftItem')
export class NewbieGiftItem extends Component {
    @property({ type: Label, tooltip: "天数文本" }) //
    public dayTxt: Label = null;

    @property({ type: Label, tooltip: "数量文本" }) //
    public countTxt: Label = null;

    @property({ type: Sprite, tooltip: "背景" }) //
    public itemBg: Sprite = null;

    @property({ type: Sprite, tooltip: "礼物图标" }) //
    public iconSpr: Sprite = null;

    @property({ type: Node, tooltip: "选中边框" }) //
    public selectImg: Node = null;

    @property({ type: Node, tooltip: "卖光边框" }) //
    public clearImg: Node = null;

    @property({ type: Node, tooltip: "明日可领图标" }) //
    public tomorrowFlag: Node = null;

    @property({ type: [SpriteFrame], tooltip: "0:晶石  1:钻石  2:金币" })
    public giftIconSpr: SpriteFrame[] = [];

    _giftData: BieGiftInfo = null;

    initUI(data: BieGiftInfo) {
        this._giftData = data;
        this.selectImg.active = false;
        this.clearImg.active = false;
        this.tomorrowFlag.active = false;
        this.dayTxt.string = "DAY " + (data.DetailId + 1);

        if (data.RecFlag == 2) { //已经领取
            this.clearImg.active = true;
            this.itemBg.grayscale = true; //变灰
            this.iconSpr.grayscale = true;
        } else if (data.RecFlag == 1) { //当日可领
            this.selectImg.active = true;
        }

        let rewardData: BieGiftBaseInfo = data.Awards;
        if (rewardData.Stone > 0) {
            this.iconSpr.spriteFrame = this.giftIconSpr[0];
            this.countTxt.string = "x" + rewardData.Stone;
        }
        if (rewardData.Diamond > 0) {
            this.iconSpr.spriteFrame = this.giftIconSpr[1];
            this.countTxt.string = "x" + rewardData.Diamond;
        }
        if (rewardData.Coin > 0) {
            this.iconSpr.spriteFrame = this.giftIconSpr[2];
            this.countTxt.string = "x" + rewardData.Coin;
        }

    }

    onLoad() {
        this.initEvent();
    }

    initEvent() {
        CCUtil.onTouch(this.itemBg.node, this.onClickGift, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.itemBg.node, this.onClickGift, this);
    }

    onClickGift() {
        if (!this._giftData) {
            return;
        }
        if (this._giftData.RecFlag != 1) return; //可领取的才能点击

        /*this._giftData.RecFlag = 2; //表示已经领过了
        this.clearImg.active = true;
        this.itemBg.grayscale = true; //变灰
        this.iconSpr.grayscale = true;*/

        //模拟发送网络消息
        let detailId: number = 5; //设置明日可领的项 //this._giftData.DetailId + 1;
        //if (detailId > 6) detailId = 0;
        let awardInfo: NetGetBigGiftAwardInfo = {
            "DetailId": this._giftData.DetailId,
            "TomorrowDetailId": detailId,
        }
        EventManager.emit(EventType.NewBieGift_GetDayGift, awardInfo);
    }

    start() {

    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    update(deltaTime: number) {

    }
}


