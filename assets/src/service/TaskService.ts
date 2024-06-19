import { ViewsManager } from "../manager/ViewsManager";
import { c2sCompleteBoxWeekTask, c2sCompleteMainTask, c2sCompleteWeekTask, c2sGetBoxTaskReward, c2sGetMainTaskReward, c2sGetWeekTaskReward, c2sUserMainTask, c2sUserMainTaskChange, c2sUserWeekTask, c2sUserWeekTaskChange } from "../models/TaskModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { NetNotify } from "../net/NetNotify";
import { BaseControll } from "../script/BaseControll";
import { EventMgr } from "../util/EventManager";


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
            [InterfacePath.Classification_UserWeekTaskChange, this.onUserWeekTaskChange],
            [InterfacePath.Classification_UserMainTaskChange, this.onUserMainTaskChange],
            [InterfacePath.Classification_CompleteWeekTask, this.onCompleteWeekTask],
            [InterfacePath.Classification_CompleteMainTask, this.onCompleteMainTask],
            [InterfacePath.Classification_CompleteBoxWeekTask, this.onCompleteBoxWeekTask],
        ]);
    }
    
    private addModelListeners(listeners: [string, (data: any) => void][]): void {
        for (const [path, handler] of listeners) {
            this.addModelListener(path, handler.bind(this));
        }
    }

    private handleResponse(data: any, successNotify: string): void {
        console.log(successNotify, data);
        if (data.code !== 200) {
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(successNotify, data);
    }

    reqUserMainTask(){
        let param: c2sUserMainTask = new c2sUserMainTask();
        NetMgr.sendMsg(param);
    }

    reqUserWeekTask(){
        let param: c2sUserWeekTask = new c2sUserWeekTask();
        NetMgr.sendMsg(param);
    }

    reqGetMainTaskReward(task_id:string){
        let param: c2sGetMainTaskReward = new c2sGetMainTaskReward();
        param.task_id = task_id;
        NetMgr.sendMsg(param);
    }
    
    reqGetWeekTaskReward(task_id:number){
        let param: c2sGetWeekTaskReward = new c2sGetWeekTaskReward();
        param.task_id = task_id;
        NetMgr.sendMsg(param);
    }

    reqGetBoxTaskReward(box_id:string){
        let param: c2sGetBoxTaskReward = new c2sGetBoxTaskReward();
        param.box_id = box_id;
        NetMgr.sendMsg(param);
    }

    reqUserWeekTaskChange(user_id:number){
        let param: c2sUserWeekTaskChange = new c2sUserWeekTaskChange();
        param.user_id = user_id;
        NetMgr.sendMsg(param);
    }
    reqUserMainTaskChange(user_id:number){
        let param: c2sUserMainTaskChange = new c2sUserMainTaskChange();
        param.user_id = user_id;
        NetMgr.sendMsg(param);
    }

    reqCompleteWeekTask(user_id:number){
        let param: c2sCompleteWeekTask = new c2sCompleteWeekTask();
        param.user_id = user_id;
        NetMgr.sendMsg(param);
    }
    reqCompleteMainTask(user_id:number){
        let param: c2sCompleteMainTask = new c2sCompleteMainTask();
        param.user_id = user_id;
        NetMgr.sendMsg(param);
    }

    reqCompleteBoxWeekTask(user_id:number){
        let param: c2sCompleteBoxWeekTask = new c2sCompleteBoxWeekTask();
        param.user_id = user_id;
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
    onUserWeekTaskChange(data: any) {
        this.handleResponse(data, NetNotify.Classification_UserWeekTaskChange);
    }
    onUserMainTaskChange(data: any) {
        this.handleResponse(data, NetNotify.Classification_UserMainTaskChange);
    }

    onCompleteWeekTask(data: any) {
        this.handleResponse(data, NetNotify.Classification_CompleteWeekTask);
    }

    onCompleteMainTask(data: any) {
        this.handleResponse(data, NetNotify.Classification_CompleteMainTask);
    }

    onCompleteBoxWeekTask(data: any) {
        this.handleResponse(data, NetNotify.Classification_CompleteBoxWeekTask);
    }
}

export const TkServer = _TaskService.getInstance();