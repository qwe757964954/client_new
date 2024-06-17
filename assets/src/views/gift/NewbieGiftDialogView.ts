import { _decorator, Component, EventTouch, instantiate, Node, Prefab, ScrollView, Sprite } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ItemData } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { NewbieGiftItem } from './NewbieGiftItem';
import { RewardDialogView } from './RewardDialogView';
const { ccclass, property } = _decorator;

//新人大礼结构体
export interface BieGiftInfo {

    DetailId: number; //第几天的礼物，从0~6
    RecFlag: number;  //2：礼物已经领取，1：被选中状态
    Awards: BieGiftBaseInfo;   //具体礼物信息
}

// 单个礼物基本信息
export interface BieGiftBaseInfo {
    Stone: number; //石头数
    Diamond: number; //钻石数
    Coin: number;  //金币数
}

//获取新人大奖励
export interface NetGetBigGiftAwardInfo {
    DetailId: number; // 点击领的是哪天奖励ID
    TomorrowDetailId: number; //明天是哪个奖励天数ID可领
}

let giftArray: BieGiftInfo[] = [
    { "DetailId": 0, RecFlag: 1, Awards: { "Stone": 0, "Diamond": 100, "Coin": 0 } },
    { "DetailId": 1, RecFlag: 0, Awards: { "Stone": 0, "Diamond": 100, "Coin": 0 } },
    { "DetailId": 2, RecFlag: 0, Awards: { "Stone": 100, "Diamond": 0, "Coin": 0 } },
    { "DetailId": 3, RecFlag: 0, Awards: { "Stone": 100, "Diamond": 0, "Coin": 0 } },
    { "DetailId": 4, RecFlag: 0, Awards: { "Stone": 0, "Diamond": 0, "Coin": 100 } },
    { "DetailId": 5, RecFlag: 0, Awards: { "Stone": 0, "Diamond": 0, "Coin": 100 } },
    { "DetailId": 6, RecFlag: 0, Awards: { "Stone": 0, "Diamond": 300, "Coin": 0 } }
];

@ccclass('NewbieGiftDialogView')
export class NewbieGiftDialogView extends Component {
    @property({ type: Node, tooltip: "返回按钮" })
    public btn_close: Node = null;

    @property({ type: Sprite, tooltip: "皮肤精灵" }) //
    public skinImg: Sprite = null;

    @property({ type: Node, tooltip: "清除图片" }) //bigItem
    public lastClearImg: Node = null;

    @property({ type: Node, tooltip: "右边皮肤单位" })
    public bigItem: Node = null;

    @property({ type: Node, tooltip: "明日可领" })
    public tomorrowFlag: Node = null;

    @property({ type: ScrollView, tooltip: "购买的商品礼物列表" })
    public sixdayList: ScrollView = null;

    @property({ type: Prefab, tooltip: "礼物预制体" })
    public preGift: Prefab = null;

    private _getDayGiftEveId: string = "";

    private lastDayDetail: BieGiftInfo = null; //最后一天的详细数据

    //临时数据，代替网络返回数据
    public static _giftArray: BieGiftInfo[] = [
        { "DetailId": 0, RecFlag: 0, Awards: { "Stone": 0, "Diamond": 100, "Coin": 0 } },
        { "DetailId": 1, RecFlag: 2, Awards: { "Stone": 0, "Diamond": 100, "Coin": 0 } },
        { "DetailId": 2, RecFlag: 2, Awards: { "Stone": 100, "Diamond": 0, "Coin": 0 } },
        { "DetailId": 3, RecFlag: 0, Awards: { "Stone": 100, "Diamond": 0, "Coin": 0 } },
        { "DetailId": 4, RecFlag: 0, Awards: { "Stone": 0, "Diamond": 0, "Coin": 100 } },
        { "DetailId": 5, RecFlag: 0, Awards: { "Stone": 0, "Diamond": 0, "Coin": 100 } },
        { "DetailId": 6, RecFlag: 1, Awards: { "Stone": 0, "Diamond": 300, "Coin": 0 } }
    ];

    _data: BieGiftInfo[] = null;

    initData(data: BieGiftInfo[]) {
        this._data = data;
        this.initEvent();
        this.initView();
    }

    private initView() {
        this.tomorrowFlag.active = false;
        this.lastClearImg.active = false;
        this.bigItem.getChildByName("selectImg").active = false;

        this.lastDayDetail = this._data[this._data.length - 1];
        this.lastClearImg.active = (this.lastDayDetail.RecFlag == 2);
        this.bigItem.getChildByName("selectImg").active = (this.lastDayDetail.RecFlag == 1);

        this.sixdayList.content.removeAllChildren(); //只包含6天
        for (let i = 0; i < this._data.length - 1; i++) {
            let data = this._data[i];
            this.addGiftListItem(data);
        }
        this.sixdayList.scrollToTop();

    }

    /**向giftList里添加一项内容*/
    addGiftListItem(data: BieGiftInfo) {
        //console.log("addHitstoryList data:", data);
        if (!data) {
            return;
        }

        let itemGift = instantiate(this.preGift);
        itemGift.getComponent(NewbieGiftItem).initUI(data);
        this.sixdayList.content.addChild(itemGift);
    }

    private initEvent() {
        CCUtil.onTouch(this.btn_close, this.onCloseView, this);
        CCUtil.onTouch(this.bigItem, this.onBigItemClick, this);
        this._getDayGiftEveId = EventManager.on(EventType.NewBieGift_GetDayGift, this.onGetDayGift.bind(this));
    }

    private removeEvent() {
        CCUtil.offTouch(this.btn_close, this.onCloseView, this);
        CCUtil.offTouch(this.bigItem, this.onBigItemClick, this);
        EventManager.off(EventType.NewBieGift_GetDayGift, this._getDayGiftEveId);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    onGetDayGift(awardInfo: NetGetBigGiftAwardInfo) {
        let detailId: number = awardInfo.DetailId;
        let tomorrowDetailId: number = awardInfo.TomorrowDetailId;

        if (detailId < 0 || detailId > 6) {
            return;
        }
        for (let i = 0; i < this.sixdayList.content.children.length; i++) {
            let child: Node = this.sixdayList.content.children[i];
            let giftItemScript: NewbieGiftItem = child.getComponent(NewbieGiftItem);
            let giftData: BieGiftInfo = giftItemScript._giftData;
            let detailIdGift: number = giftData.DetailId;
            if (detailId === detailIdGift) {
                this.sixdayList.content.children[i].getComponent(NewbieGiftItem)._giftData.RecFlag = 2; //表示已经领过了
                giftItemScript.clearImg.active = true;
                giftItemScript.itemBg.grayscale = true; //变灰
                giftItemScript.iconSpr.grayscale = true;
            }
            if (tomorrowDetailId == detailIdGift) {
                giftItemScript.tomorrowFlag.active = true;
            }
            if (tomorrowDetailId == 6) {
                this.tomorrowFlag.active = true;
            }

            ViewsManager.instance.showView(PrefabType.NewbieRewardDialogView, (node: Node) => {
                let awardInfo: ItemData = {
                    "id": 1,
                    "num": 200,
                }
                let awardInfo2: ItemData = {
                    "id": 2,
                    "num": 300,
                }
                node.getComponent(RewardDialogView).initData([awardInfo, awardInfo2]);
            }); //打开新人七天大礼页面
        }
    }

    onBigItemClick(e: EventTouch) {
        if (this.lastDayDetail.RecFlag != 1) return;
        //模拟发送网络消息
        let detailId: number = 0; //设置明日可领的项 //this._giftData.DetailId + 1;
        //if (detailId > 6) detailId = 0;
        let awardInfo: NetGetBigGiftAwardInfo = {
            "DetailId": this.lastDayDetail.DetailId,
            "TomorrowDetailId": detailId,
        }
        EventManager.emit(EventType.NewBieGift_GetDayGift, awardInfo);
    }

    private onCloseView() {
        ViewsManager.instance.closeView(PrefabType.NewbieGiftDialogView);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


