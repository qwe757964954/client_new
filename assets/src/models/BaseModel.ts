import { Node, Rect, Vec3 } from "cc";

export class BaseModel {
    protected _pos: Vec3;//位置
    protected _isLoad: boolean = false;//是否加载
    protected _parent: Node = null;//父节点
    protected _node: Node = null;//节点
    protected _isShow: boolean = false;//是否显示
    protected _zIndex: number = 0;//层级
    protected _isTopZIndex: boolean = false;//是否置顶
    public get ZIndex(): number {
        return this._zIndex;
    }
    public get node(): Node {
        return this._node;
    }
    public get parent(): Node {
        return this._parent;
    }
    public set parent(parent: Node) {
        this._parent = parent;
    }
    public get isShow(): boolean {
        return this._isShow;
    }
    public set pos(pos: Vec3) {
        this._pos = pos;
    }
    /**置顶 */
    public set topZIndex(_isTopZIndex: boolean) {
        this._isTopZIndex = _isTopZIndex;
    }
    /**是否置顶 */
    public get topZIndex() {
        return this._isTopZIndex;
    }
    /**获取显示范围 */
    public getRect() {
        return new Rect(0, 0, 1, 1);
    }
    /**显示与否 */
    public show(isShow: boolean, callBack?: Function) {
        if (callBack) callBack();
    }
    /**销毁 */
    public dispose() {
    }
}