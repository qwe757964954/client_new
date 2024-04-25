import { _decorator, Component, Sprite, UITransform, Vec3 } from 'cc';
import { MapConfig } from '../config/MapConfig';
import { LoadManager } from '../manager/LoadManager';
import { ToolUtil } from '../util/ToolUtil';
const { ccclass, property } = _decorator;

@ccclass('BgModel')
export class BgModel extends Component {

    private _bgID: number = 0;//ID
    private _x: number = 0;//行
    private _y: number = 0;//列
    private _isLoad: boolean = false;//是否加载图片

    // 是否已经加载
    public get isLoad() {
        return this._isLoad;
    }
    // 初始化
    public init(bgID: number, x: number, y: number) {
        this._bgID = bgID;
        this._x = x;
        this._y = y;
        this._isLoad = false;

        this.initPos();
    }
    // 初始化位置
    public initPos() {
        let bgInfo = MapConfig.bgInfo;
        let width = bgInfo.width;
        let height = bgInfo.height;
        let col = bgInfo.col;
        let row = bgInfo.row;
        let midCol = col / 2;
        let midRow = row / 2;
        this.node.position = new Vec3((this._x - midCol + 0.5) * width, (midRow - this._y - 0.5) * height, 0);
    }
    private isCommonBg(id: number) {
        let ary = MapConfig.bgInfo.commonAry;
        for (let i = 0; i < ary.length; i++) {
            if (id == ary[i]) {
                return true;
            }
        }
        return false;
    }
    /**显示与否 */
    public show(isShow: boolean) {
        if (isShow && !this._isLoad) {
            this._isLoad = true;
            let bgInfo = MapConfig.bgInfo;
            let path = this.isCommonBg(this._bgID) ? bgInfo.commonPath : ToolUtil.replace(bgInfo.path, this._bgID);
            LoadManager.loadSprite(path, this.getComponent(Sprite));
        }
        this.node.active = isShow;
    }
    /**获取显示范围 */
    public getRect() {
        return this.node.getComponent(UITransform).getBoundingBox();
    }
    // 销毁
    public dispose() {
        this.node.destroy();
    }
    protected onDestroy(): void {
        this.releaseAsset();
    }
    // 释放资源
    public releaseAsset() {
    }
}


