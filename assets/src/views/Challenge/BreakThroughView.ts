import { _decorator, error, instantiate, isValid, Node, Prefab, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { ReqUnitStatusParam, UnitListItemStatus } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import { rightPanelchange } from '../adventure/common/RightPanelchange';
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
    WordMeaning=3,
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

    start() {
        this.initUI();
    }

    initUI(){
        this.initScrollMap();
        this.initNavTitle();
        this.initAmout();
        this.initRightChange();
        // 
    }

    initData(data:BookUnitModel){
        this._bookData = data;
        
    }
    onInitModuleEvent(){
        this.addModelListener(NetNotify.Classification_UnitListStatus,this.onUnitListStatus);
        // this.addModelListener(EventType.Select_Word_Plan,this.onSelectWordPlan);
        // this.addModelListener(NetNotify.Classification_PlanModify,this.onPlanModify);
        // this.addModelListener(NetNotify.Classification_BookPlanDetail,this.onBookPlanDetail);
    }
    getUnitListStatus(){
        console.log("getUnitListStatus",this._bookData);
        TBServer.reqUnitListStatus(this._bookData);
        TBServer.reqBookAwardList(this._bookData.type_name,this._bookData.book_name);
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
                ViewsManager.instance.showView(PrefabType.TextbookChallengeView, (node: Node) => {
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
            this._rightChallenge = node.getComponent(rightPanelchange);
            let widgetCom = node.getComponent(Widget);
            if(!isValid(widgetCom)){
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignRight = true;
                widgetCom.isAlignBottom= true;
            }
            widgetCom.bottom = 68.297;
            widgetCom.right = -12.355;
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

