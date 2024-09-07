import { _decorator, color, Label, Layers, Node, sp, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { AlertParam } from '../../config/ClassConfig';
import { EventType } from '../../config/EventType';
import { PetInteractionInfo, PetInteractionType } from '../../config/PetConfig';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import { s2cPetInfoRep, s2cPetInteraction, s2cPetUpgrade } from '../../models/NetModel';
import { PetModel } from '../../models/PetModel';
import { RoleDataModel } from '../../models/RoleDataModel';
import { User } from '../../models/User';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { NodeUtil } from '../../util/NodeUtil';
import { TimeOutBool } from '../../util/TimeOutBool';
import { ToolUtil } from '../../util/ToolUtil';
import { PetInfoView } from './PetInfoView';
const { ccclass, property } = _decorator;
/**宠物互动界面 */
@ccclass('PetInteractionView')
export class PetInteractionView extends BaseComponent {
    @property(Node)
    public bg: Node = null;//背景
    @property(Node)
    public frame: Node = null;//框
    @property(Node)
    public plBtn: Node = null;//按钮层
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
    @property(PetModel)
    public petModel: PetModel = null;//宠物
    @property(sp.Skeleton)
    public sp: sp.Skeleton = null;//动画

    private _pet: RoleDataModel = null;//宠物
    private _data: PetInteractionInfo[] = null;//数据
    private _type: PetInteractionType = null;//类型
    private _removeCall: Function = null;//移除回调
    private _interactionInfo: PetInteractionInfo = null;//互动信息
    private _repBool: TimeOutBool = new TimeOutBool(2000);//互动超时

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
        this.bg.active = false;
        this.frame.active = false;
        // this.showTye(PetInteractionType.eat);
        this._pet = pet;
        this.btnInfo.active = pet.userID == User.userID;

        this.petModel.init(pet.roleID, pet.level);
        this.petModel.show(true);
        NodeUtil.setLayerRecursively(this.petModel.node, Layers.Enum.UI_2D);
        this.fixPetSize();
        this.petModel.show(false);

        this.onMoodScoreUpdate();
        ServiceMgr.buildingService.reqPetInfo(pet.userID);
    }
    /**显示类型 */
    showTye(type: PetInteractionType) {
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
        let label2 = item.getChildByName('Label2')?.getComponent(Label);
        let propInfo = DataMgr.getItemInfo(data.id);
        if (label) label.string = ToolUtil.replace(TextConfig.Pet_Mood_Prop, data.score);
        if (label2) label2.string = ToolUtil.replace(TextConfig.Item_Count_Text, User.getItem(data.id));
        if (img) LoadManager.loadSprite(propInfo.png, img);
        CCUtil.offTouch(item);
        CCUtil.onTouch(item, () => {
            console.log("onTouch", data.type, data.id);
            if (this._repBool.value) return;
            if (!User.checkItems([{ id: data.id, num: 1 }], new AlertParam(TextConfig.Item_Condition_Error, TextConfig.Item_Condition_Error2))) {
                return;
            }
            this._repBool.value = true;
            this._interactionInfo = data;
            this.img.node.setWorldPosition(img.node.worldPosition);
            ServiceMgr.buildingService.reqPetInteraction(data.id, this._pet.userID);
        });
    }
    /**关闭按钮 */
    onCloseClick() {
        if (this.frame.active) {
            this._pet.isActive = true;
        }
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
        this.plBtn.active = false;
        this.frame.active = true;
        this.bg.active = true;
        this._pet.isActive = false;
        this.petModel.show(true);
        this.showTye(type);
    }
    /**类型按钮 */
    onTypeClick(type: PetInteractionType) {
        // console.log("onTypeClick", type);
        this.showTye(type);
    }
    /**信息按钮 */
    onInfoClick() {
        ViewsMgr.showView(PrefabType.PetInfoView, (node: Node) => {
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
        // let petInfo = data.pet_info;
        // User.moodScore = petInfo.mood;//地图层监听了
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
    private onRepPetUpgrade(data: s2cPetUpgrade) {
        if (200 != data.code) {
            return;
        }
        this.petModel.updateLevel(data.level);
        this.fixPetSize();
    }
    /**宠物互动 */
    private onRepPetInteraction(data: s2cPetInteraction) {
        this._repBool.clearTimer();
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        let petInfo = data.pet_info;
        User.moodScore = petInfo.mood;

        let propInfo = DataMgr.getItemInfo(this._interactionInfo.id);
        LoadManager.loadSprite(propInfo.png, this.img).then(() => {
            this.img.node.active = true;
        });
        tween(this.img.node).to(0.5, { worldPosition: this.node.worldPosition }).call(() => {
            this.img.node.active = false;

            this.sp.node.active = true;
            console.log("onRepPetInteraction", this._interactionInfo.anim);
            this.sp.setAnimation(0, this._interactionInfo.anim, false);
            this.sp.setCompleteListener(() => {
                this.sp.node.active = false;
                ViewsMgr.showTipSmall(ToolUtil.replace(TextConfig.PetMood_Add_Tip, this._interactionInfo.score), this.node);
                this._repBool.value = false;
            });
            this.listView.updateAll();
        }).start();
    }
    /**调整宠物大小 */
    private fixPetSize() {
        if (this.petModel.level <= 2) {//特殊处理，后面考虑走配置
            this.petModel.node.scale = new Vec3(1.5, 1.5, 1.5);
        } else {
            this.petModel.node.scale = new Vec3(1, 1, 1);
        }
    }
}


