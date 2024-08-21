import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { WordRankResponse } from '../../models/RankModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { RKServer } from '../../service/RankService';
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
        
        this.initNavTitle();
        this.initAmout();
        try {
            await this.initViews();
            this.initTabs();
            console.log("Shop configuration loaded:", );
        } catch (err) {
            console.error("Failed to initialize UI:", err);
        }
        RKServer.reqUserVocabularyRank();
    }
    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [NetNotify.Classification_UserVocabularyRank, this.onUserVocabularyRank],
        ]);
    }

    onUserVocabularyRank(data:WordRankResponse){
        console.log("onUserVocabularyRank data = ", data,this._vocabularyRankingView);
        this._vocabularyRankingView.updateData(data);
    }

    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.VocabularyRankingView, (node) => this._vocabularyRankingView = node.getComponent(VocabularyRankingView),null,this.content_layout),
            this.initViewComponent(PrefabType.KingdomRankingView, (node) => this._kingdomRankingView = node.getComponent(KingdomRankingView),null,this.content_layout),
            this.initViewComponent(PrefabType.CombatPowerRankingView, (node) => this._combatPowerRankingView = node.getComponent(CombatPowerRankingView),null,this.content_layout),
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
        },this.content_layout)
    }
    private initNavTitle() {
        this.createNavigation("排行",this.top_layout, () => {
            ViewsMgr.closeView(PrefabType.RankView);
        });
    }

    private async initAmout() {
        await ViewsManager.addAmount(this.top_layout, 6.501, 71.254);
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
        this._navTitleView.setTitleName(info.title);
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

