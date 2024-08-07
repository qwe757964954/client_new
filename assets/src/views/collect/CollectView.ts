import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { BaseView } from '../../script/BaseView';
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
            this.initViewComponent(PrefabType.AchievementMedalsView, (node) => {
                this._achievementMedalsView = node.getComponent(AchievementMedalsView);
                node.active = false;
            },null,this.content_layout),
            this.initViewComponent(PrefabType.MonsterCardView, (node) => {
                this._monsterCardView = node.getComponent(MonsterCardView);
                node.active = false;
            },null,this.content_layout),
            this.initViewComponent(PrefabType.BuildingAtlasView, (node) => {
                this._buildAtlasView = node.getComponent(BuildingAtlasView);
                node.active = false;
            },null,this.content_layout),
            this.initViewComponent(PrefabType.ClothingIllustratedView, (node) => {
                this._clothingIllustratedView = node.getComponent(ClothingIllustratedView);
                node.active = false;
            },null,this.content_layout),
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
        },this.content_layout)
    }
    private onTabSelect(info: TaskTabInfo) {
        this.hideAllContent();
        this.selectMenuType(info);
        this._navTitleView.setTitleName(info.title);
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

    protected onInitModuleEvent() {
        this.addModelListeners([
            
        ]);
    }

    private initNavTitle() {
        this.createNavigation("成就徽章",this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.CollectView);
        });
    }

    private async initAmout() {
        await ViewsManager.addAmout(this.top_layout, 6.501, 71.254);
    }
}
