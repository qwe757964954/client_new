import { _decorator, Color, instantiate, isValid, Layers, Node, Prefab, UITransform, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ItemID } from '../../export/ItemConfig';
import { ItemData } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { User } from '../../models/User';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { NodeUtil } from '../../util/NodeUtil';
import { RewardItem } from '../common/RewardItem';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { BagDressItem } from './BagDressItem';
import { BagGressItems, BagTabNames } from './BagInfo';
import { BagTabItem } from './BagTabItem';
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

    @property(Node)
    public btnDicomposeSell:Node = null;

    @property(List)
    @property tabList:List = null;
    @property(List)
    @property dress_list:List = null;
    private _currentTab: string = "1"; //当前tab页

    private _role: Node = null;

    initEvent() {
        CCUtil.onBtnClick(this.btn_close, this.onCloseView.bind(this));
        CCUtil.onBtnClick(this.btnDicomposeSell, this.onDicomposeSell.bind(this));
    }
    protected onInitModuleEvent() {
        this.addModelListeners([
            [EventType.Bag_PropList, this.onPropList.bind(this)],
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
        this.propList.numItems = 40;

    }
    onClickTab() {
        let curTabIndex: number = +this._currentTab;

        this.propList.content.removeAllChildren();
        switch (curTabIndex) {
            case 1:// 所有的物品
                ServiceMgr.propService.propList(1);
                break;
            case 2: //装扮
                ServiceMgr.propService.propList(2);
                break;
            case 3: //消耗品
                ServiceMgr.propService.propList(3);
                break;
            case 4: //其他
                ServiceMgr.propService.propList(4);
                break;
        }
    }

    onPropList(propDatas: ItemData[]) {

    }

    private addPropItem(propData: ItemData) {
        let propItem: Node = instantiate(this.propPrefab);
        this.propList.content.addChild(propItem);
        propItem.getComponent(RewardItem).init(propData);
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
    onDicomposeSell(){
        ViewsManager.instance.showTip(TextConfig.Function_Tip);
    }
    /**显示角色的骨骼动画 */
    private showRoleDress() {
        this.roleContainer.removeAllChildren();
        this._role = null;
        this._role = instantiate(this.roleModel);
        this._role.setScale(v3(1.5, 1.5, 1));
        this.roleContainer.addChild(this._role);
        NodeUtil.setLayerRecursively(this._role, Layers.Enum.UI_2D);
        let roleModel = this._role.getComponent(RoleBaseModel);
        let modelId: number = Number(User.curHeadPropId);
        roleModel.init(modelId, 1, [9500, 9700, 9701, 9702, 9703]);
        roleModel.show(true);
    }

    // 随机选择一个枚举值的函数
    getRandomEnumValue(enumObject: typeof ItemID): ItemID {
        const enumValues = Object.values(enumObject).filter(value => typeof value === 'number') as number[];
        const randomIndex = Math.floor(Math.random() * enumValues.length);
        return enumValues[randomIndex] as ItemID;
    }

    onLoadPropsGrid(item:Node, idx:number){
        let itemScript: RewardItem = item.getComponent(RewardItem);
        let node_trans = item.getComponent(UITransform);
        let scale = 125 / node_trans.height;
        item.setScale(scale, scale, scale)
        const randomItemID = this.getRandomEnumValue(ItemID);
        let data:ItemData = {
            id: randomItemID,
            num: 999,
        }
        itemScript.init(data);
        // let item_script = item.getComponent(BagDressItem);
        // item_script.updateTabProps(BagGressItems[idx]);
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
}


