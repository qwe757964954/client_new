import { _decorator, error, instantiate, Node, Prefab, UITransform } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { BookLevelConfig, DataMgr } from '../../manager/DataMgr';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { MapLevelData } from '../../models/AdventureModel';
import { ReqUnitStatusParam, UnitListItemStatus, UnitStatusData } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import { LevelConfig, rightPanelchange } from '../adventure/common/RightPanelchange';
import { StudyModeView } from '../adventure/sixModes/StudyModeView';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { ScrollMapView } from './ScrollMapView';
import { BookUnitModel, TextbookChallengeView } from './TextbookChallengeView';
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
    private _scrollMap:ScrollMapView = null;

    private _bookData:BookUnitModel = null;

    private _curUnitStatus:UnitStatusData = null;

    start() {
        this.initUI();
    }

    initUI(){
        
        this.initNavTitle();
        this.initAmout();
        this.initRightChange();
        DataMgr.instance.getAdventureLevelConfig();
        this.initScrollMap();
    }

    initData(data:BookUnitModel){
        this._bookData = data;
        
    }
    onInitModuleEvent(){
        this.addModelListener(NetNotify.Classification_UnitListStatus,this.onUnitListStatus);
        this.addModelListener(NetNotify.Classification_UnitStatus,this.onUnitStatus);
        this.addModelListener(EventType.Enter_Island_Level,this.onEnterIsland);

        
        // this.addModelListener(EventType.Select_Word_Plan,this.onSelectWordPlan);
        // this.addModelListener(NetNotify.Classification_PlanModify,this.onPlanModify);
        // this.addModelListener(NetNotify.Classification_BookPlanDetail,this.onBookPlanDetail);
    }
    getUnitListStatus(){
        console.log("getUnitListStatus",this._bookData);
        TBServer.reqUnitListStatus(this._bookData);
    }
    onEnterIsland(data:LevelConfig){
        
        switch (this._curUnitStatus.game_mode) {
            case LearnGameModel.Tutoring:
                this.gotoTutoring(data);
                break;
        
            default:
                break;
        }

        
    }
    /**进入学 */
    gotoTutoring(data:LevelConfig){
        ViewsManager.instance.showView(PrefabType.StudyModeView, (node: Node) => {
            let bookLevelData:BookLevelConfig = {
                grade:this._curUnitStatus.grade,
                unit:this._curUnitStatus.unit,
                type_name:this._curUnitStatus.type_name,
                game_mode:this._curUnitStatus.game_mode,
                book_name:this._curUnitStatus.book_name
            }
            console.log("onEnterIsland_______",this._curUnitStatus);
            
            node.getComponent(StudyModeView).initData(this._curUnitStatus.data, bookLevelData);
        });
    }

    onUnitStatus(data:UnitStatusData){
        console.log("onUnitStatus",data);
        this._curUnitStatus = data;
        let content_size = this.content_layout.getComponent(UITransform);
        let node_size = this._rightChallenge.node.getComponent(UITransform);
        let posx = content_size.width / 2 + node_size.width / 2;
        this._rightChallenge.node.setPosition(posx,0,0);
        const removedString = data.unit.replace("Unit ", "").trim();
        let param:MapLevelData = {small_id:parseInt(removedString), 
            big_id:1,
            micro_id:parseInt(removedString),
            game_modes:"word"}
        this._rightChallenge.openView(param);
        // this._rightChallenge.node.active = true;
        // tween(this._rightChallenge.node).by(0.3,{position:new Vec3(-node_size.width,0,0)}).start();
    }

    onUnitListStatus(data:UnitListItemStatus){
        console.log("onUnitListStatus",data);
        this._scrollMap.initUnit(data);
        // this._rightChallenge.initData(data);
    }
    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps(`${this._bookData.book_name}${this._bookData.grade}`,()=>{
                // ViewsManager.instance.closeView(PrefabType.BreakThroughView);
                ViewsManager.instance.showView(PrefabType.TextbookChallengeView, (node: Node) => {
                    let itemScript:TextbookChallengeView = node.getComponent(TextbookChallengeView);
                    itemScript.initData(this._bookData);
                    ViewsManager.instance.closeView(PrefabType.BreakThroughView);
                });
            });
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmout(this.top_layout,5.471,42.399).then((amoutScript: TopAmoutView) => {
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:0},
                {type:AmoutType.Coin,num:0},
                {type:AmoutType.Energy,num:0}];
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
            let content_size = this.content_layout.getComponent(UITransform);
            let node_size = node.getComponent(UITransform);
            this._rightChallenge = node.getComponent(rightPanelchange);
            let posx = content_size.width / 2 + node_size.width / 2;
            node.setPosition(posx,0,0);
        })
    }


    /**初始化地图模块 */
    initScrollMap(){
        ResLoader.instance.load(`prefab/${PrefabType.ScrollMapView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.content_layout.addChild(node);
            this._scrollMap = node.getComponent(ScrollMapView);
            this._scrollMap.setClickCallback((unit:string) =>{
                console.log("unit",unit);
                let reqParam:ReqUnitStatusParam = {
                    type_name:this._bookData.type_name,
                    book_name:this._bookData.book_name,
                    grade:this._bookData.grade,
                    unit:unit,
                    game_mode:LearnGameModel.Tutoring
                }
                TBServer.reqUnitStatus(reqParam);
                
            })
            this.getUnitListStatus();
        });
    }

    
}

