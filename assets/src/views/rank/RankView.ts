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
import { CombatPowerRankingView } from './CombatPowerRankingView';
import { KingdomRankingView } from './KingdomRankingView';
import { RankTabInfos } from './RankInfo';
import { VocabularyRankingView } from './VocabularyRankingView';
const { ccclass, property } = _decorator;

@ccclass('RankView')
export class RankView extends BaseView {
    @property(Node)
    public top_layout: Node = null;

    @property(Node)
    public content_layout: Node = null;
    
    private _vocabularyRankingView:VocabularyRankingView = null;
    private _kingdomRankingView:KingdomRankingView = null;
    private _combatPowerRankingView:CombatPowerRankingView = null;
    private _tabView: TaskTabView = null;
    protected async initUI() {
        let scale = ToolUtil.getValue(GlobalConfig.WIN_DESIGN_RATE, 0.1, 1.0);
        CCUtil.setNodeScale(this.node, scale);
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

    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.VocabularyRankingView, (node) => this._vocabularyRankingView = node.getComponent(VocabularyRankingView)),
            this.initViewComponent(PrefabType.KingdomRankingView, (node) => this._kingdomRankingView = node.getComponent(KingdomRankingView)),
            this.initViewComponent(PrefabType.CombatPowerRankingView, (node) => this._combatPowerRankingView = node.getComponent(CombatPowerRankingView)),
        ]);
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
        })
    }
    private async initViewComponent(prefabType: PrefabTypeEntry, onComponentInit: (node: Node) => void, alignOptions?: object) {
        let node = await this.loadAndInitPrefab(prefabType, this.node, alignOptions);
        onComponentInit(node);
    }
    private initNavTitle() {
        this.createNavigation("排行",this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.RankView);
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
    private onTabSelect(info: TaskTabInfo) {
        this.hideAllContent();
        this.selectMenuType(info);
    }
    private hideAllContent(){
        this._vocabularyRankingView.node.active = false;
        this._kingdomRankingView.node.active = false;
        this._combatPowerRankingView.node.active = false;
    }
    private selectMenuType(info: TaskTabInfo) {
        switch (info.id) {
            case TaskTabIds.VocabularyRanking:
                this._vocabularyRankingView.node.active = true;
                break;
            case TaskTabIds.KingdomRanking:
                this._kingdomRankingView.node.active = true;
                // this._weekTask.showTask();
                break;
            case TaskTabIds.CombatPowerRanking:
                this._combatPowerRankingView.node.active = true;
                break;
            default:
                break;
        }
                
    }
}

