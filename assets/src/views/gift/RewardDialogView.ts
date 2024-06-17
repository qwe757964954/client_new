import { _decorator, Component, easing, instantiate, Node, Prefab, ScrollView, tween, Vec3 } from 'cc';
import { ItemData } from '../../manager/DataMgr';
import AudioUtil from '../../util/AudioUtil';
import CCUtil from '../../util/CCUtil';
import { EffectUtil } from '../../util/EffectUtil';
import { RewardItem } from '../common/RewardItem';
import { NewbieAwardItem } from './NewbieAwardItem';
const { ccclass, property } = _decorator;

export interface RewordUIInfo {
    skinType: number; // 0:晶石  1:钻石  2:金币
    count: number; //数量
}

@ccclass('RewardDialogView')
export class RewardDialogView extends Component {

    @property({ type: Node, tooltip: "背景" })
    bg: Node = null;

    @property({ type: Node, tooltip: "光" })
    light: Node = null;

    @property({ type: Node, tooltip: "点击关闭" })
    clickNd: Node = null;

    @property({ type: ScrollView, tooltip: "奖励列表" }) //preAward
    rewardList: ScrollView = null;

    @property({ type: Prefab, tooltip: "奖励预制体" })
    preAward: Prefab = null;

    private _rewardData: ItemData[] = null; //奖励
    private _myAwardItems: RewordUIInfo[] = [];

    private _canClose: boolean = false;

    initData(data: ItemData[]) {
        this._rewardData = data;

        this._myAwardItems = [];

        this.init();

        this.show();
    }

    init() {
        this.addEvent();
        this.initView();
    }

    addEvent() {
        CCUtil.onTouch(this.clickNd, this.onCloseView, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.clickNd, this.onCloseView, this);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    initView() {
        AudioUtil.playEffect("sound/open_reward");
        var datas = [];

        this.rewardList.content.removeAllChildren();
        for (let i = 0; i < this._rewardData.length; i++) {
            let item = instantiate(this.preAward);
            this.rewardList.content.addChild(item);
            item.getComponent(RewardItem).init(this._rewardData[i]);

            let index = i;
            item.scale = new Vec3(0.2, 0.2, 1.0);
            item.pauseSystemEvents(true);
            tween(item).hide().delay(i * 0.1).show().to(0.4, { scale: new Vec3(1.0, 1.0, 1.0) }, { easing: easing.backOut }).call(() => {
                item.resumeSystemEvents(true);
                if (index == this._rewardData.length - 1) {
                    this._canClose = true;
                }
            }).start();
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
        // ViewsManager.instance.closeView(PrefabType.NewbieRewardDialogView);
        if (!this._canClose) return;
        this._canClose = false;
        EffectUtil.centerClose(this.node, () => {
            //if (this._callBack) this._callBack();
            this.dispose();
        });
    }

    //销毁
    dispose() {
        //this.removeEvent();
        this.node.destroy();
    }

    // 显示界面
    show() {
        EffectUtil.centerPopup(this.node);
        setTimeout(() => {
            this._canClose = true;
        })
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


