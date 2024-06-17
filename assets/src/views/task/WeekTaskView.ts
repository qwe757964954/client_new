import { _decorator, error, instantiate, isValid, JsonAsset, Node, Prefab, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { BaseView } from '../../script/BaseView';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { DailyTaskView } from './DailyTaskView';
import { MainTaskView } from './MainTaskView';
import { TaskAchievementView } from './TaskAchievementView';
import { TaskAwardView } from './TaskAwardView';
import { TaskData } from './TaskInfo';
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
    private _taskConfigInfo:TaskData = null;
    async initUI(){
        this.initNavTitle();
        this.initAmout();
        await this.loadTaskConfigInfo();
        await this.initRewardView();
        await this.initTaskAchievementView();
        await this.initWeekTaskView();
        await this.initMainTaskView();
        await this.initDailyTaskView();
        await this.initTaskTabView();
        console.log("this._taskConfigInfo", this._taskConfigInfo);
    }

    async loadTaskConfigInfo(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ResLoader.instance.load(`task/task`, JsonAsset, async (err: Error | null, jsonData: JsonAsset) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    this._taskConfigInfo = jsonData.json as TaskData;
                    resolve();
                }
            });
        });
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
    /**初始化tab */
    initTaskTabView(){
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.TaskTabView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    error && console.error(err);
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                this.node.addChild(node);
                this._tabView = node.getComponent(TaskTabView);
                this._tabView.setTabSelectClick((selectId:number)=>{
                    this.hidenAllContent();
                    this.clickMenuSelect(selectId);
                })
                let widgetCom = node.getComponent(Widget);
                if (!isValid(widgetCom)) {
                    widgetCom = node.addComponent(Widget);
                    widgetCom.isAlignTop = true;
                    widgetCom.isAlignLeft = true;
                }
                widgetCom.top = 129;
                widgetCom.left = 50;
                widgetCom.updateAlignment();

                resolve(null);
            });
        })
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

    hidenAllContent(){
        this._weekTask.node.active = false;
        this._achievementView.node.active = false;
        this._mainTask.node.active = false;
        this._dailyTask.node.active = false;
    }

    initWeekTaskView(){
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.TaskView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    error && console.error(err);
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                this._weekTask = node.getComponent(WeeklyTaskView);
                this._weekTask.updateData(this._taskConfigInfo.task_week);
                this._weekTask.node.active = false;
                this.node.addChild(node);
                resolve(null);
            });
        })
    }

    initMainTaskView(){
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.MainTaskView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    error && console.error(err);
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                this._mainTask = node.getComponent(MainTaskView);
                this._mainTask.updateData(this._taskConfigInfo.task_main);
                this._mainTask.node.active = false;
                this.node.addChild(node);
                resolve(null);
            });
        })
    }

    initDailyTaskView(){
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.DailyTaskView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    error && console.error(err);
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                this._dailyTask = node.getComponent(DailyTaskView);
                this._dailyTask.updateData([]);
                this._dailyTask.node.active = false;
                this.node.addChild(node);
                resolve(null);
            });
        })
    }

    initTaskAchievementView(){
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.TaskAchievementView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    error && console.error(err);
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                this._achievementView = node.getComponent(TaskAchievementView);
                this._achievementView.node.active = false;
                this.node.addChild(node);
                resolve(null);
            });
        })
    }

    initRewardView(){
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.TaskAwardView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    error && console.error(err);
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                this.node.addChild(node);
                let widgetCom = node.getComponent(Widget);
                this._taskAward = node.getComponent(TaskAwardView);
                if (!isValid(widgetCom)) {
                    widgetCom = node.addComponent(Widget);
                    widgetCom.isAlignTop = true;
                    widgetCom.isAlignRight = true;
                }
                widgetCom.top = 123;
                widgetCom.right = 78;
                resolve(null);
            });
        })
    }

    removeEvent(){
        
    }
}


