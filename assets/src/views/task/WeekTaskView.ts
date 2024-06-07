import { _decorator, error, instantiate, isValid, Node, Prefab, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { BaseView } from '../../script/BaseView';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { TaskAchievementView } from './TaskAchievementView';
import { TaskTabView } from './TaskTabView';
import { TaskView } from './TaskView';
const { ccclass, property } = _decorator;

@ccclass('WeekTaskView')
export class WeekTaskView extends BaseView {
    @property(Node)
    public top_layout:Node = null;
    @property(Node)
    public content_layout:Node = null;

    private _tabView:TaskTabView = null;
    private _weekTask:TaskView = null;
    private _achievementView:TaskAchievementView = null;
    async initUI(){
        await this.initWeekTaskView();
        await this.initTaskAchievementView();
        await this.initTaskTabView();
        this.initNavTitle();
        this.initAmout();

    }
    initEvent(){
        
    }
    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps(`每周任务`,()=>{
                ViewsManager.instance.closeView(PrefabType.WorldBossView);
            });
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmout(this.top_layout,11.314,160.722).then((amoutScript: TopAmoutView) => {
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
                    this._weekTask.node.active = selectId == 0;
                    this._achievementView.node.active = selectId == 1;
                })
                let widgetCom = node.getComponent(Widget);
                if (!isValid(widgetCom)) {
                    widgetCom = node.addComponent(Widget);
                    widgetCom.isAlignTop = true;
                    widgetCom.isAlignLeft = true;
                }
                widgetCom.top = 134.284;
                widgetCom.left = 5.868;
                widgetCom.updateAlignment();

                resolve(null);
            });
        })
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
                this._weekTask = node.getComponent(TaskView);
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
                this.node.addChild(node);
                resolve(null);
            });
        })
    }
    removeEvent(){
        
    }
}


