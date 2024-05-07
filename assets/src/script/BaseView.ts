

/**
 * Name = BaseView
 * URL = db://assets/framework/vc/BaseView.ts
 * Time = Mon Apr 18 2022 10:23:29 GMT+0800 (中国标准时间)
 * Author = xueya
 *
 */

import { Component } from "cc";
import { EventMgr } from "../util/EventManager";
export class BaseView extends Component{
	protected _className = "BaseView";
    /**子类继承的onload函数 */
	private extent_onLoad = null;
	/**子类继承的销毁函数 */
	private extent_onDestroy = null;
	protected _Eventlistener = {};
	protected _schedulerHandler = {};
	protected _schedulerHandlerOnce = {};
	//实例化
	constructor(name: string) {
        super();
		this._className = name;
		console.log(`${this._className}初始化...`)
		/**重载onLoad */
		this.extent_onLoad = this.onLoad;
		this.onLoad = function () {
			this.onLoadBefore()
			this.extent_onLoad()
		}

		/**重载销毁 加入自动清理 */
		this.extent_onDestroy = this.onDestroy
		this.onDestroy = function () {
			this.onDestroyBefore()
			this.extent_onDestroy()
		}
	};
    /**
     * 在onload之前调用
     */
    private onLoadBefore() {
        this.removeAllModelListener();
        this.onInitModuleEvent();
    }
    onLoad() {
		this.onLoadBefore()
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
	 * 发送事件
	 * @param name 事件名称
	 * @param callback 回调函数
	 */
	protected dispatchEvent(name: string, ...args: any[]) {
		EventMgr.dispatch(name, ...args)
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
	/**
	 * 清理(在调用 onDestroy 前自动清理)
	 */
	private onDestroyBefore() {
		this.removeAllModelListener()
	}

    //销毁
	onDestroy() {
		this.onDestroyBefore()
	};
}
