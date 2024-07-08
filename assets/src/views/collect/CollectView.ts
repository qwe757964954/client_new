import { _decorator, Node } from 'cc';
import { PrefabType, PrefabTypeEntry } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import { ToolUtil } from '../../util/ToolUtil';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { TaskTabIds, TaskTabInfo } from '../task/TaskInfo';
import { TaskTabView } from '../task/TaskTabView';
import { AchievementMedalsView } from './AchievementMedalsView';
import { BuildingAtlasView } from './BuildingAtlasView';
import { ClothingIllustratedView } from './ClothingIllustratedView';
import { CollectTabInfos } from './CollectInfo';
import { MonsterCardView } from './MonsterCardView';

const { ccclass, property } = _decorator;

@ccclass('CollectView')
export class CollectView extends BaseView {
    protected _className = "CollectView";

    @property(Node)
    public top_layout: Node = null;

    @property(Node)
    public content_layout: Node = null;
    private _tabView: TaskTabView = null;
    private _achievementMedalsView:AchievementMedalsView = null;
    private _monsterCardView:MonsterCardView = null;
    private _buildAtlasView:BuildingAtlasView = null;
    private _clothingIllustratedView:ClothingIllustratedView = null;
    async initUI() {
        let scale = ToolUtil.getValue(GlobalConfig.WIN_DESIGN_RATE, 0.1, 1.0);
        CCUtil.setNodeScale(this.node, scale);
        this.initNavTitle();
        this.initAmout();
        try {
            await this.initViews();
            this.initTabs();
            console.log("CollectView configuration loaded:", );
        } catch (err) {
            console.error("Failed to initialize UI:", err);
        }
    }

    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.AchievementMedalsView, (node) => this._achievementMedalsView = node.getComponent(AchievementMedalsView)),
            this.initViewComponent(PrefabType.MonsterCardView, (node) => this._monsterCardView = node.getComponent(MonsterCardView)),
            this.initViewComponent(PrefabType.BuildingAtlasView, (node) => this._buildAtlasView = node.getComponent(BuildingAtlasView)),
            this.initViewComponent(PrefabType.ClothingIllustratedView, (node) => this._clothingIllustratedView = node.getComponent(ClothingIllustratedView)),
        ]);
    }
    initTabs(){
        this.initViewComponent(PrefabType.TaskTabView, (node) => {
            this._tabView = node.getComponent(TaskTabView);
            this._tabView.setTabSelectClick(this.onTabSelect.bind(this));
            this._tabView.updateData(CollectTabInfos);
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
    }
    private hideAllContent(){
        this._achievementMedalsView.node.active = false;
        this._monsterCardView.node.active = false;
        this._buildAtlasView.node.active = false;
        this._clothingIllustratedView.node.active = false;
    }
    private selectMenuType(info: TaskTabInfo) {
        switch (info.id) {
            case TaskTabIds.AchievementMedals:
                this._achievementMedalsView.node.active = true;
                break;
            case TaskTabIds.WordMonsterCards:
                this._monsterCardView.node.active = true;
                // this._weekTask.showTask();
                break;
            case TaskTabIds.BuildingAtlas:
                this._buildAtlasView.node.active = true;
                // this._mainTask.showTask();
                break;
            case TaskTabIds.ClothingAtlas:
                this._clothingIllustratedView.node.active = true;
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

    protected onInitModuleEvent() {
        this.addModelListeners([
            
        ]);
    }

    private initNavTitle() {
        this.createNavigation("成就徽章",this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.CollectView);
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
