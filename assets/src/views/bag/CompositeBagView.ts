import { _decorator, instantiate, isValid, Label, Node, Prefab, UITransform, Widget } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ItemID } from '../../export/ItemConfig';
import { ItemData } from '../../manager/DataMgr';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { ObjectUtil } from '../../util/ObjectUtil';
import { RewardItem } from '../common/RewardItem';
import { BagConfig } from './BagConfig';
import { BackpackItemInfo } from './BagInfo';
import { CaleBagView } from './CaleBagView';

const { ccclass, property } = _decorator;

const Merge_Item_Width = 115;
const Add_Item_Width = 30;

@ccclass('CompositeBagView')
export class CompositeBagView extends BasePopup {

    @property(List)
    public goods_list: List = null;

    @property(List)
    public composite_list: List = null;

    @property(List)
    public add_list: List = null;

    @property(Node)
    public btn_composite: Node = null;

    @property(CaleBagView)
    public caleBagView: CaleBagView = null;

    @property(Node)
    public target_node: Node = null;

    @property(Label)
    public target_text: Label = null;

    @property(Label)
    public coin_text: Label = null;

    private _backpackItemInfos: BackpackItemInfo[] = [];
    private _selectedItemInfo: BackpackItemInfo = null;
    private _mergeItems: ItemData[] = [];
    private _coinItem: ItemData = null;

    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]);
        this.caleBagView.setCaleMax(1);
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.btn_composite, this.onCompositeClick.bind(this));
    }

    private onCompositeClick(): void {
        if (User.coin < this._coinItem.num) {
            ViewsManager.showTip(TextConfig.Insufficient_Gold_Synthesize);
            return;
        }

        if (!this.canMergeItems()) {
            ViewsManager.showTip(TextConfig.Insufficient_Goods_Synthesize);
            return;
        }
        EventMgr.dispatch(EventType.Bag_Composite_Event,this._selectedItemInfo);
        this.closePop();
    }

    private canMergeItems(): boolean {
        return this._mergeItems.every(mergeItem => {
            let arrayData = BagConfig.convertItemArrayData(User.itemAry);
            const userItem =  arrayData.find(userItem => userItem.id === mergeItem.id);
            return userItem && userItem.num >= mergeItem.num;
        });
    }

    private getMergeItemIndex(item: ItemData): number {
        if (!this._backpackItemInfos) {
            console.error("BagConfigInfo is not loaded.");
            return -1;
        }
        return this._backpackItemInfos.findIndex(backpackItem => backpackItem.id === item.id);
    }

    public updateMergeItem(item: ItemData): void {
        this._backpackItemInfos = BagConfig.filterCanMergeItems();
        this.goods_list.numItems = this._backpackItemInfos.length;
        this.goods_list.selectedId = this.getMergeItemIndex(item);
    }

    private updateMergeInfo(itemInfo: BackpackItemInfo): void {
        this._selectedItemInfo = itemInfo;
        this.target_text.string = itemInfo.name;
        this.showTargetProps(itemInfo.id);

        const data = BagConfig.findMergeItems(itemInfo);
        this._mergeItems = ObjectUtil.convertRewardData(data);
        this._coinItem = this._mergeItems.find(item => item.id === ItemID.coin);
        this._mergeItems = this._mergeItems.filter(item => item.id !== ItemID.coin);

        this.coin_text.string = `${this._coinItem.num}`;
        this.composite_list.numItems = this._mergeItems.length;
        this.add_list.numItems = this._mergeItems.length - 1;

        this.updateScrollProps(this.composite_list, Merge_Item_Width, 50);
        this.updateScrollProps(this.add_list, Add_Item_Width, 145);
    }

    private updateScrollProps(listScroll: List, itemWidth: number, spacing: number): void {
        const scrollView = listScroll.scrollView;
        const count = this._mergeItems.length;
        const widthCount = itemWidth * count + (count - 1) * spacing;
        scrollView.getComponent(UITransform).width = widthCount;
        scrollView.view.getComponent(UITransform).width = widthCount;
        scrollView.getComponent(Widget).updateAlignment();
    }

    private async showTargetProps(itemId: number): Promise<void> {
        let node = this.target_node.getChildByName("RewardItem");
        if (!isValid(node)) {
            const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.RewardItem.path}`, Prefab);
            node = instantiate(prefab);
            this.target_node.addChild(node);
        }
        const itemScript: RewardItem = node.getComponent(RewardItem);
        const nodeTrans = node.getComponent(UITransform);
        const scale = 97 / nodeTrans.height;
        node.setScale(scale, scale, scale);

        const data: ItemData = { id: itemId, num: 1 };
        itemScript.init(data);
    }

    public onLoadGoodsListHorizontal(item: Node, idx: number): void {
        const itemScript: RewardItem = item.getComponent(RewardItem);
        const nodeTrans = item.getComponent(UITransform);
        const scale = 97 / nodeTrans.height;
        item.setScale(scale, scale, scale);

        const data: ItemData = { id: this._backpackItemInfos[idx].id, num: 1 };
        itemScript.init(data);
    }

    public onGoodsListSelected(item: any, selectedId: number, lastSelectedId: number, val: number): void {
        if (!isValid(selectedId) || selectedId < 0 || !isValid(item)) { return; }
        this.updateMergeInfo(this._backpackItemInfos[selectedId]);
    }

    public onLoadCompositeListHorizontal(item: Node, idx: number): void {
        const itemScript: RewardItem = item.getComponent(RewardItem);
        const nodeTrans = item.getComponent(UITransform);
        const scale = 97 / nodeTrans.height;
        item.setScale(scale, scale, scale);

        const data: ItemData = { id: this._mergeItems[idx].id, num: this._mergeItems[idx].num };
        itemScript.init(data);
    }
}
