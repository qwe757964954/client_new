import { _decorator, Component, Label, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { MapConfig } from '../../config/MapConfig';
import { DataMgr, EditInfo, EditType } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('EditItem')
export class EditItem extends Component {
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Sprite)
    public imgIcon: Sprite = null;//国王分图标
    @property(Label)
    public label: Label = null;//文本

    private _data: EditInfo = null;//数据
    private _clickCall: Function = null;//点击回调

    onLoad(): void {
        this.imgIcon.node.active = false;
        this.label.node.active = false;

        this.initEvent();
    }
    get data(): EditInfo {
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
    public initData(info: EditInfo, clickCall: Function): void {
        this._data = info;
        // TODO 国王分显示
        this._clickCall = clickCall;
        LoadManager.loadSprite(DataMgr.getEditPng(info), this.img).then((spriteFrame: SpriteFrame) => {
            this.fixPos();
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
        if (scaleX >= 1.0 && scaleY >= 1.0) return;
        let minScale = Math.min(scaleX, scaleY);
        scale.x *= minScale;
        scale.y *= minScale;
        this.img.node.scale = scale;
    }
    /**修复位置 */
    public fixPos(): void {
        if (EditType.Land != this._data.type) return;
        let size = this.getComponent(UITransform).contentSize;
        // let imgSize = this.img.getComponent(UITransform).contentSize;
        let y = size.height * 0.5 - MapConfig.gridInfo.height;
        this.img.node.position = new Vec3(0, y, 0);
    }
}


