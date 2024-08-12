import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { LoadManager } from '../../manager/LoadManager';
import { BaseComponent } from '../../script/BaseComponent';
import { NavTitleView } from '../common/NavTitleView';
import { TaskTabInfo } from '../task/TaskInfo';
import { TaskTabView } from '../task/TaskTabView';
import { ErrorWordbookType, ErrorWordbookView } from './ErrorWordbookView';
const { ccclass, property } = _decorator;

export enum WordbookType {
    review_classification = 1,//教材单词复习
    review_word_game = 2,//单词大冒险复习
    errorbook = 3,//错题本
    collection = 4,//收藏本
    translate = 5,//翻译查词
}

const tabInfos: TaskTabInfo[] = [
    {
        id: WordbookType.review_classification as number,
        title: "教材-复习本",
        subTabItems: [],
    },
    {
        id: WordbookType.review_word_game as number,
        title: "大冒险-复习本",
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
    private _lastSelectTab: Node = null;

    protected onDestroy(): void {
        this.clearEvent();
    }
    private initEevent() {

    }
    protected onLoad(): void {
        this.init();
    }
    private async init() {
        this.navTitleView.updateNavigationProps("", this.onClose.bind(this));
        this.tabView.setTabSelectClick(this.tabSelect.bind(this));

        await Promise.all([
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

        this.tabView.updateData(tabInfos, 2);
    }
    /**关闭回调 */
    private onClose() {
        this.node.destroy();
    }
    private tabSelect(info: TaskTabInfo) {
        console.log("tabSelect:", info);
        this.navTitleView.setTitleName(info.title);
        let selectTab = this._plRightContentAry[info.id - 1];
        if (this._lastSelectTab) {
            this._lastSelectTab.active = false;
        }
        if (selectTab) {
            selectTab.active = true;
        }
        this._lastSelectTab = selectTab;
    }
}


