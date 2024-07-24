import { _decorator, instantiate, isValid, Label, Layout, Node, Prefab, UITransform, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ItemData } from '../../manager/DataMgr';
import { ResLoader } from '../../manager/ResLoader';
import { BasePopup } from '../../script/BasePopup';
import { BagServer } from '../../service/BagService';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { RewardItem } from '../common/RewardItem';
import { TKConfig } from '../task/TaskConfig';
import { BagConfig } from './BagConfig';
import { CaleBagView } from './CaleBagView';

const { ccclass, property } = _decorator;

@ccclass('BreakdownView')
export class BreakdownView extends BasePopup {

    @property(List)
    public item_list: List = null;

    @property(Node)
    public sure_btn: Node = null;

    @property(CaleBagView)
    public caleBagView: CaleBagView = null;

    @property(Node)
    public source_node: Node = null;

    @property(Label)
    public source_text: Label = null;

    private _breakdownDatas: ItemData[] = [];
    private _sourceItem: ItemData = null;

    public initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]);
    }

    public initEvent(): void {
        CCUtil.onBtnClick(this.sure_btn, this.onClickSure.bind(this));
    }

    public updateBreakDownItem(item: ItemData): void {
        this._sourceItem = item;
        this.caleBagView.setCaleMax(item.num);
        this.showSourceProps();
        const breakdownIds = BagConfig.findBreakdownItems(item);
        this._breakdownDatas = TKConfig.convertRewardData(breakdownIds);
        this.source_text.string = BagConfig.findItemInfo(item).name;
        this.item_list.numItems = this._breakdownDatas.length;
        this.updateRewardScroll();
    }

    private updateRewardScroll(): void {
        const scrollView = this.item_list.scrollView;
        const contentTransform = scrollView.content.getComponent(UITransform);
        const scrollViewTransform = scrollView.getComponent(UITransform);
        const layout = scrollView.content.getComponent(Layout);

        layout.updateLayout();
        scrollViewTransform.width = contentTransform.width;
        scrollView.view.getComponent(UITransform).width = contentTransform.width;
        scrollView.getComponent(Widget).updateAlignment();
    }

    private onClickSure(): void {
        BagServer.reqBreakdownBackpackItems(this._sourceItem);
        this.closePop();
    }

    private async showSourceProps(): Promise<void> {
        let node = this.source_node.getChildByName("RewardItem");
        if (!isValid(node)) {
            const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.RewardItem.path}`, Prefab);
            node = instantiate(prefab);
            this.source_node.addChild(node);
        }
        const itemScript: RewardItem = node.getComponent(RewardItem);
        const nodeTransform = node.getComponent(UITransform);
        const scale = 97 / nodeTransform.height;
        node.setScale(scale, scale, scale);

        const data: ItemData = { id: this._sourceItem.id, num: this._sourceItem.num };
        itemScript.init(data);
    }

    public onLoadItemListHorizontal(item: Node, idx: number): void {
        const itemScript: RewardItem = item.getComponent(RewardItem);
        const nodeTransform = item.getComponent(UITransform);
        const scale = 97 / nodeTransform.height;
        item.setScale(scale, scale, scale);

        const data: ItemData = { id: this._breakdownDatas[idx].id, num: this._breakdownDatas[idx].num };
        itemScript.init(data);
    }
}
