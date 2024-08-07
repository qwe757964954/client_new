import { Component, Rect } from "cc";
import { EventMgr } from "../util/EventManager";

// 基础组件
export class BaseComponent extends Component {
	protected _zIndex: number = 0;//层级
	protected _isTopZIndex: boolean = false;//是否置顶标记
	protected _eventlistener = {};
	public get ZIndex(): number {
		return this._zIndex;
	}

	constructor(name: string) {
		super(name);
		console.log("BaseComponent constructor", this.name);
	}
	/**置顶 */
	public set topZIndex(_isTopZIndex: boolean) {
		this._isTopZIndex = _isTopZIndex;
	}
	/**是否置顶 */
	public get topZIndex() {
		return this._isTopZIndex;
	}
	/**添加事件监听 */
	public addEvent(name: string, callback: Function) {
		this.delEvent(name);
		this._eventlistener[name] = EventMgr.on(name, callback);
	}
	/**移除事件监听 */
	public delEvent(name: string) {
		if (Object.prototype.hasOwnProperty.call(this._eventlistener, name)) {
			EventMgr.off(name, this._eventlistener[name])
			this._eventlistener[name] = null;
		}
	}/**清理所有事件监听 */
	public clearEvent() {
		for (let event in this._eventlistener) {
			this.delEvent(event);
		}
		this._eventlistener = {};
	}
	/**获取显示范围 */
	public getRect() {
		return new Rect(0, 0, 1, 1);
	}
	/**显示与否 */
	public show(isShow: boolean, callBack?: Function) {
		if (callBack) callBack();
	}
}