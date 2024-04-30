import { _decorator, Component, error, instantiate, isValid, Node, Prefab, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { rightPanelchange } from '../adventure/common/RightPanelchange';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { ScrollMapView } from './ScrollMapView';
const { ccclass, property } = _decorator;

@ccclass('BreakThroughView')
export class BreakThroughView extends Component {
    @property(Node)
    public top_layout: Node = null;
    @property(Node)
    public content_layout: Node = null;

    private _rightChallenge:rightPanelchange = null;
    private _scrollMap:ScrollMapView = null;

    start() {
        this.initUI();
    }

    initUI(){
        this.initNavTitle();
        this.initAmout();
        this.initRightChange();
        this.initScrollMap();
    }

    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("教材单词闯关",()=>{
                ViewsManager.instance.showView(PrefabType.SelectWordView, (node: Node) => {
                    ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
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
        });
    }
}

