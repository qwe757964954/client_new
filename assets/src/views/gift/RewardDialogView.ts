import { _decorator, Component, instantiate, Node, Prefab, ScrollView, SpriteFrame } from 'cc';
import AudioUtil from '../../util/AudioUtil';
import { BieGiftBaseInfo } from './NewbieGiftDialogView';
import List from '../../util/list/List';
import { NewbieAwardItem } from './NewbieAwardItem';
import CCUtil from '../../util/CCUtil';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
const { ccclass, property } = _decorator;

export interface RewordUIInfo {
    skinType: number; // 0:晶石  1:钻石  2:金币
    count: number; //数量
}

@ccclass('RewardDialogView')
export class RewardDialogView extends Component {

    @property({ type: Node, tooltip: "背景" })
    bg: Node = null;

    @property({ type: ScrollView, tooltip: "奖励列表" }) //preAward
    rewardList: ScrollView = null;

    @property({ type: Prefab, tooltip: "奖励预制体" })
    preAward: Prefab = null;

    private _rewardData: BieGiftBaseInfo = null; //奖励
    private _myAwardItems: RewordUIInfo[] = [];

    initData(data: BieGiftBaseInfo) {
        this._rewardData = data;

        this._myAwardItems = [];

        this.init();
    }

    init() {
        this.addEvent();
        this.initView();
    }

    addEvent() {
        CCUtil.onTouch(this.bg, this.onCloseView, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.bg, this.onCloseView, this);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    initView() {
        AudioUtil.playEffect("sound/open_reward");
        var datas = [];

        if (this._rewardData.Stone > 0) {
            var dataAward: RewordUIInfo = { "skinType": 0, "count": this._rewardData.Stone };
            datas.push(dataAward);
        }
        if (this._rewardData.Diamond > 0) {
            var dataAward: RewordUIInfo = { "skinType": 1, "count": this._rewardData.Diamond };
            datas.push(dataAward);
        }
        if (this._rewardData.Coin > 0) {
            var dataAward: RewordUIInfo = { "skinType": 2, "count": this._rewardData.Coin };
            datas.push(dataAward);
        }

        this.rewardList.content.removeAllChildren();
        this._myAwardItems = datas;
        for (let i = 0; i < this._myAwardItems.length; i++) {
            this.addAwardListItem(this._myAwardItems[i]);
        }
    }

    /**向award+List里添加一项内容*/
    addAwardListItem(data: RewordUIInfo) {
        //console.log("addHitstoryList data:", data);
        if (!data) {
            return;
        }

        let itemGift = instantiate(this.preAward);
        itemGift.getComponent(NewbieAwardItem).initData(data);
        this.rewardList.content.addChild(itemGift);
    }

    //加载单词列表一项
    onLoadAwardList(item: Node, idx: number) {
        let myAwardScript: NewbieAwardItem = item.getComponent(NewbieAwardItem);
        let itemInfo: RewordUIInfo = this._myAwardItems[idx];
        myAwardScript.initData(itemInfo);
    }

    onCloseView() {
        ViewsManager.instance.closeView(PrefabType.NewbieRewardDialogView);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


