import { _decorator, Label, Node, Sprite } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr, ItemData } from '../../manager/DataMgr';
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
const { ccclass, property } = _decorator;

@ccclass('BuildingUpgradeView')
export class BuildingUpgradeView extends BaseComponent {
    @property(List)
    public listView: List = null;//列表
    @property(Label)
    public labelName: Label = null;//名字
    @property(Label)
    public labelLevel1: Label = null;//等级1
    @property(Label)
    public labelLevel2: Label = null;//等级2
    @property(Label)
    public labelTip: Label = null;//提示
    @property(Label)
    public labelCoin: Label = null;//金币
    @property(Node)
    public btnUpgrade: Node = null;//升级按钮
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property(Sprite)
    public img: Sprite = null;//图片)

    private _upgradeNeed: ItemData[] = null;
    private _building: BuildingModel = null;

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    initEvent() {
        CCUtil.onTouch(this.btnUpgrade, this.onClickUpgrade, this);
        CCUtil.onTouch(this.btnClose, this.onClickClose, this);
        this.addEvent(InterfacePath.c2sBuildingUpgrade, this.onBuildingUpgrade.bind(this));
    }
    removeEvent() {
        CCUtil.offTouch(this.btnUpgrade, this.onClickUpgrade, this);
        CCUtil.offTouch(this.btnClose, this.onClickClose, this);

        this.clearEvent();
    }
    /** 初始化 */
    public init(building: BuildingModel) {
        this._building = building;
        let editInfo = building.editInfo;
        let produceInfo = DataMgr.instance.buildProduceInfo[editInfo.id];

        this.labelName.string = editInfo.name;
        let level = building.buildingLevel;
        if (level >= produceInfo.count) return;
        this.labelLevel1.string = ToolUtil.replace(TextConfig.Level_Text, level);
        this.labelLevel2.string = ToolUtil.replace(TextConfig.Level_Text, level + 1);
        let data = produceInfo.data[level + 1];
        if (!data) return;
        this.labelTip.string = data.upgrade_tips;
        this._upgradeNeed = data.upgrade_need;
        this.listView.numItems = this._upgradeNeed.length;
        LoadManager.loadSprite(data.res_png, this.img);
    }
    /** 升级按钮 */
    public onClickUpgrade() {
        if (!User.checkItems(this._upgradeNeed, TextConfig.Upgrade_Condition_Error)) {
            return;
        }
        ServiceMgr.buildingService.reqBuildingUpgrade(this._building.buildingID, this._building.buildingLevel);
    }
    /**关闭按钮 */
    public onClickClose() {
        this.node.destroy();
    }
    /**加载列表 */
    onLoadList(node: Node, idx: number) {
        let rewardItem = node.getComponent(RewardItem);
        rewardItem.init(this._upgradeNeed[idx]);
    }
    /**升级结果 */
    onBuildingUpgrade(data: s2cBuildingUpgrade) {
        if (200 == data.code) {
            this.node.destroy();
            return;
        }
        ViewsMgr.showAlert(data.msg);
    }
}


