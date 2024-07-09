import { Node, Rect, _decorator, sp } from 'cc';
import { MapSpInfo } from '../config/MapConfig';
import { PrefabType } from '../config/PrefabType';
import { LoadManager } from '../manager/LoadManager';
import { BaseModel } from './BaseModel';
const { ccclass, property } = _decorator;

export class MapSpModel extends BaseModel {

    private _sp: sp.Skeleton = null;//动画
    // private _spNode: Node = null;//sp节点

    private _data: MapSpInfo;//数据
    private _isSpLoad: boolean = false;//是否加载动画

    public dispose(): void {
        if (this._node && this._node.isValid) {
            this._node.destroy();
            this._node = null;
        }
    }

    /**初始化 */
    public init(data: MapSpInfo, parent: Node) {
        this._data = data;
        this._parent = parent;
        this._pos = data.pos;
    }
    /**显示动画 */
    public showAnimation(callBack?: Function) {
        LoadManager.loadSpine(this._data.path, this._sp).then((skeletonData: sp.SkeletonData) => {
            this._isSpLoad = true;
            this.showNormalAnimation();
            if (callBack) callBack();
        });
    }
    /**显示与否 */
    public show(isShow: boolean, callBack?: Function) {
        if (this._node) {
            this._node.active = isShow;
        }
        this._isShow = isShow;
        if (isShow && !this._isLoad) {
            this._isLoad = true;
            if (this._node) {
                this.showAnimation(callBack);
            } else {
                this.loadNode(callBack);
            }
        } else {
            if (callBack) callBack();
        }
    }
    /**加载node */
    public loadNode(callBack?: Function) {
        if (!this._isLoadNode) {
            this._isLoadNode = true;

            LoadManager.loadPrefab(PrefabType.SpModel.path, this._parent, true).then((node: Node) => {
                this._node = node;
                this._node.active = this._isShow;
                this._node.position = this._pos;
                this._sp = node.getComponentInChildren(sp.Skeleton);
                // this._spNode = node.getChildByName("spNode");
                if (this._data.scale) {
                    this._sp.node.scale = this._data.scale;
                }

                if (this._isLoad) {
                    this.showAnimation(callBack);
                } else {
                    if (callBack) callBack();
                }
            });
        } else {
            if (callBack) callBack();
        }
    }
    /**获取显示范围 */
    public getRect() {
        let rect = new Rect(this._data.rect);
        rect.x += this._pos.x;
        rect.y += this._pos.y;
        return rect;
    }
    /**显示常态动画 */
    public showNormalAnimation() {
        if (!this._isSpLoad) return;
        this._sp.setAnimation(0, this._data.names[0], true);
    }
}


