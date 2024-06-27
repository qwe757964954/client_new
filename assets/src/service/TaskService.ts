import { c2sGetBoxTaskReward, c2sGetMainTaskReward, c2sGetWeekTaskReward, c2sUserMainTask, c2sUserWeekTask } from "../models/TaskModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { NetNotify } from "../net/NetNotify";
import { BaseControll } from "../script/BaseControll";


export default class _TaskService extends BaseControll {
    private static _instance: _TaskService;
    public static getInstance(): _TaskService {
        if (!this._instance || this._instance == null) {
            this._instance = new _TaskService("_TaskService");
        }
        return this._instance;
    }
    constructor(name: string) {
        super(name);
    }

    /** 初始化模块事件 */
    protected onInitModuleEvent() {
        this.addModelListeners([
            [InterfacePath.Classification_UserMainTask, this.onUserMainTask],
            [InterfacePath.Classification_UserWeekTask, this.onUserWeekTask],
            [InterfacePath.Classification_GetMainTaskReward, this.onGetMainTaskReward],
            [InterfacePath.Classification_GetWeekTaskReward, this.onGetWeekTaskReward],
            [InterfacePath.Classification_GetBoxTaskReward, this.onGetBoxTaskReward],
        ]);
    }

    reqUserMainTask(){
        let param: c2sUserMainTask = new c2sUserMainTask();
        NetMgr.sendMsg(param);
    }

    reqUserWeekTask(){
        let param: c2sUserWeekTask = new c2sUserWeekTask();
        NetMgr.sendMsg(param);
    }

    reqGetMainTaskReward(task_id:number){
        let param: c2sGetMainTaskReward = new c2sGetMainTaskReward();
        param.task_id = task_id;
        NetMgr.sendMsg(param);
    }
    
    reqGetWeekTaskReward(task_id:number){
        let param: c2sGetWeekTaskReward = new c2sGetWeekTaskReward();
        param.task_id = task_id;
        NetMgr.sendMsg(param);
    }

    reqGetBoxTaskReward(box_id:number){
        let param: c2sGetBoxTaskReward = new c2sGetBoxTaskReward();
        param.box_id = box_id;
        NetMgr.sendMsg(param);
    }

    onUserMainTask(data: any) {
        this.handleResponse(data, NetNotify.Classification_UserMainTask);
    }
    onUserWeekTask(data: any) {
        this.handleResponse(data, NetNotify.Classification_UserWeekTask);
    }
    onGetMainTaskReward(data: any) {
        this.handleResponse(data, NetNotify.Classification_GetMainTaskReward);
    }
    onGetWeekTaskReward(data: any) {
        this.handleResponse(data, NetNotify.Classification_GetWeekTaskReward);
    }
    onGetBoxTaskReward(data: any) {
        this.handleResponse(data, NetNotify.Classification_GetBoxTaskReward);
    }
}

export const TkServer = _TaskService.getInstance();