import { Component } from "cc";

// 基础组件
export class BaseComponent extends Component {

    protected _zIndex: number = 0;//层级
    protected _isTopZIndex: boolean = false;//是否置顶

    public get ZIndex(): number {
        return this._zIndex;
    }
    /**置顶 */
    public set topZIndex(_isTopZIndex: boolean) {
        this._isTopZIndex = _isTopZIndex;
    }
    /**是否置顶 */
    public get topZIndex() {
        return this._isTopZIndex;
    }
}