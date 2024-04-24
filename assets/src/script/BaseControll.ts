

/**
 * Name = BaseControll
 * URL = db://assets/framework/vc/BaseControll.ts
 * Time = Mon Apr 18 2022 10:23:29 GMT+0800 (中国标准时间)
 * Author = xueya
 *
 */

import { EventMgr } from "../util/EventManager";
export class BaseControll {
	protected _className = "BaseControll";

	protected _Eventlistener = {};
	protected _schedulerHandler = {};
	protected _schedulerHandlerOnce = {};
	//实例化
	constructor(name: string) {
		this._className = name;
		console.log(`${this._className}初始化...`)
		this.onInitModuleEvent()
	};

	/**override 定时器的回调更新，子类需重写该方法 */
	protected onSchedulerUpdate(dt?: number) {

	}
	/**override 初始化模块事件，子类需重写该方法 */
	protected onInitModuleEvent() {

	}
	/**
	 * 添加事件绑定
	 * @param name 事件名称
	 * @param callback 回调函数
	 */
	public addModelListener(name: string, callback: Function) {
		this.removeModelListener(name);
		this._Eventlistener[name] = name
		EventMgr.addListener(name, callback, this)
	}

	/**
	 * 移除事件
	 * @param name 
	 */
	public removeModelListener(name: string) {
		if (this._Eventlistener[name]) {
			EventMgr.removeListener(name, this)
			this._Eventlistener[name] = null;
		}

	}
	/**
	 * 移除所有事件
	 * @param name 
	 */
	public removeAllModelListener() {
		for (const event in this._Eventlistener) {
			if (Object.prototype.hasOwnProperty.call(this._Eventlistener, event)) {
				this.removeModelListener(event)
			}
		}
		this._Eventlistener = {}
	}
	/**清理所有 */
	public clear() {
		this.removeAllModelListener()
	}

}

