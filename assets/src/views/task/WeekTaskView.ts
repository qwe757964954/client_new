import { _decorator, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType, PrefabTypeEntry } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { ItemData } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { ChallengeBoxRewardData, ChallengeTaskReward, TaskBaseData, UserMainTaskData, UserWeekTaskData } from '../../models/TaskModel';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TkServer } from '../../service/TaskService';
import CCUtil from '../../util/CCUtil';
import { ToolUtil } from '../../util/ToolUtil';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { CongratulationsView } from './CongratulationsView';
import { DailyTaskView } from './DailyTaskView';
import { MainTaskView } from './MainTaskView';
import { TaskAchievementView } from './TaskAchievementView';
import { TaskAwardView } from './TaskAwardView';
import { TKConfig } from './TaskConfig';
import { TaskTabIds, TaskTabInfos, WeeklyTaskBox } from './TaskInfo';
import { TaskTabView } from './TaskTabView';
import { WeeklyTaskView } from './WeeklyTaskView';

const { ccclass, property } = _decorator;

@ccclass('WeekTaskView')
export class WeekTaskView extends BaseView {
    protected _className = "WeekTaskView";

    @property(Node)
    public top_layout: Node = null;

    @property(Node)
    public content_layout: Node = null;

    private _tabView: TaskTabView = null;
    private _weekTask: WeeklyTaskView = null;
    private _mainTask: MainTaskView = null;
    private _dailyTask: DailyTaskView = null;
    private _achievementView: TaskAchievementView = null;
    private _taskAward: TaskAwardView = null;

    async initUI() {
        let scale = ToolUtil.getValue(GlobalConfig.WIN_DESIGN_RATE, 0.1, 1.0);
        CCUtil.setNodeScale(this.node, scale);
        this.initNavTitle();
        this.initAmout();
        try {
            await TKConfig.loadTaskConfigInfo();
            await this.initViews();
            console.log("Task configuration loaded:", TKConfig.taskConfigInfo);
        } catch (err) {
            console.error("Failed to initialize UI:", err);
        }
        this.fetchInitialData();
    }

    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.TaskAwardView, (node) => this._taskAward = node.getComponent(TaskAwardView), {
                isAlignTop: true,
                isAlignRight: true,
                top: 123,
                right: 78
            }),
            this.initViewComponent(PrefabType.TaskAchievementView, (node) => this._achievementView = node.getComponent(TaskAchievementView)),
            this.initViewComponent(PrefabType.TaskView, (node) => {
                this._weekTask = node.getComponent(WeeklyTaskView);
                this._weekTask.node.active = false;
            }),
            this.initViewComponent(PrefabType.MainTaskView, (node) => {
                this._mainTask = node.getComponent(MainTaskView);
                this._mainTask.node.active = false;
            }),
            this.initViewComponent(PrefabType.DailyTaskView, (node) => {
                this._dailyTask = node.getComponent(DailyTaskView);
                this._dailyTask.updateData([]);
                this._dailyTask.node.active = false;
            }),
            this.initViewComponent(PrefabType.TaskTabView, (node) => {
                this._tabView = node.getComponent(TaskTabView);
                this._tabView.setTabSelectClick(this.onTabSelect.bind(this));
                this._tabView.updateData(TaskTabInfos);
            }, {
                isAlignTop: true,
                isAlignLeft: true,
                top: 129,
                left: 50
            })
        ]);
    }

    private async initViewComponent(prefabType: PrefabTypeEntry, onComponentInit: (node: Node) => void, alignOptions?: object) {
        let node = await this.loadAndInitPrefab(prefabType, this.node, alignOptions);
        onComponentInit(node);
    }

    private fetchInitialData() {
        TkServer.reqUserMainTask();
        TkServer.reqUserWeekTask();
    }

    protected onInitModuleEvent() {
        this.addModelListeners([
            [NetNotify.Classification_UserMainTask, this.onUserMainTask.bind(this)],
            [NetNotify.Classification_UserWeekTask, this.onUserWeekTask.bind(this)],
            [EventType.Challenge_Week_Task_Reward, this.onChallengeWeekTaskReward.bind(this)],
            [EventType.Challenge_Main_Task_Reward, this.onChallengeMainTaskReward.bind(this)],
            [NetNotify.Classification_GetWeekTaskReward, this.onChallengeWeekTaskRewardResponse.bind(this)],
            [NetNotify.Classification_GetMainTaskReward, this.onChallengeMainTaskRewardResponse.bind(this)],
            [EventType.Box_Challenge_Reward, this.onChallengeBoxReward.bind(this)],
            [NetNotify.Classification_GetBoxTaskReward, this.onChallengeBoxRewardResponse.bind(this)],
            [NetNotify.Classification_UserWeekTaskChange, this.onUserWeekTaskChangeResponse.bind(this)],
            [NetNotify.Classification_UserMainTaskChange, this.onUserMainTaskChangeResponse.bind(this)],
            [NetNotify.Classification_CompleteWeekTask, this.onCompleteWeekTaskResponse.bind(this)],
            [NetNotify.Classification_CompleteMainTask, this.onCompleteMainTaskResponse.bind(this)],
            [NetNotify.Classification_CompleteBoxWeekTask, this.onCompleteBoxWeekTaskResponse.bind(this)],
        ]);
    }

    onChallengeMainTaskReward(data: TaskBaseData) {
        TkServer.reqGetMainTaskReward(data.task_id);
    }

    onChallengeWeekTaskReward(data: TaskBaseData) {
        TkServer.reqGetWeekTaskReward(data.task_id);
    }

    onChallengeBoxReward(data: WeeklyTaskBox) {
        TkServer.reqGetBoxTaskReward(data.id);
    }

    onUserMainTask(taskData: UserMainTaskData) {
        console.log("onUserMainTask", taskData);
        this._mainTask.updateData(taskData.data);
    }

    onUserWeekTask(taskData: UserWeekTaskData) {
        console.log("onUserWeekTask", taskData);
        this._weekTask.updateData(taskData.weekly_task);
        this._taskAward.updateTaskAwardProgress(taskData.weekly_live, taskData.weekly_box);
    }

    onChallengeWeekTaskRewardResponse(taskData: ChallengeTaskReward) {
        console.log("onChallengeWeekTaskRewardResponse", taskData);
        this.showRewardPopup(
            TKConfig.taskConfigInfo.task_week,
            taskData.task_id,
            PrefabType.CongratulationsView
        );
        TkServer.reqUserWeekTask();
    }

    onChallengeMainTaskRewardResponse(taskData: ChallengeTaskReward) {
        console.log("onChallengeMainTaskRewardResponse", taskData);
        this.showRewardPopup(
            TKConfig.taskConfigInfo.task_main,
            taskData.task_id,
            PrefabType.CongratulationsView
        );
        TkServer.reqUserMainTask();
    }

    onChallengeBoxRewardResponse(rewardData: ChallengeBoxRewardData) {
        console.log("onChallengeBoxRewardResponse", rewardData);
        this.showRewardPopup(
            TKConfig.taskConfigInfo.task_week_box,
            rewardData.box_id,
            PrefabType.CongratulationsView
        );
        TkServer.reqUserWeekTask();
    }

    private async showRewardPopup<T extends { id: number, reward: any }>(taskList: T[], id: number, popupType: PrefabTypeEntry) {
        let taskInfo = taskList.find(item => item.id === id);
        if (taskInfo) {
            let rewardArr: ItemData[] = TKConfig.convertRewardData(taskInfo.reward);
            let node:Node = await ViewsManager.instance.showPopup(popupType);
            let nodeScript: CongratulationsView = node.getComponent(CongratulationsView);
            nodeScript.updateRewardScroll(rewardArr);
        }
    }

    onUserWeekTaskChangeResponse(data: any) {
        console.log("onUserWeekTaskChangeResponse", data);
    }

    onUserMainTaskChangeResponse(data: any) {
        console.log("onUserMainTaskChangeResponse", data);
    }

    onCompleteWeekTaskResponse(data: any) {
        console.log("onCompleteWeekTaskResponse", data);
    }

    onCompleteMainTaskResponse(data: any) {
        console.log("onCompleteMainTaskResponse", data);
    }

    onCompleteBoxWeekTaskResponse(data: any) {
        console.log("onCompleteBoxWeekTaskResponse", data);
    }

    private initNavTitle() {
        this.createNavigation("每周任务",this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.WeekTaskView);
        });
    }

    private initAmout() {
        this.createTopAmout([
            { type: AmoutType.Diamond, num: User.diamond },
            { type: AmoutType.Coin, num: User.coin },
            { type: AmoutType.Energy, num: User.stamina }
        ]);
    }

    private async createTopAmout(dataArr: AmoutItemData[]) {
        let amoutScript: TopAmoutView = await ViewsManager.addAmout(this.top_layout, 6.501, 71.254);
        amoutScript.loadAmoutData(dataArr);
    }

    private onTabSelect(selectId: number) {
        this.hideAllContent();
        this.selectMenuType(selectId);
    }

    private selectMenuType(menuType: TaskTabIds) {
        switch (menuType) {
            case TaskTabIds.AchievementChallenge:
                this._achievementView.node.active = true;
                break;
            case TaskTabIds.WeeklyTasks:
                this._weekTask.showTask();
                break;
            case TaskTabIds.MainTasks:
                this._mainTask.showTask();
                break;
            case TaskTabIds.DailyTasks:
                this._dailyTask.showTask();
                break;
            default:
                break;
        }
    }

    private hideAllContent() {
        this._weekTask.node.active = false;
        this._achievementView.node.active = false;
        this._mainTask.node.active = false;
        this._dailyTask.node.active = false;
    }
}
