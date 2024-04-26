import { _decorator, Component, error, instantiate, Node, Prefab, view } from 'cc';
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


    private unitArr:any[] = [];
    private _unitDetailView:RightUnitView = null;
    start() {
        this.initUI();
    }
    protected initUI(){
        this.initNavTitle();
        this.initAmout();
        // this.initBottomAutoScroll();
        // this.initChallengeBottom();
        // this.initRightMonsterDetail();
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

    /**初始化自动滚动角色UI */
    initBottomAutoScroll(){
        ResLoader.instance.load(`prefab/${PrefabType.FloorsAutoView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.node.addChild(node);
        });
    }

    /**出事右侧怪物详情 */
    initRightMonsterDetail(){
        ResLoader.instance.load(`prefab/${PrefabType.RightUnitView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.node.addChild(node);
            let winWidth = view.getVisibleSize().width;
            node.setPosition(winWidth/2, 0, 0);
            this._unitDetailView = node.getComponent(RightUnitView);
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

    update(deltaTime: number) {
        
    }
}


