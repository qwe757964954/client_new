import { _decorator, Color, Component, EventTouch, instantiate, Layers, Node, Prefab, ScrollView, Sprite, SpriteFrame, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ItemData } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { User } from '../../models/User';
import { ServiceMgr } from '../../net/ServiceManager';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { NodeUtil } from '../../util/NodeUtil';
import { RewardItem } from '../common/RewardItem';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
const { ccclass, property } = _decorator;

@ccclass('BagDialogView')
export class BagDialogView extends Component {

    @property(Node)
    public btn_close: Node = null;

    @property(Node)
    public top_layout: Node = null;

    @property({ type: Node, tooltip: "全部" })
    public tab1: Node = null;

    @property({ type: Node, tooltip: "装扮" })
    public tab2: Node = null;

    @property({ type: Node, tooltip: "消耗品" })
    public tab3: Node = null;

    @property({ type: Node, tooltip: "其他" })
    public tab4: Node = null;

    @property({ type: ScrollView, tooltip: "物品列表" })
    public propList: ScrollView = null;

    @property({ type: Prefab, tooltip: "物品预制体" })
    public propPrefab: Prefab = null;

    @property({ type: Prefab, tooltip: "角色动画预制体" })
    public roleModel: Prefab = null;//角色动画

    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;

    @property({ type: [SpriteFrame], tooltip: "tab页的图片数组" }) // 0:选中 1: 未选中
    public sprTabAry: SpriteFrame[] = [];

    private _currentTab: string = "1"; //当前tab页
    private _selectTab: Node = null;

    private _role: Node = null;

    private _getBagListEveId: string = ""; //获取我的背包列表

    protected onLoad(): void {
        this.addEvent();
        this.initData();
    }

    initData() {
        this._currentTab = "1";
    }

    start() {
        this.initUI();
    }

    addEvent() {
        CCUtil.onTouch(this.btn_close, this.onCloseView, this);
        for (let i = 1; i <= 4; i++) {
            CCUtil.onTouch(this["tab" + i], this.onTabClick, this);
        }
        this._getBagListEveId = EventManager.on(EventType.Bag_PropList, this.onPropList.bind(this));
    }

    removeEvent() {
        CCUtil.offTouch(this.btn_close, this.onCloseView, this);
        for (let i = 1; i <= 4; i++) {
            CCUtil.offTouch(this["tab" + i], this.onTabClick, this);
        }
        EventManager.off(EventType.Bag_PropList, this._getBagListEveId);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    initUI() {
        this.initAmout();

        //显示角色动画
        this.showRoleDress();

        this.onClickTab();
    }

    onTabClick(e: EventTouch) {
        let tabName: string = e.target.name;
        tabName = tabName.substring(3); //截取最后一位，如tab2最后一位2
        if (tabName == this._currentTab) return;
        this._currentTab = tabName;
        this.onClickTab();
    }

    onClickTab() {
        let curTabIndex: number = +this._currentTab;
        for (let i = 1; i <= 4; i++) {
            if (curTabIndex == i) { //选中
                this["tab" + i].getComponent(Sprite).spriteFrame = this.sprTabAry[0];
                this["tab" + i].getChildByName("txt").color = new Color("#FFFFFF");
            }
            else { //未选中
                this["tab" + i].getComponent(Sprite).spriteFrame = this.sprTabAry[1];
                this["tab" + i].getChildByName("txt").color = new Color("#CAC4B7");
            }
        }

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
        this.propList.content.removeAllChildren();
        for (let i = 0; i < propDatas.length; i++) {
            let propData: ItemData = propDatas[i];
            this.addPropItem(propData);
        }
        this.propList.scrollToTop();
    }

    private addPropItem(propData: ItemData) {
        let propItem: Node = instantiate(this.propPrefab);
        this.propList.content.addChild(propItem);
        propItem.getComponent(RewardItem).init(propData);
    }



    /**初始化游戏数值 */
    initAmout() {
        ViewsManager.addAmout(this.top_layout, 11.314, 160.722).then((amoutScript: TopAmoutView) => {
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
        this._role.setScale(v3(1.5, 1.5, 1));
        this.roleContainer.addChild(this._role);
        NodeUtil.setLayerRecursively(this._role, Layers.Enum.UI_2D);
        let roleModel = this._role.getComponent(RoleBaseModel);
        let modelId: number = Number(User.curHeadPropId);
        roleModel.init(modelId, 1, [9500, 9700, 9701, 9702, 9703]);
        roleModel.show(true);
    }

    update(deltaTime: number) {

    }
}


