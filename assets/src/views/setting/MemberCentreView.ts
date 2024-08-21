import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { BottomItem, BottomItemData, ButtomSelectType } from './BottomItem';
import { MemberItem, MemberPriceData } from './MemberItem';
const { ccclass, property } = _decorator;




@ccclass('MemberCentreView')
export class MemberCentreView extends BaseView {
    @property(Node)
    public top_layout:Node = null;          // 个人中心

    @property(List)
    public vipPriceScroll:List = null;

    @property(List)
    public bottomScroll:List = null;

    private _bottomDataArr:BottomItemData[] = [];
    private _memberPriceArr:MemberPriceData[] = [];
    protected initUI(){
        this.initNavTitle();
        this.initAmout();
        this.initBottom();
        this.initVipPrice();
    }
    /**初始化导航栏 */
    initNavTitle(){
        this.createNavigation("会员中心",this.top_layout, () => {
            ViewsMgr.closeView(PrefabType.MemberCentreView);
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmount(this.top_layout,15.78,22.437);
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
            {bottomType:ButtomSelectType.GrammarLearning}];
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
}


