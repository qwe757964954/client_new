import { Component } from "cc";
import { EventMgr } from "../util/EventManager";

// 基础组件
export class BaseComponent extends Component {
	protected _className = "BaseComponent";
	protected _zIndex: number = 0;//层级
	protected _isTopZIndex: boolean = false;//是否置顶
	protected _eventlistener = {};
	public get ZIndex(): number {
		return this._zIndex;
	}

	constructor(name: string) {
		super(name);
		this._className = name;
		// console.log(`${this._className}初始化...`);
		this.onInitModuleEvent();
	}
	/**override 初始化模块事件，子类需重写该方法 */
	protected onInitModuleEvent() {

	}
	/**置顶 */
	public set topZIndex(_isTopZIndex: boolean) {
		this._isTopZIndex = _isTopZIndex;
	}
	/**是否置顶 */
	public get topZIndex() {
		return this._isTopZIndex;
	}
	/**
	 * 添加事件绑定
	 * @param name 事件名称
	 * @param callback 回调函数
	 */
	public addModelListener(name: string, callback: Function) {
		this.removeModelListener(name);
		this._eventlistener[name] = name
		EventMgr.addListener(name, callback, this)
	}
	/**
	 * 移除事件
	 * @param name 
	 */
	public removeModelListener(name: string) {
		if (this._eventlistener[name]) {
			EventMgr.removeListener(name, this)
			this._eventlistener[name] = null;
		}

	}
	/**
	 * 移除所有事件
	 * @param name 
	 */
	public removeAllModelListener() {
		for (const event in this._eventlistener) {
			if (Object.prototype.hasOwnProperty.call(this._eventlistener, event)) {
				this.removeModelListener(event)
			}
		}
		this._eventlistener = {}
	}
	/**清理所有 */
	public clear() {
		this.removeAllModelListener()
	}

	public addEvent(name: string, callback: Function) {
		this.delEvent(name);
		this._eventlistener[name] = EventMgr.on(name, callback);
	}
	public delEvent(name: string) {
		if (Object.prototype.hasOwnProperty.call(this._eventlistener, name)) {
			EventMgr.off(name, this._eventlistener[name])
			this._eventlistener[name] = null;
		}
	}
	public clearEvent() {
		for (let event in this._eventlistener) {
			this.delEvent(event);
		}
		this._eventlistener = {};
	}
}