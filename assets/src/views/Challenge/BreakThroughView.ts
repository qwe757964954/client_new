import { _decorator, isValid, Layers, Node, UITransform } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { BookLevelConfig, DataMgr } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { MapLevelData } from '../../models/AdventureModel';
import { CurrentBookStatus, GateListItem, ReqUnitStatusParam, ReqUnitType, UnitItemStatus, UnitListItemStatus, UnitStatusData, VocabularyWordData } from '../../models/TextbookModel';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import CCUtil from '../../util/CCUtil';
import { NodeUtil } from '../../util/NodeUtil';
import { rightPanelchange } from '../adventure/common/RightPanelchange';
import { StudyModeView } from '../adventure/sixModes/StudyModeView';
import { WordExamView } from '../adventure/sixModes/WordExamView';
import { WordMeaningView } from '../adventure/sixModes/WordMeaningView';
import { WordPracticeView } from '../adventure/sixModes/WordPracticeView';
import { WordReadingView } from '../adventure/sixModes/WordReadingView';
import { WordSpellView } from '../adventure/sixModes/WordSpellView';
import { AmoutItemData, AmoutType } from '../common/TopAmoutView';
import { ScrollMapView } from './ScrollMapView';

const { ccclass, property } = _decorator;

// 学习模式
export enum LearnGameModel {
    Tutoring = 0,
    Spell = 1,
    AllSpelledOut = 2,
    Practice = 3,
    Reed = 4,
    WordMeaning = 7,
}

export interface GotoUnitLevel {
    itemStatus: UnitItemStatus,
    gate: GateListItem,
    isNext: boolean
}

@ccclass('BreakThroughView')
export class BreakThroughView extends BaseView {
    @property(Node)
    public top_layout: Node = null;
    @property(Node)
    public content_layout: Node = null;
    @property(Node)
    public scrollMapNode: Node = null;
    @property(Node)
    public bg: Node = null;
    @property(Node)
    public mask_node: Node = null;

    private _rightChallenge: rightPanelchange = null;
    private _scrollMap: ScrollMapView = null;
    private _bookData: CurrentBookStatus = null;
    private _curUnitList: UnitListItemStatus = null;
    private _curUnitStatus: UnitStatusData = null;
    private _selectitemStatus: UnitItemStatus = null;
    private _selectGate: GateListItem = null;

    start() {
        super.start();
        GlobalConfig.initRessolutionHeight();
    }

    initEvent() {
        CCUtil.onBtnClick(this.mask_node, this.hideRightPanelchangeView.bind(this));
    }

    removeEvent() {
        // Unregister events here if needed
    }

    initUI() {
        this.initNavTitle();
        this.initAmout();
        this.initRightChange();
        DataMgr.instance.getAdventureLevelConfig();
    }

    initData(data: CurrentBookStatus, unitData: UnitListItemStatus) {
        this._bookData = data;
        this._curUnitList = unitData;
        this.initScrollMap();
        this._scrollMap.initUnit(unitData);
    }

    onInitModuleEvent() {
        this.addModelListener(NetNotify.Classification_UnitListStatus, this.onUnitListStatus.bind(this));
        this.addModelListener(NetNotify.Classification_VocabularyWord, this.onVocabularyWord.bind(this));
        this.addModelListener(NetNotify.Classification_UnitStatus, this.onUnitStatus.bind(this));
        this.addModelListener(EventType.Enter_Island_Level, this.onEnterIsland.bind(this));
        this.addModelListener(EventType.Exit_Island_Level, this.onExitIsland.bind(this));
        this.addModelListener(EventType.Goto_Textbook_Level, this.gotoTextbookLevel.bind(this));
        this.addModelListener(EventType.Enter_Level_Test, this.gotoLevelTest.bind(this));
        this.addModelListener(EventType.Goto_Break_Through_Textbook_Next_Level, this.gotoNextLevelTest.bind(this));
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
        this.hideRightPanelchangeView();
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
        const gameModel: LearnGameModel = this._curUnitStatus.game_mode as LearnGameModel;
        const bookLevelData: BookLevelConfig = {
            book_id: this._bookData.book_id,
            unit: this._selectitemStatus.unit_name,
            unit_id: this._selectitemStatus.unit_id,
            cur_game_mode: gameModel,
            game_mode: LearnGameModel.Tutoring,
            small_id: this._selectGate.small_id,
            word_num: this._curUnitStatus.word_num,
            error_count: this._curUnitStatus.error_count,
            time_remaining: this._curUnitStatus.time_remaining,
        };

        if (isValid(this._curUnitStatus.error_word)) {
            bookLevelData.error_word = this._curUnitStatus.error_word;
        }

        switch (gameModel) {
            case LearnGameModel.Tutoring:
                bookLevelData.game_mode = LearnGameModel.Tutoring;
                await this.gotoTutoring(response, bookLevelData);
                break;
            case LearnGameModel.AllSpelledOut:
                bookLevelData.game_mode = LearnGameModel.AllSpelledOut;
                await this.gotoAllSpelledOut(response, bookLevelData);
                break;
            case LearnGameModel.WordMeaning:
                bookLevelData.game_mode = LearnGameModel.WordMeaning;
                await this.gotoMeaning(response, bookLevelData);
                break;
            case LearnGameModel.Practice:
                bookLevelData.game_mode = LearnGameModel.Practice;
                await this.gotoPractice(response, bookLevelData);
                break;
            case LearnGameModel.Reed:
                bookLevelData.game_mode = LearnGameModel.Reed;
                await this.gotoReed(response, bookLevelData);
                break;
            case LearnGameModel.Spell:
                bookLevelData.game_mode = LearnGameModel.Spell;
                await this.gotoSpell(response, bookLevelData);
                break;
            default:
                break;
        }
        this._scrollMap.removePointEvent();
    }

    onExitIsland() {
        this.hideRightPanelchangeView();
        this.getUnitListStatus();
    }

    onEnterIsland(data: MapLevelData) {
        const reqParam: ReqUnitStatusParam = {
            book_id: this._bookData.book_id,
            unit_id: this._selectitemStatus.unit_id,
            small_id: this._selectGate.small_id
        };
        TBServer.reqUnitStatus(reqParam);
    }

    async gotoSpell(wordData: VocabularyWordData, bookLevelData: BookLevelConfig) {
        const node = await ViewsManager.instance.showViewAsync(PrefabType.WordSpellView);
        node.getComponent(WordSpellView).initData(wordData.data, bookLevelData);
    }

    async gotoReed(wordData: VocabularyWordData, bookLevelData: BookLevelConfig) {
        const node = await ViewsManager.instance.showViewAsync(PrefabType.WordReadingView);
        node.getComponent(WordReadingView).initData(wordData.data, bookLevelData);
    }

    async gotoPractice(wordData: VocabularyWordData, bookLevelData: BookLevelConfig) {
        const node = await ViewsManager.instance.showViewAsync(PrefabType.WordPracticeView);
        node.getComponent(WordPracticeView).initData(wordData.data, bookLevelData);
    }

    async gotoMeaning(wordData: VocabularyWordData, bookLevelData: BookLevelConfig) {
        const node = await ViewsManager.instance.showViewAsync(PrefabType.WordMeaningView);
        node.getComponent(WordMeaningView).initData(wordData.data, bookLevelData);
    }

    async gotoAllSpelledOut(wordData: VocabularyWordData, bookLevelData: BookLevelConfig) {
        const node = await ViewsManager.instance.showViewAsync(PrefabType.WordExamView);
        node.getComponent(WordExamView).initData(wordData.data, bookLevelData);
    }

    async gotoTutoring(wordData: VocabularyWordData, bookLevelData: BookLevelConfig) {
        const node = await ViewsManager.instance.showViewAsync(PrefabType.StudyModeView);
        node.getComponent(StudyModeView).initData(wordData.data, bookLevelData);
    }

    showRightChallengeView() {
        const contentSize = this.content_layout.getComponent(UITransform);
        const nodeSize = this._rightChallenge.node.getComponent(UITransform);
        const posX = contentSize.width / 2 + nodeSize.width / 2;
        this._rightChallenge.node.setPosition(posX, 0, 0);
        this._rightChallenge.node.active = true;
        const param: MapLevelData = {
            small_id: this._selectGate.small_id,
            big_id: this._selectitemStatus.unit_name,
            micro_id: this._selectGate.small_id,
            game_modes: "word",
            flag_info: this._selectGate.flag_info
        };
        this._rightChallenge.openView(param);
        this.mask_node.active = true;
    }

    onUnitStatus(data: UnitStatusData) {
        this._curUnitStatus = data;
        this.reqVocabularyWord();
    }

    onUnitListStatus(data: UnitListItemStatus) {
        this._curUnitList = data;
        this._scrollMap.initUnit(data);
    }

    async initNavTitle() {
        this.createNavigation(`${this._bookData.book_name} ${this._bookData.grade}`,this.top_layout, () => {
            ViewsManager.instance.showView(PrefabType.TextbookChallengeView, () => {
                ViewsManager.instance.closeView(PrefabType.BreakThroughView);
            });
        });
    }

    async initAmout() {
        const amoutScript = await ViewsManager.addAmout(this.top_layout, 5.471, 42.399);
        const dataArr: AmoutItemData[] = [
            { type: AmoutType.Diamond, num: User.diamond },
            { type: AmoutType.Coin, num: User.coin },
            { type: AmoutType.Energy, num: User.stamina }
        ];
        amoutScript.loadAmoutData(dataArr);
    }

    async initRightChange() {
        const node = await this.loadAndInitPrefab(PrefabType.RightPanelchange, this.content_layout);
        NodeUtil.setLayerRecursively(node, Layers.Enum.UI_2D);
        const contentSize = this.content_layout.getComponent(UITransform);
        const nodeSize = node.getComponent(UITransform);
        const posX = contentSize.width / 2 + nodeSize.width / 2;
        node.setPosition(posX, 0, 0);
        this._rightChallenge = node.getComponent(rightPanelchange);
    }

    initScrollMap() {
        this._scrollMap = this.scrollMapNode.getComponent(ScrollMapView);
    }

    hideRightPanelchangeView() {
        this.mask_node.active = false;
        this._rightChallenge.hideView();
    }
}
