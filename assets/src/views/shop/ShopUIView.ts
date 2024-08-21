import { _decorator, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { BaseView } from '../../script/BaseView';
import { BagConfig } from '../bag/BagConfig';
import { TabItemDataInfo, TabTypeIds, TaskTabIds, TaskTabInfo } from '../task/TaskInfo';
import { TaskTabView } from '../task/TaskTabView';
import { DebrisAreaView } from './DebrisAreaView';
import { ShopBuildView } from './ShopBuildView';
import { ShopDecorationView } from './ShopDecorationView';
import { ShopTabInfos } from './ShopInfo';
import { ShopStoreView } from './ShopStoreView';
const { ccclass, property } = _decorator;


@ccclass('ShopUIView')
export class ShopUIView extends BaseView {
    @property(Node)
    public bg: Node = null;
    @property(Node)
    public top_layout: Node = null;          // 商城
    @property(Node)
    public content_layout: Node = null; //

    private _tabView: TaskTabView = null;
    private _shopBuildView: ShopBuildView = null;
    private _shopStoreView: ShopStoreView = null;
    private _shopDecorationView: ShopDecorationView = null;
    private _debrisAreaView: DebrisAreaView = null;

    private _currentSubId:TabTypeIds = TabTypeIds.BuildAll;
    private _currentTabId:TaskTabIds = TaskTabIds.ImageStore;
    async initUI() {
        await BagConfig.loadBagConfigInfo();
        this.initAmout();
        this.initNavTitle();
        try {
            await this.initViews();
            this.initTabs();
            console.log("Shop configuration loaded:", );
        } catch (err) {
            console.error("Failed to initialize UI:", err);
        }
    }

    protected onInitModuleEvent() {
        this.addModelListener(EventType.Sub_Tab_Item_Click,this.subTabItemClick);
        this.addModelListener(EventType.EditUIView_Refresh, this.onRepShopBuyBuilding.bind(this));

	}
    
    onRepShopBuyBuilding() {
        this._shopBuildView.updateData(this._currentSubId);
    }
    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.ShopBuildView, (node) => this._shopBuildView = node.getComponent(ShopBuildView),null,this.content_layout),
            this.initViewComponent(PrefabType.ShopStoreView, (node) => this._shopStoreView = node.getComponent(ShopStoreView),null,this.content_layout),
            this.initViewComponent(PrefabType.ShopDecorationView, (node) => this._shopDecorationView = node.getComponent(ShopDecorationView),null,this.content_layout),
            this.initViewComponent(PrefabType.DebrisAreaView, (node) => this._debrisAreaView = node.getComponent(DebrisAreaView),null,this.content_layout),
        ]);
    }
    initTabs(){
        this.initViewComponent(PrefabType.TaskTabView, (node) => {
            this._tabView = node.getComponent(TaskTabView);
            this._tabView.setTabSelectClick(this.onTabSelect.bind(this));
            this._tabView.updateData(ShopTabInfos);
        }, {
            isAlignTop: true,
            isAlignLeft: true,
            top: 129,
            left: 50
        },this.content_layout)
    }

    subTabItemClick(data:TabItemDataInfo){
        this._currentSubId = data.id;
        if(this._currentTabId === TaskTabIds.BuildingShop){
            this._shopBuildView.updateData(this._currentSubId);
        }else if(this._currentTabId === TaskTabIds.ImageStore){
            this._shopStoreView.updateData(this._currentSubId);
        }
        
    }
    private onTabSelect(info: TaskTabInfo) {
        this.hideAllContent();
        this.selectMenuType(info);
    }
    private hideAllContent(){
        this._shopBuildView.node.active = false;
        this._shopStoreView.node.active = false;
        this._shopDecorationView.node.active = false;
        this._debrisAreaView.node.active = false;
    }
    private selectMenuType(info: TaskTabInfo) {
        this._navTitleView.setTitleName(info.title);
        this._currentTabId = info.id;
        switch (info.id) {
            case TaskTabIds.ImageStore:
                this._shopStoreView.node.active = true;
                break;
            case TaskTabIds.DebrisArea:
                this._debrisAreaView.node.active = true;
                // this._weekTask.showTask();
                break;
            case TaskTabIds.BuildingShop:
                this._shopBuildView.node.active = true;
                break;
            case TaskTabIds.Decoration:
                this._shopDecorationView.node.active = true;
                // this._dailyTask.showTask();
                break;
            default:
                break;
        }
                
    }
    /**初始化导航栏 */
    initNavTitle() {
        this.createNavigation("商城",this.top_layout, () => {
            // GlobalConfig.initRessolutionHeight();
            ViewsMgr.closeView(PrefabType.ShopUIView);
        });
    }
    /**初始化游戏数值 */
    initAmout() {
        ViewsManager.addAmount(this.top_layout, 5.471, 42.399);
    }

    onCloseView() {
        ViewsMgr.closeView(PrefabType.ShopUIView);
    }
}


