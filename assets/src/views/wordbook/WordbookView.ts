import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { LoadManager } from '../../manager/LoadManager';
import { BaseComponent } from '../../script/BaseComponent';
import { NavTitleView } from '../common/NavTitleView';
import { ReviewSourceType } from '../reviewPlan/ReviewWordListView';
import { TaskTabInfo } from '../task/TaskInfo';
import { TaskTabView } from '../task/TaskTabView';
import { ErrorWordbookType, ErrorWordbookView } from './ErrorWordbookView';
import { ReviewWordbookView } from './ReviewWordbookView';
const { ccclass, property } = _decorator;

export enum WordbookType {
    review_word_game = 1,//单词大冒险复习
    review_classification = 2,//教材单词复习
    errorbook = 3,//错题本
    collection = 4,//收藏本
    translate = 5,//翻译查词
}

const tabInfos: TaskTabInfo[] = [
    {
        id: WordbookType.review_word_game as number,
        title: "大冒险-复习本",
        subTabItems: [],
    },
    {
        id: WordbookType.review_classification as number,
        title: "教材-复习本",
        subTabItems: [],
    },
    {
        id: WordbookType.errorbook as number,
        title: "错题本",
        subTabItems: [],
    },
    {
        id: WordbookType.collection as number,
        title: "收藏本",
        subTabItems: [],
    },
    {
        id: WordbookType.translate as number,
        title: "翻译查词",
        subTabItems: [],
    },
]

@ccclass('WordbookView')
export class WordbookView extends BaseComponent {
    @property(NavTitleView)
    public navTitleView: NavTitleView = null;
    @property(TaskTabView)
    public tabView: TaskTabView = null;
    @property(Node)
    public plLeft: Node = null;
    @property(Node)
    public plRight: Node = null;

    private _plRightContentAry: Node[] = [];
    private _tabSelected = 0;
    protected onDestroy(): void {
        this.clearEvent();
    }
    private initEvent() {

    }
    protected async onLoad() {
        await this.init();
    }
    private async init() {
        this.navTitleView.updateNavigationProps("", this.onClose.bind(this));
        this.tabView.setTabSelectClick(this.tabSelect.bind(this));

        await Promise.all([
            LoadManager.loadPrefab(PrefabType.ReviewWordbookView.path, this.plRight).then((node: Node) => {
                this._plRightContentAry[0] = node;
                node.getComponent(ReviewWordbookView).init(ReviewSourceType.word_game);
                node.active = false;
            }),
            LoadManager.loadPrefab(PrefabType.ReviewWordbookView.path, this.plRight).then((node: Node) => {
                this._plRightContentAry[1] = node;
                node.getComponent(ReviewWordbookView).init(ReviewSourceType.classification);
                node.active = false;
            }),
            LoadManager.loadPrefab(PrefabType.ErrorWordbookView.path, this.plRight).then((node: Node) => {
                this._plRightContentAry[2] = node;
                node.getComponent(ErrorWordbookView).init(ErrorWordbookType.Errorbook);
                node.active = false;
            }),
            LoadManager.loadPrefab(PrefabType.ErrorWordbookView.path, this.plRight).then((node: Node) => {
                this._plRightContentAry[3] = node;
                node.getComponent(ErrorWordbookView).init(ErrorWordbookType.Collect);
                node.active = false;
            }),
            LoadManager.loadPrefab(PrefabType.SearchWorldView.path, this.plRight).then((node: Node) => {
                this._plRightContentAry[4] = node;
                // node.getComponent(SearchWordView).init(ErrorWordbookType.Collect);
                node.active = false;
            }),
        ]);

        this.tabView.updateData(tabInfos, this._tabSelected);
    }

    public setTabSelected(type: WordbookType) {
        let typeIndex = tabInfos.findIndex(item => item.id as number === type);
        this._tabSelected = typeIndex;
        // this.tabView.updateData(tabInfos, typeIndex);
    }

    /**关闭回调 */
    private onClose() {
        this.node.destroy();
    }
    private tabSelect(info: TaskTabInfo) {
        console.log("tabSelect:", info);
        this.navTitleView.setTitleName(info.title);
        this._plRightContentAry.forEach(element => {
            element.active = false;
        });
        let selectTab = this._plRightContentAry[info.id - 1];
        if (selectTab) {
            selectTab.active = true;
        }
    }
}


