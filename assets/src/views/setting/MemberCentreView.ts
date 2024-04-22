import { _decorator, Component, instantiate, isValid, Node, Prefab, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsManager } from '../../manager/ViewsManager';
import List from '../../util/list/List';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { BottomItem, BottomItemData, ButtomSelectType } from './BottomItem';
import { MemberItem, MemberPriceData } from './MemberItem';
const { ccclass, property } = _decorator;




@ccclass('MemberCentreView')
export class MemberCentreView extends Component {
    @property(Node)
    public top_layout:Node = null;          // 个人中心

    @property(List)
    public vipPriceScroll:List = null;

    @property(List)
    public bottomScroll:List = null;

    private _bottomDataArr:BottomItemData[] = [];
    private _memberPriceArr:MemberPriceData[] = [];
    protected onLoad(): void {
        
    }
    start() {
        this.initUI();
    }
    protected initUI(){
        this.initAmout();
        this.initBottom();
        this.initVipPrice();
    }
    /**初始化游戏数值 */
    initAmout(){
        LoadManager.loadPrefab(PrefabType.TopAmoutView.path).then((prefab: Prefab) => {
            let node = instantiate(prefab);
            this.top_layout.addChild(node);
            let widgetCom = node.getComponent(Widget);
            if(!isValid(widgetCom)){
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignRight = true;
                widgetCom.isAlignVerticalCenter = true;
            }
            widgetCom.right = 22.437;
            widgetCom.verticalCenter = 15.78;
            widgetCom.updateAlignment();
            let amoutScript = node.getComponent(TopAmoutView);
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:0},
                {type:AmoutType.Coin,num:0},
                {type:AmoutType.Energy,num:0}];
            amoutScript.loadAmoutData(dataArr);
        });
    }
    /**初始化下方选项 */
    initBottom(){
        

        this._bottomDataArr = [{bottomType:ButtomSelectType.SuperSearch},
            {bottomType:ButtomSelectType.WordSplitting},
            {bottomType:ButtomSelectType.PhonicsLessons},
            {bottomType:ButtomSelectType.VoiceEvaluation},
            {bottomType:ButtomSelectType.ReviewPush},
            {bottomType:ButtomSelectType.NewWordRecord},
            {bottomType:ButtomSelectType.AcademicRecord},
            {bottomType:ButtomSelectType.PhonicsGame},
            {bottomType:ButtomSelectType.GrammarLearning}];;
        this.bottomScroll.numItems = this._bottomDataArr.length;
        this.bottomScroll.update();
    }
    /**初始化vip */
    initVipPrice(){
        this._memberPriceArr = [{name:"永久会员",price:499,flag_name:"77%用户性价比选择",desc:"一次购买，终身畅用"},
        {name:"包年会员",price:359,desc:"平均每天不到一元"},
        {name:"3天体验",price:5.9,desc:"平均每日1.96元"}];
        this.vipPriceScroll.numItems = this._memberPriceArr.length;
        this.vipPriceScroll.update();
    }
    

    /**加载数值item */
    onPriceHorizontal(item:Node, idx:number){
        console.log("onListHorizontal_______________");
        let amountItemScript:MemberItem = item.getComponent(MemberItem);
        let itemInfo:MemberPriceData = this._memberPriceArr[idx];
        amountItemScript.updateItemProps(idx,itemInfo);
    }
    /**加载 bottom item */
    onBottomHorizontal(item:Node, idx:number){
        console.log("onListHorizontal_______________");
        let amountItemScript:BottomItem = item.getComponent(BottomItem);
        let itemInfo:BottomItemData = this._bottomDataArr[idx];
        amountItemScript.updateItemProps(idx,itemInfo);
    }
    
    // 关闭
    btnCloseFunc() {
        console.log("btnCloseFunc");
        ViewsManager.instance.closeView(PrefabType.MemberCentreView);
    }
}


