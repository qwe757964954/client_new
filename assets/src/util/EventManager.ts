/**
 * 观察者
 */
class Observer{
    /**回调函数 */
    private _callBack: Function = null;
    /**上下文 */
    private _context: any = null;

    constructor(callBack: Function,context: any){
        this._callBack = callBack;
        this._context = context;
    }

    /** 发送通知
     * 
     */
    notify(...args: any[]) {
        if (this._callBack) {
            this._callBack.call(this._context, ...args);
        }
    }

    /**上下文比较
     * 
     */
    compar(context:any):boolean{
        return this._context == context;
    }
}

export default class EventManager {
    private static s_EventManager: EventManager = null;

    private _handleIndex: number;
    private _handles: Map<string, Map<string, Function>>;

    private listeners:{[key:string]:Array<Observer>} = {};

    private constructor() {
        this._handleIndex = -1;
        this._handles = new Map();
    }

    public static instance() {
        if (!this.s_EventManager) {
            this.s_EventManager = new EventManager();
        }
        return this.s_EventManager;
    }

    public static on(type: string, callback: Function) {
        return EventManager.instance().on(type, callback);
    }
    private on(type: string, callback: Function) {
        let map: Map<string, any> = this._handles[type];
        if (!map) {
            map = new Map();
            this._handles[type] = map;
        }
        this._handleIndex++;
        let key = this._handleIndex.toString();
        map.set(key, callback);
        return key;
    }

    public static off(type: string, handle?: string) {
        EventManager.instance().off(type, handle);
    }
    private off(type: string, handle: string) {
        let map: Map<string, any> = this._handles[type];
        if (!map) { return; }
        if (!handle) {
            map.clear();
        } else {
            map.delete(handle);
        }
    }

    public static emit(type: string, data?: any) {
        EventManager.instance().emit(type, data);
    }
    private emit(type: string, data: any) {
        let map: Map<string, any> = this._handles[type];
        if (!map) { return; }
        let ary: Function[] = [];
        //回调方法插入临时表，防止回调方法中修改了map元素
        for (const value of map.values()) {
            ary.push(value);
        }
        for (const v of ary) {
            v(data);
        }
    }
    /**
     * 注册时间  每一个时间对应n个上下文
     * @param name 时间名称
     * @param callback 回调函数
     * @param context 上下文 可空
     */
    public addListener(name: string, callback: Function, context?: any) {
        let observers: Observer[] = this.listeners[name];
        if (!observers) {
            observers = [];
            this.listeners[name] = observers;
        }
        this.listeners[name].push(new Observer(callback, context));
    }
    /**
     * 移除事件
     * @param name 事件名称
     * @param context 上下文
     * @returns 
     */
    public removeListener(name: string, context: any) {
        let observers: Observer[] = this.listeners[name];
        if (!observers) {
            return;
        }
        for (let i = 0; i < observers.length; i++) {
            if (observers[i].compar(context)) {
                observers.splice(i, 1);
                break;
            }
        }
        if(observers.length === 0) {
            delete this.listeners[name];
        }
    }
    /**
     * 分发事件
     * @param event 事件名称 
     * @param args 参数
     */
    public dispatch(event:string,...args:any[]){
        /**获取该事件相关的所有上下文 */
        let observers: Observer[] = this.listeners[event];
        if (!observers) {
            return;
        }
        for (let i = 0; i < observers.length; i++) {
            observers[i].notify(...args);
        }
    }
}

export const EventMgr = EventManager.instance();