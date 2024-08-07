import { _decorator, instantiate, isValid, Layers, Node, Prefab, UITransform, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ItemID } from '../../export/ItemConfig';
import { ItemData } from '../../manager/DataMgr';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { BagServer } from '../../service/BagService';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { NodeUtil } from '../../util/NodeUtil';
import { RewardItem } from '../common/RewardItem';
import { TKConfig } from '../task/TaskConfig';
import { BagConfig } from './BagConfig';
import { BagDressItem } from './BagDressItem';
import { BackpackItemInfo, BagGressItems, BagItemType, BagOperationData, BagOperationIds, BagTabIds, BagTabNames } from './BagInfo';
import { BagOperrationItem } from './BagOperrationItem';
import { BagTabItem } from './BagTabItem';
import { BreakdownView } from './BreakdownView';
import { CompositeBagView } from './CompositeBagView';

const { ccclass, property } = _decorator;

@ccclass('BagDialogView')
export class BagDialogView extends BaseView {

    @property(Node)
    public btn_close: Node = null;

    @property(Node)
    public top_layout: Node = null;

    @property({ type: List })
    public propList: List = null;

    @property({ type: Prefab, tooltip: "物品预制体" })
    public propPrefab: Prefab = null;

    @property({ type: Prefab, tooltip: "角色动画预制体" })
    public roleModel: Prefab = null; // 角色动画

    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;

    @property(List)
    public tabList: List = null;

    @property(List)
    public dress_list: List = null;

    @property(List)
    public op_list: List = null;

    private _role: Node = null;
    private _propsDatas: ItemData[] = [];
    private _opDatas: BagOperationData[] = [];
    private _selectedItem: ItemData = null;

    private _compositeInfo: BackpackItemInfo = null;
    private _breakdownInfo: ItemData = null;
    private _tabSelected: number = 0;

    initEvent() {
        CCUtil.onBtnClick(this.btn_close, this.onCloseView.bind(this));
    }

    protected onInitModuleEvent() {
        this.addModelListeners([
            [EventType.Bag_PropList, this.onPropList.bind(this)],
            [EventType.Bag_Composite_Event, this.onCompositeRequest.bind(this)],
            [EventType.Bag_Breakdown_Event, this.onBreakdownRequest.bind(this)],
            [EventType.Item_Props_Refresh, this.onItemPropsRefresh.bind(this)],
            [NetNotify.Classification_BreakdownBackpackItems, this.onBreakdownBackpackItems.bind(this)],
            [NetNotify.Classification_BackpackItemSynthesis, this.onBackpackItemSynthesis.bind(this)],
        ]);
    }

    onCompositeRequest(itemInfo: BackpackItemInfo) {
        this._compositeInfo = itemInfo;
        BagServer.reqBackpackItemSynthesis(this._compositeInfo);
    }

    onBreakdownRequest(item: ItemData) {
        this._breakdownInfo = item;
        BagServer.reqBreakdownBackpackItems(this._breakdownInfo);
    }

    onItemPropsRefresh() {
        this.tabList.selectedId = -1;
        this.tabList.selectedId = this._tabSelected;
    }

    async initUI() {
        await BagConfig.loadBagConfigInfo();
        this.initAmount();
        this.showRoleDress();
        this.tabList.numItems = BagTabNames.length;
        this.tabList.selectedId = 0;
        this.dress_list.numItems = BagGressItems.length;
    }

    onPropList(propDatas: ItemData[]) {
        // Implement as needed
    }

    onBreakdownBackpackItems(data: any) {
        console.log("onBreakdownBackpackItems", data);
        let itemInfo = BagConfig.findBackpackItemInfo(this._breakdownInfo.id);
        const datas = BagConfig.findBreakdownItems(this._breakdownInfo);
        let decomposeItems = TKConfig.convertRewardData(datas);
        let tipMsg = `你成功把${this._breakdownInfo.num}个${itemInfo.name}分解了，获得`;
        decomposeItems.forEach((itemData, index) => {
            let itemInfo = BagConfig.findBackpackItemInfo(itemData.id);
            let itemQuantity = itemData.num * this._breakdownInfo.num;
            itemData.num = itemQuantity;
            tipMsg += `${itemQuantity}个${itemInfo.name}`;
            if (index < decomposeItems.length - 1) {
                tipMsg += '，';
            }
        });
        ViewsMgr.showRewards(decomposeItems);
        ViewsManager.showTip(tipMsg);
    }

    onBackpackItemSynthesis(data: any) {
        const datas = BagConfig.findMergeItems(this._compositeInfo);
        let mergeItems = TKConfig.convertRewardData(datas);
        mergeItems = mergeItems.filter(item => item.id !== ItemID.coin);
        let itemInfo = BagConfig.findBackpackItemInfo(mergeItems[0].id);
        let tipMsg = `你成功把${mergeItems[0].num}个${itemInfo.name}合成了${this._compositeInfo.name}`;
        let itemData = [{ id: this._compositeInfo.id, num: 1 }];
        ViewsMgr.showRewards(itemData);
        ViewsManager.showTip(tipMsg);
    }

    initAmount() {
        ViewsManager.addAmout(this.top_layout, 11.314, 260.722)
    }

    onCloseView() {
        ViewsManager.instance.closeView(PrefabType.BagView);
    }

    private showRoleDress() {
        this.roleContainer.removeAllChildren();
        this._role = instantiate(this.roleModel);
        this._role.setScale(v3(2, 2, 1));
        this.roleContainer.addChild(this._role);
        NodeUtil.setLayerRecursively(this._role, Layers.Enum.UI_2D);
        let roleModel = this._role.getComponent(RoleBaseModel);
        roleModel.initSelf();
        roleModel.show(true);
    }

    onLoadPropsGrid(item: Node, idx: number) {
        const itemScript = item.getComponent(RewardItem);
        const nodeTrans = item.getComponent(UITransform);
        const scale = 125 / nodeTrans.height;
        item.setScale(scale, scale, scale);
        const data: ItemData = this._propsDatas[idx];
        itemScript.init(data);
    }

    onPropsGridSelected(item: Node, selectedId: number, lastSelectedId: number, val: number) {
        if (isValid(item) && selectedId >= 0) {
            this.onPropsSelected(this._propsDatas[selectedId]);
        }
    }

    onPropsSelected(selData: ItemData) {
        this._selectedItem = selData;
        this._opDatas = BagConfig.getItemCanOperations(selData);
        this.op_list.numItems = this._opDatas.length;
    }

    onLoadDressGrid(item: Node, idx: number) {
        const itemScript = item.getComponent(BagDressItem);
        itemScript.updateTabProps(BagGressItems[idx]);
    }

    onDressGridSelected(item: Node, selectedId: number) {
        if (isValid(item) && selectedId >= 0) {
            console.log("onDressGridSelected", selectedId);
        }
    }

    onLoadTabHorizontal(item: Node, idx: number) {
        const itemScript = item.getComponent(BagTabItem);
        itemScript.updateTabProps(BagTabNames[idx].title);
    }

    onTabHorizontalSelected(item: Node, selectedId: number) {
        if (isValid(item) && selectedId >= 0) {
            console.log("onTabHorizontalSelected", selectedId);
            this._tabSelected = selectedId;
            this.selectTabInfo(BagTabNames[selectedId]);
        }
    }

    selectTabInfo(tabInfo: any) {
        let arrayData = BagConfig.convertItemArrayData(User.itemAry);
        const filteredBackpackItems = BagConfig.filterBagItems(arrayData);
        switch (tabInfo.id) {
            case BagTabIds.All:
                this._propsDatas = filteredBackpackItems;
                break;
            case BagTabIds.DressUp:
                this._propsDatas = BagConfig.filterItemsByType(filteredBackpackItems, BagItemType.Costume);
                break;
            case BagTabIds.Consumables:
                this._propsDatas = BagConfig.filterItemsByType(filteredBackpackItems, BagItemType.Consumable);
                break;
            case BagTabIds.Others:
                this._propsDatas = BagConfig.filterItemsByType(filteredBackpackItems, BagItemType.Other);
                break;
            default:
                break;
        }
        this.propList.numItems = this._propsDatas.length;
        this.propList.selectedId = 0;
    }

    onOperationHorizontal(item: Node, idx: number) {
        const itemScript = item.getComponent(BagOperrationItem);
        itemScript.updateOperationProps(this._opDatas[idx]);
    }

    onOperationHorizontalSelected(item: Node, selectedId: number) {
        if (isValid(item) && selectedId >= 0) {
            console.log("onOperationHorizontalSelected", selectedId);
            this.onOperationClick(this._opDatas[selectedId]);
        }
    }

    onOperationClick(data: BagOperationData) {
        switch (data.id) {
            case BagOperationIds.Outfit:
                // Implement as needed
                break;
            case BagOperationIds.UnOutfit:
                // Implement as needed
                break;
            case BagOperationIds.Disassemble:
                this.onDisassemble();
                break;
            case BagOperationIds.Combine:
                this.onComposite();
                break;
            default:
                break;
        }
    }

    async onDisassemble() {
        console.log("onDisassemble");
        const node = await ViewsManager.instance.showPopup(PrefabType.BreakdownView);
        const nodeScript = node.getComponent(BreakdownView);
        nodeScript.updateBreakDownItem(this._selectedItem);
    }

    async onComposite() {
        console.log("onComposite");
        const node = await ViewsManager.instance.showPopup(PrefabType.CompositeBagView);
        const nodeScript = node.getComponent(CompositeBagView);
        nodeScript.updateMergeItem(this._selectedItem);
    }
}
