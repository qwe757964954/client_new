import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { ActivityInfoResponse } from '../../models/ActivityModel';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { TaskTabIds, TaskTabInfo } from '../task/TaskInfo';
import { TaskTabView } from '../task/TaskTabView';
import { ActConfig } from './ActivityConfig';
import { ActivityNewPeople } from './ActivityNewPeople';
import { ActivityTabInfos } from './ActvityInfo';
import { WeekendCarouselView } from './WeekendCarouselView';
const { ccclass, property } = _decorator;

@ccclass('RankView')
export class RankView extends BaseView {
    @property(Node)
    public top_layout: Node = null;

    @property(Node)
    public content_layout: Node = null;
    private _tabView: TaskTabView = null;
    private _activityNewPeople: ActivityNewPeople = null;
    private _weekendCarouselView: WeekendCarouselView = null;
    protected async initUI() {
        this.initNavTitle();
        this.initAmout();
        this.viewAdaptScreen();

        console.log("activityInfoResponse.....",ActConfig.activityInfoResponse);

        try {
            await this.initViews();
            this.initTabs();
            console.log("CollectView configuration loaded:", );
        } catch (err) {
            console.error("Failed to initialize UI:", err);
        }
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [NetNotify.Classification_GetActivityInfo, this.onGetActivityInfo.bind(this)],
        ]);
    }
    onGetActivityInfo(data: ActivityInfoResponse){
        ActConfig.updateActivityInfoResponse(data);
        this._activityNewPeople.updateData();
        this._weekendCarouselView.updateData();
    }

    async initViews(){
        
        await Promise.all([
            this.initViewComponent(PrefabType.ActivityNewPeople, (node) => {
                this._activityNewPeople = node.getComponent(ActivityNewPeople);
                this._activityNewPeople.node.active = false;
            },this.content_layout),
            this.initViewComponent(PrefabType.WeekendCarouselView, (node) => {
                this._weekendCarouselView = node.getComponent(WeekendCarouselView);
                this._weekendCarouselView.node.active = false;
            },this.content_layout),
        ]);
    }
    initTabs(){
        const filteredActivityTabInfos = ActivityTabInfos.filter(tab => {
            if (!ActConfig.activityInfoResponse.sign_activity && tab.id === TaskTabIds.NewbieGift) {
                return false;
            }
            if (!ActConfig.activityInfoResponse.draw_activity && tab.id === TaskTabIds.WeekendCarousel) {
                return false;
            }
            return true;
        });
        this.initViewComponent(PrefabType.TaskTabView, (node) => {
            this._tabView = node.getComponent(TaskTabView);
            this._tabView.setTabSelectClick(this.onTabSelect.bind(this));
            this._tabView.updateData(filteredActivityTabInfos);
        }, {
            isAlignTop: true,
            isAlignLeft: true,
            top: 129,
            left: 50
        },this.content_layout)
    }

    private onTabSelect(info: TaskTabInfo) {
        this.hideAllContent();
        this.selectMenuType(info);
        this._navTitleView.setTitleName(info.title);
    }
    hideAllContent(){
        this._activityNewPeople.node.active = false;
        this._weekendCarouselView.node.active = false;
    }
    selectMenuType(info: TaskTabInfo){
        switch (info.id) {
            case TaskTabIds.NewbieGift:
                this._activityNewPeople.node.active = true;
                this._activityNewPeople.updateData();
                break;
            case TaskTabIds.WeekendCarousel:
                this._weekendCarouselView.node.active = true;
                this._weekendCarouselView.updateData();
                // this._weekTask.showTask();
                break;
            case TaskTabIds.InvitationEvent:
                // this._buildAtlasView.node.active = true;
                // this._mainTask.showTask();
                break;
            case TaskTabIds.ActivityOther:
                // this._clothingIllustratedView.node.active = true;
                // this._dailyTask.showTask();
                break;
            default:
                break;
        }
    }
    private initNavTitle() {
        this.createNavigation("新人豪礼",this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.ActivityView);
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
}

