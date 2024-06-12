import { _decorator, color, Component, Label, Layers, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { PetInteractionInfo, PetInteractionType } from '../../config/PetConfig';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsManager } from '../../manager/ViewsManager';
import { PetModel } from '../../models/PetModel';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { NodeUtil } from '../../util/NodeUtil';
import { ToolUtil } from '../../util/ToolUtil';
import { PetInfoView } from './PetInfoView';
const { ccclass, property } = _decorator;
/**宠物互动界面 */
@ccclass('PetInteractionView')
export class PetInteractionView extends Component {
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
    @property(PetModel)
    public pet: PetModel = null;//宠物

    private _petID: number = null;//宠物id
    private _petLevel: number = null;//宠物等级
    private _data: PetInteractionInfo[] = null;//数据
    private _type: PetInteractionType = null;//类型
    private _removeCall: Function = null;//移除回调

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onCloseClick, this);
        CCUtil.onTouch(this.btnInfo, this.onInfoClick, this);
        for (let i = 0; i < this.btnInteraction.length; i++) {
            CCUtil.onTouch(this.btnInteraction[i], this.onInteractionClick.bind(this, i + 1), this);
        }
        for (let i = 0; i < this.btnType.length; i++) {
            CCUtil.onTouch(this.btnType[i], this.onTypeClick.bind(this, i + 1), this);
        }
    }
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onCloseClick, this);
        CCUtil.offTouch(this.btnInfo, this.onInfoClick, this);
    }
    init(id: number, level: number) {
        this.showTye(PetInteractionType.eat);
        this._petID = id;
        this._petLevel = level;

        this.pet.init(id, level);
        this.pet.show(true);
        NodeUtil.setLayerRecursively(this.pet.node, Layers.Enum.UI_2D);
        if (level <= 2) {//特殊处理，后面考虑走配置
            this.pet.node.scale = new Vec3(1.5, 1.5, 1);
        }
    }
    /**显示类型 */
    showTye(type: PetInteractionType) {
        if (this._type == type) return;
        this._data = [];
        DataMgr.instance.petInteraction.forEach(element => {
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

        this.btnSelect.position = this.btnInteraction[type - 1].position;
        this._type = type;
    }
    /**加载列表 */
    onLoadItem(item: Node, idx: number) {
        let data = this._data[idx];
        let img = item.getChildByName('img')?.getComponent(Sprite);
        let label = item.getChildByName('Label')?.getComponent(Label);
        let propInfo = DataMgr.getPropInfo(data.id);
        if (label) label.string = ToolUtil.replace(TextConfig.Pet_Mood_Prop, data.score);
        if (img) LoadManager.loadSprite(propInfo.png, img);
    }
    /**关闭按钮 */
    onCloseClick() {
        if (this._removeCall) this._removeCall();
        this.node.destroy();
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
            node.getComponent(PetInfoView).init(this._petID, this._petLevel, () => {
                this.node.active = true;
            });
        });
    }
    /**设置移除回调 */
    setRemoveCallback(callback: Function) {
        this._removeCall = callback;
    }
}


