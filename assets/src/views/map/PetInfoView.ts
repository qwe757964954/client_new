import { _decorator, Label, Layers, Node, ProgressBar, Vec3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PropID } from '../../config/PropConfig';
import { TextConfig } from '../../config/TextConfig';
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


    private _removeCall: Function = null;//移除回调

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化数据 */
    init(id: number, level: number, removeCall?: Function) {
        this._removeCall = removeCall;

        this.listView.numItems = DataMgr.petMaxLevel;
        this.pet.init(id, level);
        this.pet.show(true);
        NodeUtil.setLayerRecursively(this.pet.node, Layers.Enum.UI_2D);
        this.fixPetSize();
        this.refreshLevel(level);
        this.onMoodScoreUpdate();
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

    }
    /**关闭按钮 */
    onCloseClick() {
        if (this._removeCall) this._removeCall();
        this.node.destroy();
    }
    /**升级按钮 */
    onUpgadeClick() {
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
        this.btnUpgade.active = level <= DataMgr.petMaxLevel;
        let petConfig = DataMgr.petConfig[this.pet.roleID][level];
        this.rewardItems[0].init({ id: PropID.amethyst, num: petConfig.amethyst });
        this.rewardItems[1].init({ id: PropID.coin, num: petConfig.coin });
        this.rewardItems[2].init({ id: PropID.diamond, num: petConfig.diamond });
        this.rewardItems[3].initByPng("map/img_token_gold/spriteFrame", petConfig.roleLevel);
        this.rewardItems[4].init({ id: PropID.soul, num: 1 });
        this.rewardItems[5].initByPng("map/pet/pet_img_mood_icon/spriteFrame", petConfig.intimacy);
        this.pet.updateLevel(level);
    }
}


