import { _decorator, instantiate, isValid, Layers, Node, Prefab, UITransform, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ItemID } from '../../export/ItemConfig';
import { ClothingInfo, ClothingType, DataMgr, ItemData } from '../../manager/DataMgr';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { DressInfoItem } from '../../models/BagModel';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { RoleModel } from '../../models/RoleModel';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { BagServer } from '../../service/BagService';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { NodeUtil } from '../../util/NodeUtil';
import { ObjectUtil } from '../../util/ObjectUtil';
import { RewardItem } from '../common/RewardItem';
import { ShopClothingInfo } from '../shop/ShopInfo';
import { BagConfig } from './BagConfig';
import { BagDressItem } from './BagDressItem';
import { ActionModel, ActionType, BackpackItemInfo, BagGressItemIds, BagGressItems, BagGressTypeMap, BagItemType, BagOperationData, BagOperationIds, BagTabIds, BagTabNames } from './BagInfo';
import { BagOperrationItem } from './BagOperrationItem';
import { BagTabItem } from './BagTabItem';
import { BreakdownView } from './BreakdownView';
import { CompositeBagView } from './CompositeBagView';

const { ccclass, property } = _decorator;

@ccclass('BagDialogView')
export class BagDialogView extends BaseView {
    @property(Node) public btn_close: Node = null;
    @property(Node) public top_layout: Node = null;
    @property({ type: List }) public propList: List = null;
    @property({ type: Prefab, tooltip: "物品预制体" }) public propPrefab: Prefab = null;
    @property({ type: Prefab, tooltip: "角色动画预制体" }) public roleModel: Prefab = null;
    @property({ type: Node, tooltip: "角色容器" }) public roleContainer: Node = null;
    @property(List) public tabList: List = null;
    @property(List) public dress_list: List = null;
    @property(List) public op_list: List = null;

    private _role: Node = null;
    private _propsDatas: ItemData[] = [];
    private _opDatas: BagOperationData[] = [];
    private _selectedItem: ItemData = null;
    private _propsSelected: number = 0;
    private _compositeInfo: BackpackItemInfo = null;
    private _breakdownInfo: ItemData = null;
    private _tabSelected: number = 0;
    private _bagClothing: { [key in BagGressItemIds]?: ShopClothingInfo } = {};
    private _bagOperationId: BagOperationIds = BagOperationIds.Combine;

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
            [NetNotify.Classification_UpdatePlayerClothing, this.onUpdatePlayerClothing.bind(this)],
            [EventType.Bag_Player_Action_Event, this.onBagPlayerAction.bind(this)],
        ]);
    }
    onBagPlayerAction(model: ActionModel) {
        const roleModel = this._role.getComponent(RoleModel);
        switch (model.type) {
            case ActionType.Idle:
                roleModel.idle();
                break;
            case ActionType.Wave:
                roleModel.waved();
                break;
            case ActionType.Walk:
                roleModel.walk();
                break;
            case ActionType.Run:
                roleModel.run();
                break;
            case ActionType.Jump:
                roleModel.jump();
                break;
            case ActionType.Die:
                roleModel.die();
                break;
            default:
                break;
        }
    }
    async initUI() {
        console.log("User.userClothes.....", User.userClothes);
        await BagConfig.loadBagConfigInfo();
        this.updateBagClothingMapping();
        this.initAmount();
        this.showRoleDress();
        this.tabList.numItems = BagTabNames.length;
        this.tabList.selectedId = 0;
        this.dress_list.numItems = BagGressItems.length;
    }

    private updateBagClothingMapping() {
        this._bagClothing = {
            [BagGressItemIds.Hair]: { type: ClothingType.toufa, userClothes: User.userClothes.hair },
            [BagGressItemIds.Head]: { type: ClothingType.shipin, userClothes: User.userClothes.jewelry },
            [BagGressItemIds.UpperBody]: { type: ClothingType.shangyi, userClothes: User.userClothes.coat },
            [BagGressItemIds.Pants]: { type: ClothingType.kuzi, userClothes: User.userClothes.pants },
            [BagGressItemIds.Shoes]: { type: ClothingType.xiezi, userClothes: User.userClothes.shoes },
            [BagGressItemIds.Wings]: { type: ClothingType.chibang, userClothes: User.userClothes.wings },
            [BagGressItemIds.Hat]: { type: ClothingType.maozi, userClothes: User.userClothes.hat },
            [BagGressItemIds.Face]: { type: ClothingType.lian, userClothes: User.userClothes.face },
        };
    }

    private initAmount() {
        ViewsManager.addAmount(this.top_layout, 11.314, 260.722);
    }

    private async onDisassemble() {
        console.log("onDisassemble");
        const node = await ViewsManager.instance.showPopup(PrefabType.BreakdownView);
        const nodeScript = node.getComponent(BreakdownView);
        nodeScript.updateBreakDownItem(this._selectedItem);
    }

    private async onComposite() {
        console.log("onComposite");
        const node = await ViewsManager.instance.showPopup(PrefabType.CompositeBagView);
        const nodeScript = node.getComponent(CompositeBagView);
        nodeScript.updateMergeItem(this._selectedItem);
    }

    private onCompositeRequest(itemInfo: BackpackItemInfo) {
        this._compositeInfo = itemInfo;
        BagServer.reqBackpackItemSynthesis(this._compositeInfo);
    }

    private onBreakdownRequest(item: ItemData) {
        this._breakdownInfo = item;
        BagServer.reqBreakdownBackpackItems(this._breakdownInfo);
    }

    private onItemPropsRefresh() {
        this.tabList.selectedId = this._tabSelected;
    }

    private onPropList(propDatas: ItemData[]) {
        // Implement as needed
    }

    private onBreakdownBackpackItems(data: any) {
        console.log("onBreakdownBackpackItems", data);
        const itemInfo = BagConfig.findBackpackItemInfo(this._breakdownInfo.id);
        const decomposeItems = ObjectUtil.convertRewardData(BagConfig.findBreakdownItems(this._breakdownInfo));
        const tipMsg = `你成功把${this._breakdownInfo.num}个${itemInfo.name}分解了，获得` +
            decomposeItems.map((itemData) => {
                const itemInfo = BagConfig.findBackpackItemInfo(itemData.id);
                const itemQuantity = itemData.num * this._breakdownInfo.num;
                itemData.num = itemQuantity;
                return `${itemQuantity}个${itemInfo.name}`;
            }).join('，');

        ViewsMgr.showRewards(decomposeItems);
        ViewsManager.showTip(tipMsg);
    }

    private onUpdatePlayerClothing(data: any) {
        const clothingInfo = this.findInfoById(this._selectedItem.id);
        if (!clothingInfo) {
            console.error("ClothingInfo not found");
            return;
        }

        if (this._bagOperationId === BagOperationIds.Outfit) {
            this.outfitUpdateTypeMapping(clothingInfo);
            this.changeClothings(clothingInfo.id);
        } else if (this._bagOperationId === BagOperationIds.UnOutfit) {
            this.unOutfitUpdateTypeMapping(clothingInfo);
            this.removeClothing(clothingInfo.id);
        }

        this.updateAllLists();
    }

    private onBackpackItemSynthesis(data: any) {
        const mergeItems = ObjectUtil.convertRewardData(BagConfig.findMergeItems(this._compositeInfo))
            .filter(item => item.id !== ItemID.coin);
        const itemInfo = BagConfig.findBackpackItemInfo(mergeItems[0].id);
        const tipMsg = `你成功把${mergeItems[0].num}个${itemInfo.name}合成了${this._compositeInfo.name}`;

        ViewsMgr.showRewards([{ id: this._compositeInfo.id, num: 1 }]);
        ViewsManager.showTip(tipMsg);
    }

    private showRoleDress() {
        this.roleContainer.removeAllChildren();
        this._role = instantiate(this.roleModel);
        this._role.setScale(v3(2, 2, 1));
        this.roleContainer.addChild(this._role);
        NodeUtil.setLayerRecursively(this._role, Layers.Enum.UI_2D);
        const roleModel = this._role.getComponent(RoleModel);
        roleModel.initSelf();
        roleModel.show(true);
    }

    public changeClothings(clothingId: number) {
        const roleModel = this._role.getComponent(RoleModel);
        roleModel.changeClothing(clothingId);
    }

    public removeClothing(clothingId: number) {
        const roleModel = this._role.getComponent(RoleBaseModel);
        roleModel.removeClothing(clothingId);
    }

    private onLoadPropsGrid(item: Node, idx: number) {
        const itemScript = item.getComponent(RewardItem);
        const nodeTrans = item.getComponent(UITransform);
        const scale = 125 / nodeTrans.height;

        item.setScale(scale, scale, scale);
        const data: ItemData = this._propsDatas[idx];
        const propInfo = DataMgr.getItemInfo(data.id);
        const backpackItemInfo = BagConfig.findBackpackItemInfo(propInfo.id);

        if (isValid(backpackItemInfo) && backpackItemInfo.type === BagItemType.Costume) {
            item.getChildByName("Sprite").setScale(0.6, 0.6, 0.6);
            propInfo.png = BagConfig.transformPath(propInfo.png);
        }
        itemScript.init(data);
    }

    private onPropsGridSelected(item: Node, selectedId: number) {
        if (isValid(item) && selectedId >= 0) {
            this._propsSelected = selectedId;
            this.onPropsSelected(this._propsDatas[selectedId]);
        }
    }

    private onPropsSelected(selData: ItemData) {
        this._selectedItem = selData;
        this._opDatas = BagConfig.getItemCanOperations(selData);
        this.op_list.numItems = this._opDatas.length;
    }

    private onLoadDressGrid(item: Node, idx: number) {
        const itemScript = item.getComponent(BagDressItem);
        itemScript.updateDressProps(this._bagClothing, BagGressItems[idx]);
    }

    private onDressGridSelected(item: Node, selectedId: number) {
        if (isValid(item) && selectedId >= 0) {
            console.log("onDressGridSelected", selectedId);
        }
    }

    private onLoadTabHorizontal(item: Node, idx: number) {
        const itemScript = item.getComponent(BagTabItem);
        itemScript.updateTabProps(BagTabNames[idx].title);
    }

    private onTabHorizontalSelected(item: Node, selectedId: number) {
        if (isValid(item) && selectedId >= 0) {
            console.log("onTabHorizontalSelected", selectedId);
            this._tabSelected = selectedId;
            this.selectTabInfo(BagTabNames[selectedId]);
        }
    }

    private selectTabInfo(tabInfo: any) {
        const arrayData = BagConfig.convertItemArrayData(User.itemAry);
        const filteredItems = BagConfig.filterBagItems(arrayData);

        switch (tabInfo.id) {
            case BagTabIds.All:
                this._propsDatas = filteredItems;
                break;
            case BagTabIds.DressUp:
                this._propsDatas = BagConfig.filterItemsByType(filteredItems, BagItemType.Costume);
                break;
            case BagTabIds.Consumables:
                this._propsDatas = BagConfig.filterItemsByType(filteredItems, BagItemType.Consumable);
                break;
            case BagTabIds.Others:
                this._propsDatas = BagConfig.filterItemsByType(filteredItems, BagItemType.Other);
                break;
            default:
                break;
        }

        this.propList.numItems = this._propsDatas.length;
        this.updatePropsSelected(0);
    }

    private onOperationHorizontal(item: Node, idx: number) {
        const itemScript = item.getComponent(BagOperrationItem);
        itemScript.updateOperationProps(this._opDatas[idx]);
    }

    private onOperationHorizontalSelected(item: Node, selectedId: number) {
        if (isValid(item) && selectedId >= 0) {
            console.log("onOperationHorizontalSelected", selectedId);
            this.onOperationClick(this._opDatas[selectedId]);
        }
    }

    private findInfoById(id: number): ClothingInfo | undefined {
        if (!DataMgr.clothingConfig) {
            console.error("DataMgr.clothingConfig is undefined");
            return undefined;
        }
        return DataMgr.clothingConfig.find(item => isValid(item) && item.id === id);
    }

    private outfitUpdateTypeMapping(clothingInfo: ClothingInfo) {
        const { type, id } = clothingInfo;
        Object.values(this._bagClothing).forEach(info => {
            if (info.type === type) {
                info.userClothes = id;
            }
        });
        User.userClothes.setClothing(id, type);
    }

    private unOutfitUpdateTypeMapping(clothingInfo: ClothingInfo) {
        const { type, id } = clothingInfo;
        Object.values(this._bagClothing).forEach(info => {
            if (info.type === type) {
                info.userClothes = null;
            }
        });
        User.userClothes.setClothing(null, type);
    }

    private updatePropsSelected(selectedId: number) {
        this.propList.selectedId = -1;
        this.propList.selectedId = selectedId;
    }

    private getKeyFromType(type: ClothingType): keyof DressInfoItem | undefined {
        const typeEntry = BagGressTypeMap.find(entry => entry.id === type);
        return typeEntry ? typeEntry.key : undefined;
    }

    private reqUpdateClothingInfo(type: ClothingType, num: number) {
        const key = this.getKeyFromType(type);
        if (key !== undefined) {
            const param: DressInfoItem = { [key]: num };
            BagServer.reqUpdatePlayerClothing(param);
        } else {
            console.error(`Invalid ClothingType: ${type}`);
        }
    }

    private onOperationClick(data: BagOperationData) {
        this._bagOperationId = data.id;
        const clothingInfo = this.findInfoById(this._selectedItem.id);

        switch (data.id) {
            case BagOperationIds.Outfit:
                if (clothingInfo) {
                    this.reqUpdateClothingInfo(clothingInfo.type, clothingInfo.id);
                }
                break;
            case BagOperationIds.UnOutfit:
                if (clothingInfo) {
                    this.reqUpdateClothingInfo(clothingInfo.type, 0);
                }
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

    private updateAllLists() {
        this.dress_list.updateAll();
        this.propList.updateAll();
        this.op_list.updateAll();
        this.updatePropsSelected(this._propsSelected);
    }

    private onCloseView() {
        ViewsManager.instance.closeView(PrefabType.BagView);
    }
}
