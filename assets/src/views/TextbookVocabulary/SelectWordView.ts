import { _decorator, Component, error, instantiate, isValid, Node, Prefab, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import List from '../../util/list/List';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { TabContentView, TabItemData } from './TabContentView';
const { ccclass, property } = _decorator;

@ccclass('SelectWordView')
export class SelectWordView extends Component {
    @property(Node)
    public top_layout:Node = null;          // 顶部导航栏
    @property(List)
    public textBookScrollView:List = null;
    @property(List)
    public myScrollView:List = null;
    start() {
        this.initUI();
    }
    protected initUI(){
        this.initNavTitle();
        this.initAmout();
        this.initTabContent();
    }
    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(`${PrefabType.NavTitleView.path}`,this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("选择词书",()=>{
                ViewsManager.instance.closeView(PrefabType.SelectWordView);
            });
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmout(`${PrefabType.TopAmoutView.path}`,this.top_layout,18.628,159.38).then((amoutScript: TopAmoutView) => {
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:0},
                {type:AmoutType.Coin,num:0},
                {type:AmoutType.Energy,num:0}];
            amoutScript.loadAmoutData(dataArr);
        });
    }

    /**初始化tab选项 */
    initTabContent(){
        ResLoader.instance.load(`prefab/${PrefabType.TabContentView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.node.addChild(node);
            let widgetCom = node.getComponent(Widget);
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignTop = true;
                widgetCom.isAlignHorizontalCenter = true;
            }
            widgetCom.top = 140.033;
            widgetCom.horizontalCenter = 0;
            widgetCom.updateAlignment();
            let tabScript = node.getComponent(TabContentView);
            let dataArr:TabItemData[] = [
                {name:"小阶段",isSelected:false},
                {name:"中阶段",isSelected:false},
                {name:"高阶段",isSelected:false},
                {name:"教辅",isSelected:false},
                {name:"考级",isSelected:false},
                {name:"基础",isSelected:false},
                {name:"专业",isSelected:false},
            ];
            tabScript.loadTabData(dataArr);
        });
    }
    loadTextBookList(){
        
    }
}


