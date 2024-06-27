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
        // 图片描点(0,1.0)
        let bgInfo = MapConfig.bgInfo;
        let maxWidth = bgInfo.maxWidth;
        let maxHeight = bgInfo.maxHeight;
        let width = bgInfo.width;
        let height = bgInfo.height;
        this.node.position = new Vec3(this._x * width - 0.5 * maxWidth, 0.5 * maxHeight - this._y * height, 0);
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
    public show(isShow: boolean, callBack?: Function) {
        this.node.active = isShow;
        if (isShow && !this._isLoad) {
            this._isLoad = true;
            let bgInfo = MapConfig.bgInfo;
            let path = this.isCommonBg(this._bgID) ? bgInfo.commonPath : ToolUtil.replace(bgInfo.path, this._bgID);
            // let path = ToolUtil.replace(bgInfo.path, this._bgID);
            LoadManager.loadSprite(path, this.getComponent(Sprite)).then((sprite: Sprite) => {
                // console.log("bg加载完成", this._bgID, callBack ? "有回调" : "无回调");
                if (callBack) callBack();
            });
        } else {
            if (callBack) callBack();
        }
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


