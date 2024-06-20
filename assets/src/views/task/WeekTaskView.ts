import { _decorator, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { ChallengeTaskReward, TaskBaseData, UserMainTaskData, UserWeekTaskData } from '../../models/TaskModel';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TkServer } from '../../service/TaskService';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { DailyTaskView } from './DailyTaskView';
import { MainTaskView } from './MainTaskView';
import { TaskAchievementView } from './TaskAchievementView';
import { TaskAwardView } from './TaskAwardView';
import { TKConfig } from './TaskConfig';
import { WeeklyTaskBox } from './TaskInfo';
import { TaskTabView } from './TaskTabView';
import { WeeklyTaskView } from './WeeklyTaskView';
const { ccclass, property } = _decorator;

export enum TaskMenuType {
    Achievement= 0,/**成就 */
    Week= 1,/**每周 */
    Main= 2,/**主线 */
    Daily= 3/**每日 */
}


@ccclass('WeekTaskView')
export class WeekTaskView extends BaseView {
    protected _className = "WeekTaskView";
    @property(Node)
    public top_layout:Node = null;
    @property(Node)
    public content_layout:Node = null;

    private _tabView:TaskTabView = null;
    private _weekTask:WeeklyTaskView = null;
    private _mainTask:MainTaskView = null;
    private _dailyTask:DailyTaskView = null;
    private _achievementView:TaskAchievementView = null;
    private _taskAward:TaskAwardView = null;
    
    async initUI(){
        this.initNavTitle();
        this.initAmout();
        try {
            await TKConfig.loadTaskConfigInfo();
            await Promise.all([
                this.initRewardView(),
                this.initTaskAchievementView(),
                this.initWeekTaskView(),
                this.initMainTaskView(),
                this.initDailyTaskView(),
                this.initTaskTabView(),
            ]);
            console.log("Task configuration loaded:", TKConfig.taskConfigInfo);
        } catch (err) {
            console.error("Failed to initialize UI:", err);
        }
        TkServer.reqUserMainTask();
        TkServer.reqUserWeekTask();
    }
    /** 初始化模块事件 */
    protected onInitModuleEvent() {
        this.addModelListeners([
            [NetNotify.Classification_UserMainTask, this.onUserMainTask],
            [NetNotify.Classification_UserWeekTask, this.onUserWeekTask],
            [EventType.Challenge_Task_Reward, this.onChallengeTaskReward],
            [NetNotify.Classification_GetWeekTaskReward, this.onChallengeTaskRewardResponse],
            [EventType.Box_Challenge_Reward, this.onChallengeBoxReward],
            [NetNotify.Classification_GetBoxTaskReward, this.onChallengeBoxRewardResponse],
            [NetNotify.Classification_UserWeekTaskChange, this.onUserWeekTaskChangeResponse],
            [NetNotify.Classification_UserMainTaskChange, this.onUserMainTaskChangeResponse],
            [NetNotify.Classification_CompleteWeekTask, this.onCompleteWeekTaskResponse],
            [NetNotify.Classification_CompleteMainTask, this.onCompleteMainTaskResponse],
            [NetNotify.Classification_CompleteBoxWeekTask, this.onCompleteBoxWeekTaskResponse],
        ]);
    }
    onChallengeTaskReward(data:TaskBaseData) {
        TkServer.reqGetWeekTaskReward(data.task_id);
    }
    onChallengeBoxReward(data:WeeklyTaskBox) {
        TkServer.reqGetBoxTaskReward(data.id);
    }
    onUserMainTask(taskData: UserMainTaskData) {
        console.log("onUserMainTask",taskData);
        this._mainTask.updateData(taskData.data);
    }
    onUserWeekTask(taskData: UserWeekTaskData) {
        console.log("onUserWeekTask",taskData);
        this._weekTask.updateData(taskData.weekly_task);
        this._taskAward.updateTaskAwardProgress(taskData.weekly_live,taskData.weekly_box);

    }
    onChallengeTaskRewardResponse(data:ChallengeTaskReward){
        console.log("onChallengeTaskRewardResponse",data);
        TkServer.reqUserWeekTask();
    }
    onChallengeBoxRewardResponse(data:any){
        console.log("onChallengeBoxRewardResponse",data);
        TkServer.reqUserWeekTask();
    }
    onUserWeekTaskChangeResponse(data:any){
        console.log("onUserWeekTaskChangeResponse",data);
    }
    onUserMainTaskChangeResponse(data:any){
        console.log("onUserMainTaskChangeResponse",data);
    }
    onCompleteWeekTaskResponse(data:any){
        console.log("onCompleteWeekTaskResponse",data);
    }
    onCompleteMainTaskResponse(data:any){
        console.log("onCompleteMainTaskResponse",data);
    }
    onCompleteBoxWeekTaskResponse(data:any){
        console.log("onCompleteBoxWeekTaskResponse",data);
    }
    
    initEvent(){
        
    }
    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps(`每周任务`,()=>{
                ViewsManager.instance.closeView(PrefabType.WeekTaskView);
            });
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmout(this.top_layout,6.501,71.254).then((amoutScript: TopAmoutView) => {
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:User.diamond},
                {type:AmoutType.Coin,num:User.coin},
                {type:AmoutType.Energy,num:User.stamina}];
            amoutScript.loadAmoutData(dataArr);
        });
    }

    private async initTaskTabView() {
        let node = await this.loadAndInitPrefab(PrefabType.TaskTabView, this.node, {
            isAlignTop: true,
            isAlignLeft: true,
            top: 129,
            left: 50
        });
        this._tabView = node.getComponent(TaskTabView);
        this._tabView.setTabSelectClick((selectId: number) => {
            this.hideAllContent();
            this.clickMenuSelect(selectId);
        });
    }

    clickMenuSelect(menuType:TaskMenuType){
        switch (menuType) {
            case TaskMenuType.Achievement:
                this._achievementView.node.active = true;
                break;
            case TaskMenuType.Week:
                this._weekTask.showTask();
                break;
            case TaskMenuType.Main:
                this._mainTask.showTask();
                break;
            case TaskMenuType.Daily:
                this._dailyTask.showTask();
                break;
            default:
                break;
        }
    }

    hideAllContent(){
        this._weekTask.node.active = false;
        this._achievementView.node.active = false;
        this._mainTask.node.active = false;
        this._dailyTask.node.active = false;
    }
    private async initWeekTaskView() {
        let node = await this.loadAndInitPrefab(PrefabType.TaskView, this.node);
        this._weekTask = node.getComponent(WeeklyTaskView);
        this._weekTask.node.active = false;
    }

    private async initMainTaskView() {
        let node = await this.loadAndInitPrefab(PrefabType.MainTaskView, this.node);
        this._mainTask = node.getComponent(MainTaskView);
        this._mainTask.node.active = false;
    }
    private async initDailyTaskView() {
        let node = await this.loadAndInitPrefab(PrefabType.DailyTaskView, this.node);
        this._dailyTask = node.getComponent(DailyTaskView);
        this._dailyTask.updateData([]); // Assuming an empty array for initial data
        this._dailyTask.node.active = false;
    }
    private async initTaskAchievementView(){
        let node = await this.loadAndInitPrefab(PrefabType.TaskAchievementView, this.node)
        this._achievementView = node.getComponent(TaskAchievementView);
    }

    private async initRewardView() {
        let node = await this.loadAndInitPrefab(PrefabType.TaskAwardView, this.node, {
            isAlignTop: true,
            isAlignRight: true,
            top: 123,
            right: 78
        })
        this._taskAward = node.getComponent(TaskAwardView);
    }
    removeEvent(){
        
    }
}


