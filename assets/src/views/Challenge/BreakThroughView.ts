import { _decorator, isValid, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { BookLevelConfig, DataMgr } from '../../manager/DataMgr';
import { PopMgr } from '../../manager/PopupManager';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { GameMode, MapLevelData } from '../../models/AdventureModel';
import { CurrentBookStatus, GateListItem, ReqUnitStatusParam, ReqUnitType, UnitItemStatus, UnitListItemStatus, UnitStatusData, VocabularyWordData } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import { rightPanelchange } from '../adventure/common/RightPanelchange';
import { BreakThroughRemindView, ITextbookRemindData } from '../TextbookVocabulary/BreakThroughRemindView';
import { CGConfig } from './ChallengeConfig';
import { GameStudyViewMap } from './ChallengeUtil';
import { ScrollMapView } from './ScrollMapView';

const { ccclass, property } = _decorator;


export interface GotoUnitLevel {
    itemStatus: UnitItemStatus;
    gate: GateListItem;
    isNext: boolean;
}

@ccclass('BreakThroughView')
export class BreakThroughView extends BaseView {
    @property(Node) top_layout: Node = null;
    @property(Node) content_layout: Node = null;
    @property(Node) scrollMapNode: Node = null;
    @property(Node) bg: Node = null;

    private _rightChallenge: rightPanelchange = null;
    private _scrollMap: ScrollMapView = null;
    private _bookData: CurrentBookStatus = null;
    private _curUnitList: UnitListItemStatus = null;
    private _curUnitStatus: UnitStatusData = null;
    private _selectitemStatus: UnitItemStatus = null;
    private _selectGate: GateListItem = null;

    initEvent() {
    }

    removeEvent() {
        // Unregister events if needed
    }

    initUI() {
        CGConfig.getChallengeConfig();
        this.offViewAdaptSize();
        this.initNavTitle();
        this.initAmount();
        DataMgr.instance.getAdventureLevelConfig();
    }

    onInitModuleEvent() {
        this.addModelListener(NetNotify.Classification_UnitListStatus, this.onUnitListStatus.bind(this));
        this.addModelListener(NetNotify.Classification_VocabularyWord, this.onVocabularyWord.bind(this));
        this.addModelListener(NetNotify.Classification_UnitStatus, this.onUnitStatus.bind(this));
        this.addModelListener(NetNotify.Classification_BreakThroughStartAgain, this.onBreakThroughStartAgain.bind(this));
        this.addModelListener(EventType.Enter_Island_Level, this.onEnterIsland.bind(this));
        this.addModelListener(EventType.Exit_Island_Level, this.onExitIsland.bind(this));
        this.addModelListener(EventType.Goto_Textbook_Level, this.gotoTextbookLevel.bind(this));
        this.addModelListener(EventType.Enter_Level_Test, this.gotoLevelTest.bind(this));
        this.addModelListener(EventType.Goto_Break_Through_Textbook_Next_Level, this.gotoNextLevelTest.bind(this));
    }
    initData(data: CurrentBookStatus, unitData: UnitListItemStatus) {
        this._bookData = data;
        this._curUnitList = unitData;
        this.initScrollMap();
        this._scrollMap.initUnit(unitData);
    }

    gotoTextbookLevel(data: GotoUnitLevel) {
        this._selectitemStatus = data.itemStatus;
        this._selectGate = data.gate;
        this.showRightChallengeView();
    }

    getUnitListStatus() {
        TBServer.reqUnitListStatus(this._bookData.book_id);
    }

    gotoNextLevelTest(data: GotoUnitLevel) {
        this._selectitemStatus = data.itemStatus;
        this._selectGate = data.gate;
        this._rightChallenge.hideView();
        const reqParam: ReqUnitStatusParam = {
            book_id: this._bookData.book_id,
            unit_id: this._selectitemStatus.unit_id,
            small_id: this._selectGate.small_id
        };
        TBServer.reqUnitStatus(reqParam);
    }

    gotoLevelTest() {
        const reqParam: ReqUnitStatusParam = {
            book_id: this._bookData.book_id,
            unit_id: this._selectitemStatus.unit_id,
            small_id: this._selectGate.small_id,
            category: ReqUnitType.Test
        };
        TBServer.reqUnitStatus(reqParam);
    }

    reqVocabularyWord() {
        const reqParam: ReqUnitStatusParam = {
            book_id: this._bookData.book_id,
            unit_id: this._selectitemStatus.unit_id,
            small_id: this._selectGate.small_id
        };
        TBServer.reqVocabularyWord(reqParam);
    }

    async onVocabularyWord(response: VocabularyWordData) {
        const gameModel: GameMode = this._curUnitStatus.game_mode as GameMode;
        const bookLevelData: BookLevelConfig = {
            book_id: this._bookData.book_id,
            unit: this._selectitemStatus.unit_name,
            unit_id: this._selectitemStatus.unit_id,
            cur_game_mode: gameModel,
            game_mode: GameMode.Study,
            small_id: this._selectGate.small_id,
            word_num: this._curUnitStatus.word_num,
            error_num: this._curUnitStatus.error_num,
            time_remaining: this._curUnitStatus.time_remaining,
            monster_id: this._bookData.monster_id
        };

        if (isValid(this._curUnitStatus.error_word)) {
            bookLevelData.error_word = this._curUnitStatus.error_word;
        }
        
        await this.openLearningView(response, bookLevelData, gameModel);
        this._scrollMap.removePointEvent();
    }

    async openLearningView(wordData: VocabularyWordData, bookLevelData: BookLevelConfig, gameModel: GameMode) {

        const prefabType = GameStudyViewMap[gameModel];
        if (prefabType) {
            const node = await ViewsMgr.showLearnView(prefabType);
            let scpt: any = node.getComponent(prefabType.componentName); 
            scpt.initData(wordData.data, bookLevelData);
        }
    }

    onExitIsland() {
        this._rightChallenge.hideView();
        this.getUnitListStatus();
    }

    onEnterIsland(data: MapLevelData) {
        const param: ITextbookRemindData = {
            sure_text: TextConfig.Restart_Tip,
            cancel_text: TextConfig.Continue_From_Last_Time_Tip,
            content_text: TextConfig.Begin_Break_Through_Tip,
            callFunc: (isSure: boolean) => {
                const reqParam: ReqUnitStatusParam = {
                    book_id: this._bookData.book_id,
                    unit_id: this._selectitemStatus.unit_id,
                    small_id: this._selectGate.small_id
                };
                if (isSure) {
                    TBServer.reqBreakThroughStartAgain(reqParam);
                } else {
                    TBServer.reqUnitStatus(reqParam);
                }
            }
        };
        this.showRemainCall(param);
    }

    showRemainCall(data: ITextbookRemindData) {
        PopMgr.showPopup(PrefabType.BreakThroughRemindView).then((node: Node) => {
            const remindScript = node.getComponent(BreakThroughRemindView);
            remindScript.initRemind(data);
        });
    }

    async showRightChallengeView() {
        const param: MapLevelData = {
            small_id: this._selectGate.small_id,
            big_id: this._selectitemStatus.unit_name,
            micro_id: this._selectGate.small_id,
            game_modes: "word",
            monster_id: this._bookData.monster_id,
            flag_info: this._selectGate.flag_info
        };
        let node = await PopMgr.showPopRight(PrefabType.RightPanelchange,"stage_frame");
        this._rightChallenge = node.getComponent(rightPanelchange);
        this._rightChallenge.openView(param);
    }

    onUnitStatus(data: UnitStatusData) {
        console.log("onUnitStatus", data);
        this._curUnitStatus = data;
        this.reqVocabularyWord();
    }

    onBreakThroughStartAgain() {
        console.log("onBreakThroughStartAgain");
        const reqParam: ReqUnitStatusParam = {
            book_id: this._bookData.book_id,
            unit_id: this._selectitemStatus.unit_id,
            small_id: this._selectGate.small_id
        };
        TBServer.reqUnitStatus(reqParam);
    }

    onUnitListStatus(data: UnitListItemStatus) {
        this._curUnitList = data;
        this._scrollMap.initUnit(data);
    }

    async initNavTitle() {
        this.createNavigation(`${this._bookData.book_name} ${this._bookData.grade}`, this.top_layout, async () => {
            const node = await ViewsMgr.showLearnView(PrefabType.TextbookChallengeView);
            ViewsMgr.closeView(PrefabType.BreakThroughView);
        });
    }

    async initAmount() {
        await ViewsManager.addAmount(this.top_layout, 5.471, 42.399);
    }

    initScrollMap() {
        this._scrollMap = this.scrollMapNode.getComponent(ScrollMapView);
    }
}
