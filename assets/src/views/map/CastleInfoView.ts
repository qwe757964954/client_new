import { _decorator, Button, Component, instantiate, Label, Layers, Node, Vec3, Widget } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import GlobalConfig from '../../GlobalConfig';
import { ViewsMgr } from '../../manager/ViewsManager';
import { BuildingModel } from '../../models/BuildingModel';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;

@ccclass('CastleInfoView')
export class CastleInfoView extends Component {
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

    private _building: BuildingModel = null;
    private _closeCallBack: Function = null;

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
    }

    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
        CCUtil.offTouch(this.btnUpgrade, this.onBtnUpgradeClick, this);
    }
    /**初始化 */
    init(building: BuildingModel) {
        this._building = building;
        this._building.pos = Vec3.ZERO;
        this._building.addToParent(this.building);
        this._building.setCameraType(Layers.Enum.UI_2D);

        let maxLevel = 5;
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
        // TODO升级所需条件
        // TODO升级所需资源
        for (let i = 0; i < 1; i++) {
            let node = 0 == i ? this.condition : instantiate(this.condition);
            // node.getComponentInChildren(Label).string = "1";// TODO升级所需条件
            let button = node.getComponentInChildren(Button);// TODO升级条件去往界面
            CCUtil.onTouch(button, this.onBtnGotoClick.bind(this, i), this);
        }
        // this.listView.numItems = 4;
    }

    /**加载列表 */
    onLoadList(node: Node, idx: number) {

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
        ViewsMgr.showTip(TextConfig.Function_Tip);
    }
    /**goto按钮 */
    onBtnGotoClick(id: number) {
        ViewsMgr.showTip(TextConfig.Function_Tip);
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
}


