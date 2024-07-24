import { _decorator, Color, instantiate, isValid, Layers, Node, Prefab, UITransform, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ItemData } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { NodeUtil } from '../../util/NodeUtil';
import { RewardItem } from '../common/RewardItem';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { BagDressItem } from './BagDressItem';
import { BagGressItems, BagOperationData, BagOperationIds, BagOperationNames, BagTabNames } from './BagInfo';
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
    public roleModel: Prefab = null;//角色动画

    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;

    @property(List)
    public tabList:List = null;
    @property(List)
    public dress_list:List = null;

    @property(List)
    public op_list:List = null;

    private _role: Node = null;

    initEvent() {
        CCUtil.onBtnClick(this.btn_close, this.onCloseView.bind(this));
    }
    protected onInitModuleEvent() {
        this.addModelListeners([
            [EventType.Bag_PropList, this.onPropList.bind(this)],
            [NetNotify.Classification_BreakdownBackpackItems, this.onBreakdownBackpackItems.bind(this)],
            [NetNotify.Classification_BackpackItemSynthesis, this.onBackpackItemSynthesis.bind(this)],
        ]);
    }
    initUI() {
        this.viewAdaptSize();
        this.initAmout();
        //显示角色动画
        this.showRoleDress();
        this.tabList.numItems = BagTabNames.length;
        this.tabList.selectedId = 0;
        this.dress_list.numItems = BagGressItems.length;
        this.propList.numItems = User.item_list.length;
        this.op_list.numItems = BagOperationNames.length;
        this.op_list.selectedId = 0;
    }

    onPropList(propDatas: ItemData[]) {

    }

    onBreakdownBackpackItems(data:any){
        console.log("onBreakdownBackpackItems", data);
    }
    onBackpackItemSynthesis(data:any){
        console.log("onBackpackItemSynthesis", data);
    }

    /**初始化游戏数值 */
    initAmout() {
        ViewsManager.addAmout(this.top_layout, 11.314, 260.722).then((amoutScript: TopAmoutView) => {
            let dataArr: AmoutItemData[] = [{ type: AmoutType.Diamond, num: User.diamond },
            { type: AmoutType.Coin, num: User.coin },
            { type: AmoutType.Energy, num: User.stamina }];
            amoutScript.loadAmoutData(dataArr);
        });
    }

    onCloseView() {
        ViewsManager.instance.closeView(PrefabType.BagView);
    }
    /**显示角色的骨骼动画 */
    private showRoleDress() {
        this.roleContainer.removeAllChildren();
        this._role = null;
        this._role = instantiate(this.roleModel);
        this._role.setScale(v3(2, 2, 1));
        this.roleContainer.addChild(this._role);
        NodeUtil.setLayerRecursively(this._role, Layers.Enum.UI_2D);
        let roleModel = this._role.getComponent(RoleBaseModel);
        let modelId: number = Number(User.curHeadPropId);
        roleModel.init(modelId, 1, [9500, 9700, 9701, 9702, 9703]);
        roleModel.show(true);
    }
    onLoadPropsGrid(item:Node, idx:number){
        let itemScript: RewardItem = item.getComponent(RewardItem);
        let node_trans = item.getComponent(UITransform);
        let scale = 125 / node_trans.height;
        item.setScale(scale, scale, scale)
        let data:ItemData = {
            id: User.item_list[idx].id,
            num: User.item_list[idx].num,
        }
        itemScript.init(data);
    }

    onPropsGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onPropsGridSelected",selectedId);
    }

    onLoadDressGrid(item:Node, idx:number){
        let item_script = item.getComponent(BagDressItem);
        item_script.updateTabProps(BagGressItems[idx]);
    }

    onDressGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onDressGridSelected",selectedId);
        // this.clearAllTabLabelColors();
        // let item_script = item.getComponent(BagTabItem);
        // item_script.tab_name.color = new Color("#FFFFFF");
    }


    onLoadTabHorizontal(item:Node, idx:number){
        let item_script = item.getComponent(BagTabItem);
        item_script.updateTabProps(BagTabNames[idx].title);
    }

    onTabHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabHorizontalSelected",selectedId);
        this.clearAllTabLabelColors();
        let item_script = item.getComponent(BagTabItem);
        item_script.tab_name.color = new Color("#FFFFFF");
    }

    clearAllTabLabelColors() {
        for (let index = 0; index < this.tabList.numItems; index++) {
            const item = this.tabList.getItemByListId(index);
            let item_script = item.getComponent(BagTabItem);
            item_script.tab_name.color = new Color("#CAC4B7");
            
        }
    }

    onOperationHorizontal(item:Node, idx:number){
        let item_script = item.getComponent(BagOperrationItem);
        item_script.updateOperationProps(BagOperationNames[idx]);
    }

    onOperationHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabHorizontalSelected",selectedId);
        this.onOperationClick(BagOperationNames[selectedId]);
    }

    onOperationClick(data:BagOperationData){
        switch (data.id) {
            case BagOperationIds.Outfit:
                
                break;
            case BagOperationIds.UnOutfit:
                
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
    async onDisassemble(){
        console.log("onDisassemble��解");
        let node = await ViewsManager.instance.showPopup(PrefabType.BreakdownView);
        let nodeScript = node.getComponent(BreakdownView)
    }
    async onComposite(){
        console.log("onComposite....");
        let node = await ViewsManager.instance.showPopup(PrefabType.CompositeBagView);
        let nodeScript = node.getComponent(CompositeBagView)
    }
}


