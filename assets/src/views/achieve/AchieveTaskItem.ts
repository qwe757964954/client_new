import { _decorator, Component, instantiate, Label, Node, Prefab, ScrollView, Sprite, SpriteFrame } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { AchieveAwardItem } from './AchieveAwardItem';
import { RewordUIInfo } from '../gift/RewardDialogView';
import { ArchConfig } from '../../manager/DataMgr';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import { ArchieveGetAwardInfo } from './AchieveDialogView';
const { ccclass, property } = _decorator;

export interface AchieveTaskUIInfo {
    Score: number; //分数
    Info: string; //任务信息
    T: number; //总进度
    Awards: string[]; //奖励
    Status: number; //状态
}

@ccclass('AchieveTaskItem')
export class AchieveTaskItem extends Component {
    @property({ type: [SpriteFrame], tooltip: "按钮图标组 0:蓝色 1:红色" }) //preGift
    public sprBtnGetAry: SpriteFrame[] = [];

    @property({ type: [SpriteFrame], tooltip: "奖励里金币和钻石数组 0:金币 1:钻石" })
    public sprAwardItemAry: SpriteFrame[] = [];

    @property({ type: Prefab, tooltip: "奖励预制体" })
    public preAward: Prefab = null;

    private _scoreTxt: Label = null;
    private _infoTxt: Label = null;
    private _processTxt: Label = null;
    private _btnGet: Node = null;
    private _awardList: ScrollView = null;
    private _passIcon: Sprite = null;

    private _data: ArchConfig = null;

    protected onLoad(): void {
        this._scoreTxt = this.node.getChildByName("scoreTxt").getComponent(Label);
        this._infoTxt = this.node.getChildByName("infoTxt").getComponent(Label);
        this._processTxt = this.node.getChildByName("processTxt").getComponent(Label);
        this._btnGet = this.node.getChildByName("btnGet");
        this._awardList = this.node.getChildByName("propList").getComponent(ScrollView);
        this._passIcon = this.node.getChildByName("passIcon").getComponent(Sprite);

        this.initEvent();
    }



    protected onDestroy(): void {
        this.removeEvent();
    }

    initEvent() {
        CCUtil.onTouch(this._btnGet, this.onClickBtnGet, this)
    }

    removeEvent() {
        CCUtil.offTouch(this._btnGet, this.onClickBtnGet, this)
    }

    init(data: ArchConfig) {
        this._data = data;
        this._passIcon.node.active = false;
        this._scoreTxt.string = data.Score.toString();
        this._infoTxt.string = data.Info;
        this._processTxt.string = "0/" + data.T;
        if (data.Status == 0) { //未完成，前往
            this._btnGet.getComponent(Sprite).spriteFrame = this.sprBtnGetAry[0];
            this._btnGet.getChildByName("btnLabel").getComponent(Label).string = TextConfig.Achieve_GoTo; //前往
            this._btnGet.active = true;
            this._passIcon.node.active = false;
        }
        else if (data.Status == 1) { //已经完成，可以领取
            this._btnGet.getComponent(Sprite).spriteFrame = this.sprBtnGetAry[1];
            this._btnGet.getChildByName("btnLabel").getComponent(Label).string = TextConfig.Achieve_GetAward; //领取
            this._btnGet.active = true;
            this._passIcon.node.active = false;
        } else if (data.Status == 2) { //已经完成且领取过
            this._btnGet.active = false;
            this._passIcon.node.active = true;
        }

        this._awardList.content.removeAllChildren();

        let goldNum: number = Number(this._data.Awards[0]); //金币数量
        this.addAwardListItem(goldNum, 0);
        let diamondNum: number = Number(this._data.Awards[1]); //金币数量
        this.addAwardListItem(diamondNum, 1);
        this._awardList.scrollToLeft();
    }

    /**奖励类型，0 金币， 1 钻石，配置表里只有这两个类型 */
    private addAwardListItem(num: number, type: number) {
        let itemGift = instantiate(this.preAward);
        let data: RewordUIInfo = { skinType: 2, count: 0 };
        data.count = num;
        if (type == 0) { //金币
            data.skinType = 2;
        }
        else { // 钻石
            data.skinType = 1;
        }
        this._awardList.content.addChild(itemGift);
        itemGift.getComponent(AchieveAwardItem).initData(data);

    }

    /**点击领取奖励 */
    onClickBtnGet() {
        if (this._data.Status == 1) {
            let data: ArchieveGetAwardInfo = {
                AchId: this._data.AchId,
                Awards: this._data.Awards,
            }
            EventManager.emit(EventType.Achieve_GetAward, data);
        }

    }

    start() {

    }

    update(deltaTime: number) {

    }
}


