import { _decorator, Node } from 'cc';
import { PrefabType, PrefabTypeEntry } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { BaseView } from '../../script/BaseView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { TaskTabIds, TaskTabInfo } from '../task/TaskInfo';
import { TaskTabView } from '../task/TaskTabView';
import { ActivityNewPeople } from './ActivityNewPeople';
import { ActivityTabInfos } from './ActvityInfo';
const { ccclass, property } = _decorator;

@ccclass('RankView')
export class RankView extends BaseView {
    @property(Node)
    public top_layout: Node = null;

    @property(Node)
    public content_layout: Node = null;
    private _tabView: TaskTabView = null;
    private _activityNewPeople: ActivityNewPeople = null;
    protected async initUI() {
        this.initNavTitle();
        this.initAmout();
        this.viewAdaptScreen();
        try {
            await this.initViews();
            this.initTabs();
            console.log("CollectView configuration loaded:", );
        } catch (err) {
            console.error("Failed to initialize UI:", err);
        }
    }
    async initViews(){
        await Promise.all([
            this.initViewComponent(PrefabType.ActivityNewPeople, (node) => this._activityNewPeople = node.getComponent(ActivityNewPeople)),
        ]);
    }
    initTabs(){
        this.initViewComponent(PrefabType.TaskTabView, (node) => {
            this._tabView = node.getComponent(TaskTabView);
            this._tabView.setTabSelectClick(this.onTabSelect.bind(this));
            this._tabView.updateData(ActivityTabInfos);
        }, {
            isAlignTop: true,
            isAlignLeft: true,
            top: 129,
            left: 50
        })
    }

    private onTabSelect(info: TaskTabInfo) {
        this.hideAllContent();
        this.selectMenuType(info);
        this._navTitleView.setTitleName(info.title);
    }
    hideAllContent(){
        this._activityNewPeople.node.active = false;
    }
    selectMenuType(info: TaskTabInfo){
        switch (info.id) {
            case TaskTabIds.NewbieGift:
                this._activityNewPeople.node.active = true;
                break;
            case TaskTabIds.WeekendCarousel:
                // this._monsterCardView.node.active = true;
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
    private async initViewComponent(prefabType: PrefabTypeEntry, onComponentInit: (node: Node) => void, alignOptions?: object) {
        let node = await this.loadAndInitPrefab(prefabType, this.node, alignOptions);
        onComponentInit(node);
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

