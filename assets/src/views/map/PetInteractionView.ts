import { _decorator, color, Label, Node, Sprite, SpriteFrame, tween } from 'cc';
import { EventType } from '../../config/EventType';
import { PetInteractionInfo, PetInteractionType } from '../../config/PetConfig';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { s2cPetInfoRep, s2cPetInteraction, s2cPetUpgrade } from '../../models/NetModel';
import { RoleDataModel } from '../../models/RoleDataModel';
import { User } from '../../models/User';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ToolUtil } from '../../util/ToolUtil';
import { PetInfoView } from './PetInfoView';
const { ccclass, property } = _decorator;
/**宠物互动界面 */
@ccclass('PetInteractionView')
export class PetInteractionView extends BaseComponent {
    @property(Node)
    public frame: Node = null;//框
    @property(Node)
    public btnInfo: Node = null;//宠物信息
    @property(List)
    public listView: List = null;//列表
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property(Node)
    public btnSelect: Node = null;//选择
    @property([Node])
    public btnInteraction: Node[] = [];//交互
    @property([Node])
    public btnType: Node[] = [];//类型
    @property([SpriteFrame])
    public spriteFrames: SpriteFrame[] = [];//图片资源
    @property(Label)
    public labelMood: Label = null;//心情分
    @property(Sprite)
    public imgMood: Sprite = null;//心情img
    @property(Sprite)
    public img: Sprite = null;//互动img

    private _pet: RoleDataModel = null;//宠物
    private _data: PetInteractionInfo[] = null;//数据
    private _type: PetInteractionType = null;//类型
    private _removeCall: Function = null;//移除回调
    private _interactionInfo: PetInteractionInfo = null;//互动信息
    private _interactionTimes: number[] = [0, 0, 0];//互动次数

    onLoad() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onCloseClick, this);
        CCUtil.onTouch(this.btnInfo, this.onInfoClick, this);
        CCUtil.onTouch(this.node, this.onScreenClick, this);
        for (let i = 0; i < this.btnInteraction.length; i++) {
            CCUtil.onTouch(this.btnInteraction[i], this.onInteractionClick.bind(this, i + 1), this);
        }
        for (let i = 0; i < this.btnType.length; i++) {
            CCUtil.onTouch(this.btnType[i], this.onTypeClick.bind(this, i + 1), this);
        }

        this.addEvent(EventType.Mood_Score_Update, this.onMoodScoreUpdate.bind(this));
        this.addEvent(InterfacePath.c2sPetInfo, this.onRepPetInfo.bind(this));
        this.addEvent(InterfacePath.c2sPetUpgrade, this.onRepPetUpgrade.bind(this));
        this.addEvent(InterfacePath.c2sPetInteraction, this.onRepPetInteraction.bind(this));
    }
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onCloseClick, this);
        CCUtil.offTouch(this.btnInfo, this.onInfoClick, this);
        CCUtil.offTouch(this.node, this.onScreenClick, this);

        this.clearEvent();
    }
    init(pet: RoleDataModel) {
        this._type = null;
        this.frame.active = false;
        // this.showTye(PetInteractionType.eat);
        this._pet = pet;

        this.onMoodScoreUpdate();
        ServiceMgr.buildingService.reqPetInfo();
    }
    /**显示类型 */
    showTye(type: PetInteractionType) {
        this.frame.active = true;
        if (this._type == type) return;
        this._data = [];
        DataMgr.petInteraction.forEach(element => {
            if (type != element.type) return;
            this._data.push(element);
        });
        this.listView.numItems = this._data.length;

        if (null != this._type) {
            let btn = this.btnType[this._type - 1];
            btn.getComponentInChildren(Label).color = color("#FFFFFF");
            btn.getComponent(Sprite).spriteFrame = this.spriteFrames[1];
        }
        let btn = this.btnType[type - 1];
        btn.getComponentInChildren(Label).color = color("#72320F");
        btn.getComponent(Sprite).spriteFrame = this.spriteFrames[0];

        this.btnSelect.active = true;
        this.btnSelect.position = this.btnInteraction[type - 1].position;
        this._type = type;
    }
    /**加载列表 */
    onLoadItem(item: Node, idx: number) {
        let data = this._data[idx];
        let img = item.getChildByName('img')?.getComponent(Sprite);
        let label = item.getChildByName('Label')?.getComponent(Label);
        let propInfo = DataMgr.getItemInfo(data.id);
        if (label) label.string = ToolUtil.replace(TextConfig.Pet_Mood_Prop, data.score);
        if (img) LoadManager.loadSprite(propInfo.png, img);
        CCUtil.offTouch(item);
        CCUtil.onTouch(item, () => {
            console.log("onTouch", data.type, data.id);
            if (this._interactionTimes[data.type - 1] <= 0) {
                ViewsMgr.showTip(TextConfig.PetInteraction_Tip);
                return;
            }
            this._interactionInfo = data;
            this.img.node.setWorldPosition(img.node.worldPosition);
            ViewsMgr.showWaiting();
            ServiceMgr.buildingService.reqPetInteraction(data.id);
        });
    }
    /**关闭按钮 */
    onCloseClick() {
        if (this._removeCall) this._removeCall();
        this.node.destroy();
    }
    /**屏幕点击 */
    onScreenClick() {
        if (this.frame.active) return;
        this.onCloseClick();
    }
    /**交互按钮 */
    onInteractionClick(type: PetInteractionType) {
        // console.log("onInteractionClick", type);
        this.showTye(type);
    }
    /**类型按钮 */
    onTypeClick(type: PetInteractionType) {
        // console.log("onTypeClick", type);
        this.showTye(type);
    }
    /**信息按钮 */
    onInfoClick() {
        ViewsManager.instance.showView(PrefabType.PetInfoView, (node: Node) => {
            this.node.active = false;
            this._pet.isActive = false;
            node.getComponent(PetInfoView).init(this._pet.roleID, this._pet.level, () => {
                this.node.active = true;
                this._pet.isActive = true;
            });
        });
    }
    /**设置移除回调 */
    setRemoveCallback(callback: Function) {
        this._removeCall = callback;
    }
    /**宠物信息 */
    onRepPetInfo(data: s2cPetInfoRep) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        let petInfo = data.pet_info;
        User.moodScore = petInfo.mood;

        this._interactionTimes = petInfo.daily_counts;
    }
    /**心情分更新 */
    onMoodScoreUpdate() {
        this.labelMood.string = User.moodScore.toString();
        let config = DataMgr.getMoodConfig(User.moodScore);
        if (config) {
            LoadManager.loadSprite(ToolUtil.getRandomItem(config.png), this.imgMood);
        }
    }
    /**宠物升级 */
    onRepPetUpgrade(data: s2cPetUpgrade) {
        if (200 != data.code) {
            return;
        }
    }
    /**宠物互动 */
    onRepPetInteraction(data: s2cPetInteraction) {
        ViewsMgr.removeWaiting();
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        let petInfo = data.pet_info;
        User.moodScore = petInfo.mood;
        this._interactionTimes = petInfo.daily_counts;

        let propInfo = DataMgr.getItemInfo(this._interactionInfo.id);
        LoadManager.loadSprite(propInfo.png, this.img).then(() => {
            this.img.node.active = true;
        });
        tween(this.img.node).to(0.5, { worldPosition: this.node.worldPosition }).call(() => {
            this.img.node.active = false;
            ViewsMgr.showTipSmall(ToolUtil.replace(TextConfig.PetMood_Add_Tip, this._interactionInfo.score), this.node);
        }).start();
    }
}


