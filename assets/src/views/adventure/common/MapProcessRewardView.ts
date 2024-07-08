import { _decorator, Component, Node, UITransform, Widget } from 'cc';
import { BasePopup } from '../../../script/BasePopup';
import List from '../../../util/list/List';
import { ItemData } from '../../../manager/DataMgr';
import CCUtil from '../../../util/CCUtil';
import { RewardItem } from '../../common/RewardItem';
const { ccclass, property } = _decorator;

@ccclass('MapProcessRewardView')
export class MapProcessRewardView extends BasePopup {
    @property(List)
    public reward_scroll: List = null;

    @property(Node)
    public sure_btn: Node = null;

    private _rewardArr: ItemData[] = null;

    //初始化
    public initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]).then(() => {

        });
    }
    // 初始化UI
    initEvent() {
        CCUtil.onBtnClick(this.sure_btn, () => {
            this.closePop();
        });
    }

    updateRewardScroll(rewardArr: ItemData[]): void {
        this._rewardArr = rewardArr;
        this.reward_scroll.numItems = rewardArr.length;
        let scrollView = this.reward_scroll.scrollView;
        scrollView.getComponent(UITransform).width = scrollView.content.getComponent(UITransform).width;
        scrollView.view.getComponent(UITransform).width = scrollView.content.getComponent(UITransform).width;
        scrollView.getComponent(Widget).updateAlignment();
    }

    loadRewardDataHorizontal(item: Node, idx: number): void {
        let itemScript: RewardItem = item.getComponent(RewardItem);
        let node_trans = item.getComponent(UITransform);
        let scale = 92.4 / node_trans.height;
        item.setScale(scale, scale, scale)
        itemScript.init(this._rewardArr[idx]);
    }
}


