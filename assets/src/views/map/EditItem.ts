import { _decorator, Component, Label, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { MapConfig } from '../../config/MapConfig';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr, EditInfo, EditType } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;

export class EditItemInfo extends EditInfo {
    needBuilt: boolean = false;

    public constructor(data: EditInfo) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.theme = data.theme;
        this.type = data.type;
        this.buy = data.buy;
        this.sell = data.sell;
        this.enable = data.enable;
        this.width = data.width;
        this.height = data.height;
        this.png = data.png;
        this.description = data.description;
        this.function = data.function;
        this.animation = data.animation;
        this.animpos = data.animpos;
        this.baseColor = data.baseColor;
    }
}

@ccclass('EditItem')
export class EditItem extends Component {
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Sprite)
    public imgIcon: Sprite = null;//国王分图标
    @property(Label)
    public labelScore: Label = null;//国王分
    @property(Label)
    public labelSize: Label = null;//大小
    @property(Node)
    public tipToBuilt: Node = null;//去建造提示

    private _data: EditItemInfo = null;//数据
    private _clickCall: Function = null;//点击回调

    onLoad(): void {
        this.imgIcon.node.active = false;
        this.labelScore.node.active = false;
        this.tipToBuilt.active = false;

        this.initEvent();
    }
    get data(): EditItemInfo {
        return this._data;
    }
    // 初始化事件
    initEvent() {
        CCUtil.onTouch(this.node, this.onItemClick, this);
    }
    // 移除监听
    removeEvent() {
        CCUtil.offTouch(this.node, this.onItemClick, this);
    }
    // 销毁
    protected onDestroy(): void {
        this.removeEvent();
    }

    // 初始化
    public initData(info: EditItemInfo, clickCall: Function): void {
        this._clickCall = clickCall;
        if (this._data == info) return;
        this._data = info;
        this.labelSize.string = ToolUtil.replace(TextConfig.Width_Height_Text, info.width, info.height);
        this.tipToBuilt.active = info.needBuilt;
        // TODO 国王分显示
        LoadManager.loadSprite(DataMgr.getEditPng(info), this.img).then((spriteFrame: SpriteFrame) => {
            // this.fixPos();
            this.fixImg();
        });
    }
    // 点击
    public onItemClick(): void {
        if (this._clickCall) {
            this._clickCall(this);
        }
    }
    // 修复图片大小
    public fixImg(): void {
        let scale = new Vec3(1.0, 1.0, 1.0);
        let selfTransform = this.getComponent(UITransform);
        let transform = this.img.getComponent(UITransform);
        let scaleX = selfTransform.width / transform.width;
        let scaleY = selfTransform.height / transform.height;
        if (scaleX < 1.0 || scaleY < 1.0) {
            let minScale = Math.min(scaleX, scaleY);
            scale.x *= minScale;
            scale.y *= minScale;
        }
        this.img.node.scale = scale;
    }
    /**修复位置 */
    public fixPos(): void {
        let pos = new Vec3(0, 0, 0);
        if (EditType.Land == this._data.type) {
            let size = this.getComponent(UITransform).contentSize;
            pos.y = size.height * 0.5 - MapConfig.gridInfo.height;
        } else if (EditType.Decoration == this._data.type) {
            pos.y = 50;
        }
        this.img.node.position = pos;
    }
}


