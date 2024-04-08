
export default class EventManager {
    private static s_EventManager: EventManager = null;

    private _handleIndex: number;
    private _handles: Map<string, Map<string, Function>>;

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
}