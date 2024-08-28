import { _decorator, Color, Label, Layers, Node, ProgressBar, Vec3 } from 'cc';
import { EventType } from '../../config/EventType';
import { TextConfig } from '../../config/TextConfig';
import GlobalConfig from '../../GlobalConfig';
import { DataMgr } from '../../manager/DataMgr';
import { ViewsMgr } from '../../manager/ViewsManager';
import { s2cPetUpgrade } from '../../models/NetModel';
import { PetModel } from '../../models/PetModel';
import { User } from '../../models/User';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { NodeUtil } from '../../util/NodeUtil';
import { ToolUtil } from '../../util/ToolUtil';
import { RewardItem } from '../common/RewardItem';
import { PetInfoItem } from './PetInfoItem';
const { ccclass, property } = _decorator;

@ccclass('PetInfoView')
export class PetInfoView extends BaseComponent {
    @property(List)
    public listView: List = null;//列表
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property([RewardItem])
    public rewardItems: RewardItem[] = [];//奖励列表
    @property([Node])
    public moods: Node[] = [];//心情列表
    @property(Node)
    public btnUpgade: Node = null;//升级按钮
    @property(PetModel)
    public pet: PetModel = null;//宠物
    @property(Label)
    public labelLevel: Label = null;//等级
    @property(ProgressBar)
    public progressBar: ProgressBar = null;//心情分进度
    @property(Node)
    public plLeft: Node = null;
    @property(Node)
    public plRight: Node = null;


    private _removeCall: Function = null;//移除回调

    start() {
        this.adaptUI();
        this.initEvent();
    }
    /**适配UI */
    adaptUI() {
        let scale = ToolUtil.getValue(GlobalConfig.WIN_DESIGN_RATE, 0.1, 1.0);
        CCUtil.setNodeScale(this.plLeft, scale);
        CCUtil.setNodeScale(this.plRight, scale);
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化数据 */
    init(id: number, level: number, removeCall?: Function) {
        this._removeCall = removeCall;
        this.pet.init(id, level);
        this.pet.show(true);
        NodeUtil.setLayerRecursively(this.pet.node, Layers.Enum.UI_2D);
        this.fixPetSize();
        this.refreshLevel(level);
        this.onMoodScoreUpdate();
        this.listView.numItems = DataMgr.petMaxLevel;
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onCloseClick, this);
        CCUtil.onTouch(this.btnUpgade, this.onUpgadeClick, this);

        this.addEvent(EventType.Mood_Score_Update, this.onMoodScoreUpdate.bind(this));
        this.addEvent(InterfacePath.c2sPetUpgrade, this.onRepPetUpgrade.bind(this));
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onCloseClick, this);
        CCUtil.offTouch(this.btnUpgade, this.onUpgadeClick, this);

        this.clearEvent();
    }
    /**加载列表 */
    onLoadList(node: Node, idx: number) {
        let petInfoItem = node.getComponent(PetInfoItem);
        petInfoItem.init(this.pet.roleID, idx + 1, this.pet.level);
    }
    /**关闭按钮 */
    onCloseClick() {
        if (this._removeCall) this._removeCall();
        this.node.destroy();
    }
    /**升级按钮 */
    onUpgadeClick() {
        let petConfig = DataMgr.petConfig[this.pet.roleID][this.pet.level];
        if (!User.checkItems(petConfig.upgradeNeed, TextConfig.Upgrade_Condition_Error)) {
            return;
        }
        if (petConfig.castleLevel > User.castleLevel) {
            ViewsMgr.showTip(TextConfig.PetUpgrade_Castle_Error);
            return;
        }
        ServiceMgr.buildingService.reqPetUpgrade(this.pet.level);
    }
    /**心情分更新 */
    onMoodScoreUpdate() {
        this.progressBar.progress = User.moodScore / 100;
    }
    /**宠物升级 */
    onRepPetUpgrade(data: s2cPetUpgrade) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        ViewsMgr.showTip(TextConfig.PetUpgrade_Tip);
        this.refreshLevel(data.level);
        this.fixPetSize();
    }
    /**调整宠物大小 */
    fixPetSize() {
        if (this.pet.level <= 2) {//特殊处理，后面考虑走配置
            this.pet.node.scale = new Vec3(1.5, 1.5, 1.5);
        } else {
            this.pet.node.scale = new Vec3(1, 1, 1);
        }
    }
    /**刷新等级 */
    refreshLevel(level: number) {
        this.labelLevel.string = ToolUtil.replace(TextConfig.Level_Text, level);
        if (level < DataMgr.petMaxLevel) {
            this.btnUpgade.active = true;
            let petConfig = DataMgr.petConfig[this.pet.roleID][level];
            for (let i = 0; i < 6; i++) {
                let rewardItem = this.rewardItems[i];
                if (3 == i) {
                    rewardItem.initByPng("map/img_token_gold/spriteFrame", petConfig.castleLevel);
                    rewardItem.num.color = petConfig.castleLevel <= User.castleLevel ? Color.WHITE : Color.RED;
                } else {
                    let idx = i < 3 ? i : i - 1;
                    let data = petConfig.upgradeNeed[idx];
                    rewardItem.init(data);
                    rewardItem.num.color = data.num <= User.getItem(data.id) ? Color.WHITE : Color.RED;
                }
            }
        } else {
            for (let i = 0; i < 6; i++) {
                this.rewardItems[i].node.active = false;
            }
            this.btnUpgade.active = false;
        }
        this.pet.updateLevel(level);
        this.listView.numItems = DataMgr.petMaxLevel;
    }
}


