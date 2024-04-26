import { _decorator, Component, error, instantiate, Node, Prefab, view } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import List from '../../util/list/List';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { RightUnitView } from './RightUnitView';
const { ccclass, property } = _decorator;

@ccclass('TextbookChallengeView')
export class TextbookChallengeView extends Component {
    @property(Node)
    public top_layout:Node = null;          // 顶部导航栏

    @property(List)
    public unitScroll:List = null;

    private unitArr:any[] = [];
    private _unitDetailView:RightUnitView = null;
    start() {
        this.initUI();
    }
    protected initUI(){
        this.initNavTitle();
        this.initAmout();
        this.initBottomAutoScroll();
        this.initUnitScroll();
        this.initChallengeBottom();
        this.initRightMonsterDetail();
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
        ViewsManager.addAmout(this.top_layout,20.885,22.742).then((amoutScript: TopAmoutView) => {
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
    initUnitScroll(){
        this.unitScroll.numItems = 6;
        this.unitScroll.update();
    }
    onLoadUnitHorizontalList(item:Node, idx:number){
        console.log("onLoadUnitHorizontalList",item,idx);
        // let myTextbookItemScript:MyContentItem = item.getComponent(MyContentItem);
        // let itemInfo:MyTextbookItemData = this._myTextbookDataArr[idx];
        // myTextbookItemScript.updateMyContentItemProps(idx,itemInfo);
        // myTextbookItemScript.setClickCallback((delIdx:number)=>{
        //     if (delIdx >= 0 && delIdx < this._myTextbookDataArr.length) {
        //         this._myTextbookDataArr.splice(delIdx, 1); // 从数组中删除特定索引处的元素
        //     } 
        //     this.myScrollView.aniDelItem(delIdx,()=>{
        //         this.myScrollView.numItems = this._myTextbookDataArr.length;
        //         this.myScrollView.update();
        //         this.updateShowMyScrollEmpty();
        //     },-1)
            
        // });
    }

    update(deltaTime: number) {
        
    }
}


