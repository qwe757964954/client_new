import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { BaseView } from '../../script/BaseView';
import { RankTabInfos } from '../rank/RankInfo';
import { TaskTabInfo } from '../task/TaskInfo';
import { TaskTabView } from '../task/TaskTabView';
const { ccclass, property } = _decorator;

@ccclass('ComicReadingView')
export class ComicReadingView extends BaseView {
    @property(Node)
    public top_layout: Node = null;

    @property(Node)
    public content_layout: Node = null;
    private _tabView: TaskTabView = null;
    protected async initUI() {
        this.initNavTitle();
        this.initAmout();
        try {
            await this.initViews();
            this.initTabs();
            console.log("Shop configuration loaded:", );
        } catch (err) {
            console.error("Failed to initialize UI:", err);
        }
    }
    initTabs(){
        this.initViewComponent(PrefabType.TaskTabView, (node) => {
            this._tabView = node.getComponent(TaskTabView);
            this._tabView.setTabSelectClick(this.onTabSelect.bind(this));
            this._tabView.updateData(RankTabInfos);
        }, {
            isAlignTop: true,
            isAlignLeft: true,
            top: 129,
            left: 50
        },this.content_layout)
    }
    private async initViews() {
        const viewComponents = [
            // {
            //     prefabType: PrefabType.FriendLeftTabView,
            //     initCallback: (node: Node) => this._leftTab = node.getComponent(FriendLeftTabView),
            //     alignOptions: { isAlignTop: true,isAlignHorizontalCenter:true, top: 116.002,horizontalCenter:0},
            //     parentNode: this.contentNd
            // },
            // {
            //     prefabType: PrefabType.FriendList,
            //     initCallback: (node: Node) => {
            //         this._friendList = node.getComponent(FriendList);
            //         this._friendList.setFriendSelectListener(this.onFriendClick.bind(this));
            //     },
            //     parentNode: this.contentNd
            // },
            // {
            //     prefabType: PrefabType.ApplyList,
            //     initCallback: (node: Node) => this._applyList = node.getComponent(ApplyList),
            //     parentNode: this.contentNd
            // },
            // {
            //     prefabType: PrefabType.Blacklist,
            //     initCallback: (node: Node) => this._blacklist = node.getComponent(Blacklist),
            //     parentNode: this.contentNd
            // },
        ]

        await Promise.all(viewComponents.map(config => 
            this.initViewComponent(config.prefabType, config.initCallback, config.alignOptions, config.parentNode)
        ));
    }
    
    private onTabSelect(info: TaskTabInfo) {
        // this.hideAllContent();
        // this.selectMenuType(info);
    }

    private initNavTitle() {
        this.createNavigation("排行",this.top_layout, () => {
            ViewsMgr.closeView(PrefabType.ComicReadingView);
        });
    }
    private async initAmout() {
        await ViewsManager.addAmount(this.top_layout, 6.501, 71.254);
    }
}

