import { _decorator, Component, Label, Node, UITransform, Widget } from 'cc';
import { BasePopup } from '../../../script/BasePopup';
import List from '../../../util/list/List';
import { ItemData } from '../../../manager/DataMgr';
import CCUtil from '../../../util/CCUtil';
import { RewardItem } from '../../common/RewardItem';
import { ProgressRewardData, ProgressRewardReply } from '../../../models/AdventureModel';
import { ServiceMgr } from '../../../net/ServiceManager';
import { InterfacePath } from '../../../net/InterfacePath';
import { ViewsManager, ViewsMgr } from '../../../manager/ViewsManager';
import { MapRewardBoxItem } from '../levelmap/MapRewardBoxItem';
const { ccclass, property } = _decorator;

@ccclass('MapProcessRewardView')
export class MapProcessRewardView extends BasePopup {
    @property(List)
    public reward_scroll: List = null;

    @property(Node)
    public sure_btn: Node = null;
    @property(Label)
    public btn_label: Label = null;

    private _rewardArr: ItemData[] = null;
    private _rewardData: ProgressRewardData = null;
    private _item: MapRewardBoxItem;

    //初始化
    public initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]).then(() => {

        });
    }
    // 初始化UI
    initEvent() {
        CCUtil.onBtnClick(this.sure_btn, () => {
            if (this.btn_label.string == "确定") {
                this.closePop();
            } else { //领取奖励
                console.log("领取奖励");
                ServiceMgr.studyService.getProgressReward(this._rewardData.big_id, this._rewardData.pass_count);
            }
        });
    }

    onGetProgressReward(data: ProgressRewardReply) {
        if (data.code != 200) {
            ViewsManager.showTip(data.msg);
            return;
        }
        this._item.openBox().then(() => {
            ViewsMgr.showRewards(data.pass_reward);
            this.closePop();
        });
    }

    onInitModuleEvent() {
        super.onInitModuleEvent();
        this.addModelListener(InterfacePath.Progress_RewardGet, this.onGetProgressReward);
    }

    updateRewardScroll(rewardData: ProgressRewardData, passNum: number, item: MapRewardBoxItem): void {
        this._rewardData = rewardData;
        this._rewardArr = rewardData.pass_reward;
        this._item = item;
        this.reward_scroll.numItems = this._rewardArr.length;
        let scrollView = this.reward_scroll.scrollView;
        scrollView.getComponent(UITransform).width = scrollView.content.getComponent(UITransform).width;
        scrollView.view.getComponent(UITransform).width = scrollView.content.getComponent(UITransform).width;
        scrollView.getComponent(Widget).updateAlignment();
        if (passNum >= rewardData.pass_count) {
            this.btn_label.string = "领取";
        } else {
            this.btn_label.string = "确定";
        }
    }

    loadRewardDataHorizontal(item: Node, idx: number): void {
        let itemScript: RewardItem = item.getComponent(RewardItem);
        let node_trans = item.getComponent(UITransform);
        let scale = 92.4 / node_trans.height;
        item.setScale(scale, scale, scale)
        itemScript.init(this._rewardArr[idx]);
    }
}


