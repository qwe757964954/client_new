import { InterfacePath } from "../net/InterfacePath";
import { NetNotify } from "../net/NetNotify";
import { BaseControll } from "../script/BaseControll";
import { EventMgr } from "../util/EventManager";


export default class GlobalService extends BaseControll {
    private static _instance: GlobalService;
    public static getInstance(): GlobalService {
        if (!this._instance || this._instance == null) {
            this._instance = new GlobalService("GlobalService");
        }
        return this._instance;
    }
    constructor(name: string) {
        super(name);
    }

    /** 初始化模块事件 */
    protected onInitModuleEvent() {
        this.addModelListeners([
            [InterfacePath.Classification_UserWeekTaskChange, this.onUserWeekTaskChange],
            [InterfacePath.Classification_UserMainTaskChange, this.onUserMainTaskChange],
            [InterfacePath.Classification_CompleteWeekTask, this.onCompleteWeekTask],
            [InterfacePath.Classification_CompleteMainTask, this.onCompleteMainTask],
            [InterfacePath.Classification_CompleteBoxWeekTask, this.onCompleteBoxWeekTask],
        ]);
    }
    onUserWeekTaskChange(data: any) {
        // this.handleResponse(data, NetNotify.Classification_UserWeekTaskChange);
        EventMgr.dispatch(NetNotify.Classification_UserWeekTaskChange, data);
    }
    private addModelListeners(listeners: [string, (data: any) => void][]): void {
        for (const [path, handler] of listeners) {
            this.addModelListener(path, handler.bind(this));
        }
    }
    onUserMainTaskChange(data: any) {
        // this.handleResponse(data, NetNotify.Classification_UserMainTaskChange);
        EventMgr.dispatch(NetNotify.Classification_UserMainTaskChange, data);
    }

    onCompleteWeekTask(data: any) {
        // this.handleResponse(data, NetNotify.Classification_CompleteWeekTask);
        EventMgr.dispatch(NetNotify.Classification_CompleteWeekTask, data);
    }

    onCompleteMainTask(data: any) {
        // this.handleResponse(data, NetNotify.Classification_CompleteMainTask);
        EventMgr.dispatch(NetNotify.Classification_CompleteMainTask, data);
    }

    onCompleteBoxWeekTask(data: any) {
        // this.handleResponse(data, NetNotify.Classification_CompleteBoxWeekTask);
        EventMgr.dispatch(NetNotify.Classification_CompleteBoxWeekTask, data);
    }
}