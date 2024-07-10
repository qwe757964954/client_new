import { _decorator, Button, director, instantiate, Label, Layers, Node, Vec3, Widget } from 'cc';
import { PrefabType, SceneType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import GlobalConfig from '../../GlobalConfig';
import { CastleConfig, DataMgr } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import { BuildingModel } from '../../models/BuildingModel';
import { s2cBuildingUpgrade } from '../../models/NetModel';
import { User } from '../../models/User';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ToolUtil } from '../../util/ToolUtil';
import { RewardItem } from '../common/RewardItem';
import { PetInfoView } from './PetInfoView';
const { ccclass, property } = _decorator;

@ccclass('CastleInfoView')
export class CastleInfoView extends BaseComponent {
    @property(List)
    public listView: List = null;//列表
    @property(Label)
    public labelName1: Label = null;//名字
    @property(Label)
    public labelLevel: Label = null;//等级
    @property(Label)
    public labelMaxLevel: Label = null;//最大等级
    @property(Label)
    public labelName2: Label = null;//名字
    @property(Label)
    public labelLevel1: Label = null;//等级
    @property(Label)
    public labelLevel2: Label = null;//等级
    @property(Label)
    public labelCoin: Label = null;//金币
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property(Node)
    public btnUpgrade: Node = null;//升级按钮
    @property(Node)
    public plBuilding: Node = null;//建筑层
    @property(Node)
    public building: Node = null;//建筑
    @property(Node)
    public plConditions: Node = null;//条件层
    @property(Node)
    public condition: Node = null;//条件
    @property(Node)
    public plUpgrade: Node = null;//升级层
    @property(Node)
    public nodeMaxLevel: Node = null;//最大等级
    @property(Node)
    public plRight: Node = null;//右侧层

    private _building: BuildingModel = null;//建筑
    private _closeCallBack: Function = null;//关闭回调
    private _data: CastleConfig = null;//数据
    private _isCondition: boolean[] = [];//是否条件

    onLoad() {
        this.adaptUI();
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**适配UI */
    adaptUI() {
        let scale = ToolUtil.getValue(GlobalConfig.WIN_DESIGN_RATE, 0.1, 1.0);
        CCUtil.setNodeScale(this.plRight, scale);
        if (GlobalConfig.WIN_DESIGN_RATE > 1.0) {
            let widget = this.plRight.getComponent(Widget);
            widget.isAlignHorizontalCenter = true;
            widget.horizontalCenter = 368;
            widget.updateAlignment();

            widget = this.plBuilding.getComponent(Widget);
            widget.isAlignHorizontalCenter = true;
            widget.horizontalCenter = -500;
            widget.updateAlignment();
        }
    }
    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onBtnCloseClick, this);
        CCUtil.onTouch(this.btnUpgrade, this.onBtnUpgradeClick, this);

        this.addEvent(InterfacePath.c2sBuildingUpgrade, this.onBuildingUpgrade.bind(this));
    }

    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
        CCUtil.offTouch(this.btnUpgrade, this.onBtnUpgradeClick, this);

        this.clearEvent();
    }
    /**初始化 */
    init(building: BuildingModel) {
        this._building = building;
        this._building.pos = Vec3.ZERO;
        this._building.addToParent(this.building);
        this._building.setCameraType(Layers.Enum.UI_2D);

        let maxLevel = DataMgr.castleConfig.length;
        let buildingData = this._building.buildingData;
        let editInfo = this._building.editInfo;
        this.labelName1.string = editInfo.name;
        this.labelLevel.string = ToolUtil.replace(TextConfig.Level_Text, buildingData.level);
        this.labelMaxLevel.string = ToolUtil.replace(TextConfig.Level_Text2, maxLevel);
        this.labelName2.string = editInfo.name;
        if (buildingData.level >= maxLevel) {
            this.nodeMaxLevel.active = true;
            this.plUpgrade.active = false;
            return;
        }
        this.nodeMaxLevel.active = false;
        this.plUpgrade.active = true;
        this.labelLevel1.string = ToolUtil.replace(TextConfig.Level_Text, buildingData.level);
        this.labelLevel2.string = ToolUtil.replace(TextConfig.Level_Text, buildingData.level + 1);
        // this.labelCoin.string = "3000";// TODO升级所需金币
        let data = DataMgr.castleConfig[buildingData.level];
        this._data = data;
        // 升级所需条件
        for (let i = 0; i < 3; i++) {
            let node = this.condition;
            if (0 != i) {
                node = instantiate(this.condition);
                this.plConditions.addChild(node);
            }
            let right = node.getChildByName("img_right");
            let wrong = node.getChildByName("img_wrong");
            let label = node.getComponentInChildren(Label);
            let isCondition = false;
            if (0 == i) {
                label.string = ToolUtil.replace(TextConfig.Castle_Condition1, data.unlock1, data.unlock2);
            } else if (1 == i) {
                label.string = ToolUtil.replace(TextConfig.Castle_Condition2, data.unlock3);
                isCondition = User.petLevel >= data.unlock3;
            } else {
                label.string = ToolUtil.replace(TextConfig.Castle_Condition3, data.unlock4);
                isCondition = User.roleID >= data.unlock4;
            }
            right.active = isCondition;
            wrong.active = !isCondition;
            this._isCondition[i] = isCondition;
            let button = node.getComponentInChildren(Button);
            CCUtil.offTouch(button);
            CCUtil.onTouch(button, this.onBtnGotoClick.bind(this, i), this);
        }
        // 升级所需资源
        this.listView.numItems = data.upgrade_need.length;
        director.preloadScene(SceneType.WorldMapScene);
        LoadManager.preloadPrefab(PrefabType.WorldMapView.path);
    }

    /**加载列表 */
    onLoadList(node: Node, idx: number) {
        node.getComponent(RewardItem).init(this._data.upgrade_need[idx]);
    }
    /**关闭按钮 */
    onBtnCloseClick() {
        let building = this._building;
        this.removeBuilding();
        if (this._closeCallBack) this._closeCallBack(building);
        this.node.destroy();
    }
    /**升级按钮 */
    onBtnUpgradeClick() {
        // ViewsMgr.showTip(TextConfig.Function_Tip);
        ServiceMgr.buildingService.reqBuildingUpgrade(this._building.buildingID, this._building.buildingData.level);
    }
    /**goto按钮 */
    onBtnGotoClick(id: number) {
        // ViewsMgr.showTip(TextConfig.Function_Tip);
        if (0 == id) {
            director.loadScene(SceneType.WorldMapScene, () => {
                ViewsMgr.showView(PrefabType.WorldMapView);
            });
        } else if (1 == id) {
            ViewsMgr.showView(PrefabType.PetInfoView, (node: Node) => {
                node.getComponent(PetInfoView).init(User.petID, User.petLevel);
            });
            this.onBtnCloseClick();
        } else if (2 == id) {
            ViewsMgr.showView(PrefabType.SettingView);
        }
    }
    // 获取建筑所在位置
    getBuildingPos() {
        this.plBuilding.getComponent(Widget).updateAlignment();//立刻更新自动布局
        return this.plBuilding.position.add(this.building.position);
    }
    /**设置回调 */
    setCallBack(closeCallBack: Function) {
        this._closeCallBack = closeCallBack;
    }
    // 移除建筑
    removeBuilding() {
        if (this._building) {
            this._building.removeFromParent();
            this._building = null;
        }
    }
    /**建筑升级回调 */
    onBuildingUpgrade(data: s2cBuildingUpgrade) {
        if (data.id != this._building.buildingID) return;
        if (200 != data.code) {
            ViewsMgr.showTip(data.msg);
            return;
        }
        ViewsMgr.showTip(TextConfig.Building_Upgrade_Success);
        this._building.buildingData.level = data.level;
        let building = this._building;
        this.labelLevel.string = ToolUtil.replace(TextConfig.Level_Text, building.buildingData.level);;
        if (data.level >= 5) {
            this.nodeMaxLevel.active = true;
            this.plUpgrade.active = false;
            return;
        }
        this.nodeMaxLevel.active = false;
        this.plUpgrade.active = true;
        this.labelLevel1.string = ToolUtil.replace(TextConfig.Level_Text, building.buildingData.level);
        this.labelLevel2.string = ToolUtil.replace(TextConfig.Level_Text, building.buildingData.level + 1);
    }
}


