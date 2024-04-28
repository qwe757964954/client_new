import { _decorator, Component, error, instantiate, isValid, Node, Prefab, view, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { RightUnitView } from './RightUnitView';
const { ccclass, property } = _decorator;

@ccclass('TextbookChallengeView')
export class TextbookChallengeView extends Component {
    @property(Node)
    public top_layout:Node = null;          // 顶部导航栏

    @property(Node)
    public content_layout:Node = null;          // 内容

    private unitArr:any[] = [];
    private _unitDetailView:RightUnitView = null;
    start() {
        this.initUI();
    }
    protected initUI(){
        this.initNavTitle();
        this.initAmout();
        this.initChallengeBottom();
        this.initLeftMonster();
        this.initRightBookUnitInfo();
    }
    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("外研社 必修3",()=>{
                ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
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

    /**出事右侧怪物详情 */
    initRightBookUnitInfo(){
        ResLoader.instance.load(`prefab/${PrefabType.RightUnitView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.content_layout.addChild(node);
            this._unitDetailView = node.getComponent(RightUnitView);
            let widgetCom = node.getComponent(Widget);
            if(!isValid(widgetCom)){
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignRight = true;
                widgetCom.isAlignVerticalCenter= true;
            }
            widgetCom.verticalCenter = 62.308;
            widgetCom.right = 62.308;
        });
    }
    /**下方单元进度模块 */
    initChallengeBottom(){
        ResLoader.instance.load(`prefab/${PrefabType.ChallengeBottomView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.node.addChild(node);
        });
    }
    /**初始化左侧怪物 */
    initLeftMonster(){
        ResLoader.instance.load(`prefab/${PrefabType.LeftMonsterView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.content_layout.addChild(node);
            let widgetCom = node.getComponent(Widget);
            if(!isValid(widgetCom)){
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignLeft = true;
                // widgetCom.isAlignTop= true;
                widgetCom.isAlignVerticalCenter= true;
            }
            let viewSizeWidth = view.getVisibleSize().width;
            let projectSizeWidth = view.getDesignResolutionSize().width;
            console.log("viewSizeWidth = ", viewSizeWidth, " projectSizeWidth = ", projectSizeWidth);
            widgetCom.verticalCenter = 78.489;
            widgetCom.left = 179.221 * viewSizeWidth / projectSizeWidth;
            widgetCom.updateAlignment();
            // widgetCom.top = 97.93;
            // widgetCom.left = 108.736;
        });
    }
    update(deltaTime: number) {
        
    }
}


