import { _decorator, error, instantiate, Layers, Node, Prefab, UITransform } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { BookLevelConfig, DataMgr } from '../../manager/DataMgr';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { MapLevelData } from '../../models/AdventureModel';
import { CurrentBookStatus, GateListItem, ReqUnitStatusParam, UnitItemStatus, UnitListItemStatus, UnitStatusData, VocabularyWordData } from '../../models/TextbookModel';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import CCUtil from '../../util/CCUtil';
import { NodeUtil } from '../../util/NodeUtil';
import { LevelConfig, rightPanelchange } from '../adventure/common/RightPanelchange';
import { StudyModeView } from '../adventure/sixModes/StudyModeView';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { ScrollMapView } from './ScrollMapView';
import { BookUnitModel } from './TextbookChallengeView';
const { ccclass, property } = _decorator;

// export enum ChangeHeadTypeEnum {
//     Type_HeadBox= 1,
//     Type_Head= 2,
// }

//学习模式(0导学 3词意 7全拼）
export enum LearnGameModel {
    Tutoring=0,
    Translate = 1,
    Practice = 2,
    WordMeaning=3,
    Reed = 4,
    AllSpelledOut=7,
}

@ccclass('BreakThroughView')
export class BreakThroughView extends BaseView {
    @property(Node)
    public top_layout: Node = null;
    @property(Node)
    public content_layout: Node = null;

    private _rightChallenge:rightPanelchange = null;

    @property(Node)
    public scrollMapNode: Node = null;

    public _scrollMap:ScrollMapView = null;

    private _bookData:CurrentBookStatus = null;

    private _curUnitList:UnitListItemStatus = null;

    private _curUnitStatus:UnitStatusData = null;

    private _selectitemStatus:UnitItemStatus = null;
    private _selectGate:GateListItem = null;

    start() {
        GlobalConfig.initRessolutionHeight();
        this.initEvent();
        this.initUI();
    }
    initEvent() {
        CCUtil.onTouch(this.scrollMapNode, this.hideRightPanelchangeView, this);
    }
    removeEvent() {
        CCUtil.offTouch(this.scrollMapNode, this.hideRightPanelchangeView, this);
    }
    initUI(){
        this.initScrollMap();
        this.initNavTitle();
        this.initAmout();
        this.initRightChange();
        this.getUnitListStatus();
        DataMgr.instance.getAdventureLevelConfig();
    }

    initData(data:CurrentBookStatus){
        this._bookData = data;
        
    }
    onInitModuleEvent(){
        this.addModelListener(NetNotify.Classification_UnitListStatus,this.onUnitListStatus);
        this.addModelListener(NetNotify.Classification_VocabularyWord,this.onVocabularyWord);
        this.addModelListener(NetNotify.Classification_UnitStatus,this.onUnitStatus);
        this.addModelListener(EventType.Enter_Island_Level,this.onEnterIsland);
    }
    getUnitListStatus(){
        let params:BookUnitModel = {
            type_name:this._bookData.type_name,
            book_name:this._bookData.book_name,
            grade:this._bookData.grade
        }
        TBServer.reqUnitListStatus(params);
    }

    reqVocabularyWord(){
        let reqParam:ReqUnitStatusParam = {
            type_name:this._bookData.type_name,
            book_name:this._bookData.book_name,
            grade:this._bookData.grade,
            unit:this._selectitemStatus.unit,
            small_id:this._selectGate.small_id
        }
        TBServer.reqVocabularyWord(reqParam);
    }

    onVocabularyWord(data:VocabularyWordData){
        console.log("onVocabularyWord", data);
        let game_model:LearnGameModel = this._curUnitStatus.game_mode as LearnGameModel;
        let bookLevelData:BookLevelConfig = {
            id:this._bookData.id,
            grade:this._bookData.grade,
            unit:this._selectitemStatus.unit,
            type_name:this._bookData.type_name,
            game_mode:LearnGameModel.Tutoring,
            book_name:this._bookData.book_name,
            small_id:this._selectGate.small_id,
            word_num:this._curUnitStatus.word_num,
        }
        switch (game_model) {
            case LearnGameModel.Tutoring:
                bookLevelData.game_mode = LearnGameModel.Tutoring;
                this.gotoTutoring(data,bookLevelData);
                break;
            case LearnGameModel.AllSpelledOut:
                bookLevelData.game_mode = LearnGameModel.AllSpelledOut;
                this.gotoAllSpelledOut(data,bookLevelData);
                break;
            case LearnGameModel.WordMeaning:
                bookLevelData.game_mode = LearnGameModel.WordMeaning;
                this.gotoMeaning(data,bookLevelData);
                break;
            case LearnGameModel.Practice:
                bookLevelData.game_mode = LearnGameModel.Practice;
                this.gotoPractice(data,bookLevelData);
                break;
            case LearnGameModel.Reed:
                bookLevelData.game_mode = LearnGameModel.Reed;
                this.gotoReed(data,bookLevelData);
                break;
            default:
                break;
        }
    }

    onEnterIsland(data:LevelConfig){
        console.log("onEnterIsland", data);
        this.reqVocabularyWord();
    }
    /**进入读模式 */
    gotoReed(wordData:VocabularyWordData,bookLevelData:BookLevelConfig){
        ViewsManager.instance.showView(PrefabType.WordReadingView, (node: Node) => {
            node.getComponent(StudyModeView).initData(wordData.data, bookLevelData);
        });
    }
    /**进入练模式 */
    gotoPractice(wordData:VocabularyWordData,bookLevelData:BookLevelConfig){
        ViewsManager.instance.showView(PrefabType.WordPracticeView, (node: Node) => {
            node.getComponent(StudyModeView).initData(wordData.data, bookLevelData);
        });
    }
    /**进入译模式 */
    gotoMeaning(wordData:VocabularyWordData,bookLevelData:BookLevelConfig){
        ViewsManager.instance.showView(PrefabType.WordMeaningView, (node: Node) => {
            node.getComponent(StudyModeView).initData(wordData.data, bookLevelData);
        });
    }
    /**进入全拼 */
    gotoAllSpelledOut(wordData:VocabularyWordData,bookLevelData:BookLevelConfig){
        ViewsManager.instance.showView(PrefabType.WordSpellView, (node: Node) => {
            node.getComponent(StudyModeView).initData(wordData.data, bookLevelData);
        });
    }

    /**进入学 */
    gotoTutoring(wordData:VocabularyWordData,bookLevelData:BookLevelConfig){
        ViewsManager.instance.showView(PrefabType.StudyModeView, (node: Node) => {
            node.getComponent(StudyModeView).initData(wordData.data, bookLevelData);
        });
    }

    showRightChallengeView(){
        let content_size = this.content_layout.getComponent(UITransform);
        let node_size = this._rightChallenge.node.getComponent(UITransform);
        let posx = content_size.width / 2 + node_size.width / 2;
        this._rightChallenge.node.setPosition(posx,0,0);
        this._rightChallenge.node.active = true;
        const removedString = this._curUnitStatus.unit.replace("Unit ", "").trim();
        let param:MapLevelData = {small_id:this._curUnitStatus.small_id,
            big_id:parseInt(removedString),
            micro_id:this._curUnitStatus.small_id,
            game_modes:"word"}
        this._rightChallenge.openView(param);
    }

    onUnitStatus(data:UnitStatusData){
        this._curUnitStatus = data;
        this.showRightChallengeView();
    }

    onUnitListStatus(data:UnitListItemStatus){
        this._curUnitList = data;
        this._scrollMap.initUnit(data);
        // this._rightChallenge.initData(data);
    }
    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps(`${this._bookData.book_name}${this._bookData.grade}`,()=>{
                ViewsManager.instance.showView(PrefabType.TextbookChallengeView, (node: Node) => {
                    ViewsManager.instance.closeView(PrefabType.BreakThroughView);
                });
            });
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmout(this.top_layout,5.471,42.399).then((amoutScript: TopAmoutView) => {
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:User.diamond},
                {type:AmoutType.Coin,num:User.coin},
                {type:AmoutType.Energy,num:User.stamina}];
            amoutScript.loadAmoutData(dataArr);
        });
    }
    /**初始化右侧闯关 */
    initRightChange(){
        ResLoader.instance.load(`prefab/${PrefabType.RightPanelchange.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.content_layout.addChild(node);
            NodeUtil.setLayerRecursively(node,Layers.Enum.UI_2D);
            let content_size = this.content_layout.getComponent(UITransform);
            let node_size = node.getComponent(UITransform);
            this._rightChallenge = node.getComponent(rightPanelchange);
            let posx = content_size.width / 2 + node_size.width / 2;
            node.setPosition(posx,0,0);
        })
    }


    /**初始化地图模块 */
    initScrollMap(){
        this._scrollMap = this.scrollMapNode.getComponent(ScrollMapView);
        this._scrollMap.setClickCallback((itemStatus:UnitItemStatus,gate:GateListItem) =>{
            this._selectitemStatus = itemStatus;
            this._selectGate = gate;
            
            let reqParam:ReqUnitStatusParam = {
                type_name:this._bookData.type_name,
                book_name:this._bookData.book_name,
                grade:this._bookData.grade,
                unit:this._selectitemStatus.unit,
                small_id:this._selectGate.small_id
            }
            TBServer.reqUnitStatus(reqParam);
        })
    }

    hideRightPanelchangeView(){
        // this._rightChallenge.hideView();
    }
    onDestroy(): void {
        super.onDestroy();
        this.removeEvent();
    }
}

