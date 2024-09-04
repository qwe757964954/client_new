import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { BaseView } from '../../script/BaseView';
import { TaskTabInfo } from '../task/TaskInfo';
import { TaskTabView } from '../task/TaskTabView';
import { ComicLandView } from './ComicLandView';
import { ComicReadingTabInfos } from './ComicReadingInfo';
const { ccclass, property } = _decorator;

@ccclass('ComicReadingView')
export class ComicReadingView extends BaseView {
    @property(Node)
    public top_layout: Node = null;

    @property(Node)
    public content_layout: Node = null;
    private _tabView: TaskTabView = null;
    private _comicLandView:ComicLandView = null;
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
            this._tabView.updateData(ComicReadingTabInfos);
        }, {
            isAlignTop: true,
            isAlignLeft: true,
            top: 129,
            left: 50
        },this.content_layout)
    }
    private async initViews() {
        const viewComponents = [
            {
                prefabType: PrefabType.ComicLandView,
                initCallback: (node: Node) => {
                    this._comicLandView = node.getComponent(ComicLandView)
                    this._comicLandView.setComicLandViewListener(this.onComicLandViewClick.bind(this));
                },
                alignOptions:{},
                parentNode: this.content_layout
            },
        ]

        await Promise.all(viewComponents.map(config => 
            this.initViewComponent(config.prefabType, config.initCallback, config.alignOptions, config.parentNode)
        ));
    }
    
    private onTabSelect(info: TaskTabInfo) {
        console.log('onTabSelect', info);
        // this.hideAllContent();
        // this.selectMenuType(info);
    }

    private onComicLandViewClick(click: number) {
        console.log('onComicLandViewClick', click);
    }
    private initNavTitle() {
        this.createNavigation("英文漫画阅读",this.top_layout, () => {
            ViewsMgr.closeView(PrefabType.ComicReadingView);
        });
    }
    private async initAmout() {
        await ViewsManager.addAmount(this.top_layout, 6.501, 71.254);
    }
}

