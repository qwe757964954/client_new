

/**
 * Name = BaseView
 * URL = db://assets/framework/vc/BaseView.ts
 * Time = Mon Apr 18 2022 10:23:29 GMT+0800 (中国标准时间)
 * Author = xueya
 *
 */

import { Component, Node, Prefab, Widget, instantiate } from "cc";
import { PrefabTypeEntry } from "../config/PrefabType";
import { ResLoader } from "../manager/ResLoader";
import { ViewsManager } from "../manager/ViewsManager";
import { EventMgr } from "../util/EventManager";
import { NavTitleView } from "../views/common/NavTitleView";
export class BaseView extends Component{
	protected _className = "BaseView";
    /**子类继承的onload函数 */
	private extent_onLoad = null;
	/**子类继承的销毁函数 */
	private extent_onDestroy = null;
	protected _Eventlistener = {};
	protected _schedulerHandler = {};
	protected _schedulerHandlerOnce = {};
	protected _navTitleView:NavTitleView = null;
	//实例化
	constructor(name: string) {
        super();
		this._className = name ? name: this._className;
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
		// this.onLoadBefore()
	}
	start() {
		this.initUI();
        this.initEvent();
	}
	protected initUI(){

    }
	protected initEvent(){

    }
    protected removeEvent(){
        
    }
	/**override 定时器的回调更新，子类需重写该方法 */
	protected onSchedulerUpdate(dt?: number) {

	}
	/**override 初始化模块事件，子类需重写该方法 */
	protected onInitModuleEvent() {

	}
	protected addModelListeners(listeners: [string, (data: any) => void][]): void {
        for (const [path, handler] of listeners) {
            this.addModelListener(path, handler.bind(this));
        }
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
		this.removeEvent();
	};
	protected async createNavigation(title: string, top_layout: Node,onBack: () => void) {
        this._navTitleView = await ViewsManager.addNavigation(top_layout, 0, 0);
        this._navTitleView.updateNavigationProps(title, onBack);
    }


	/**从prefab加载预制体 */
	protected async loadAndInitPrefab(prefabType: PrefabTypeEntry, parentNode: Node, widgetOptions?: Partial<Widget>): Promise<Node> {
        try {
            const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${prefabType.path}`, Prefab) as Prefab;
            const node = instantiate(prefab);
            parentNode.addChild(node);

            let widgetCom = node.getComponent(Widget);
            if (widgetOptions) {
                widgetCom = widgetCom || node.addComponent(Widget);
                Object.assign(widgetCom, widgetOptions);
                widgetCom.updateAlignment();
            }
            return node
        } catch (err) {
            console.error(`Failed to load component from ${prefabType.path}:`, err);
            throw err;
        }
    }
}

