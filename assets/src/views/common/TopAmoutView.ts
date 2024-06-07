import { _decorator, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { User } from '../../models/User';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { AmoutItem } from './AmoutItem';
const { ccclass, property } = _decorator;

export enum AmoutType {
    Coin= 0,/**金币 */
    Diamond= 1,/**钻石 */
    Energy= 2/**体力 */
}

export interface AmoutItemData {
    type:AmoutType,
    num:number
}

@ccclass('TopAmoutView')
export class TopAmoutView extends BaseView {

    @property(List)
    public acmoutScroll:List = null;

    private _dataArr:AmoutItemData[] = [];
    
    protected onInitModuleEvent() {
		this.addModelListener(EventType.Diamond_Update,this.onUpdateDiamond);
        this.addModelListener(EventType.Coin_Update,this.onUpdateCoin);
        this.addModelListener(EventType.Stamina_Update,this.onUpdateStamina);
	}

    /**初始化数据 */
    loadAmoutData(dataArr:AmoutItemData[]){
        this._dataArr = dataArr;
        this.acmoutScroll.numItems = dataArr.length;
        this.acmoutScroll.update();
    }
    /**加载数值item */
    onListHorizontal(item:Node, idx:number){
        let amountItemScript:AmoutItem = item.getComponent(AmoutItem);
        let itemInfo:AmoutItemData = this._dataArr[idx];
        amountItemScript.updateItemProps(idx,itemInfo);
    }

    onUpdateDiamond(){
        let coinItem:Node = this.acmoutScroll.getItemByListId(AmoutType.Diamond)
        let coinScript:AmoutItem = coinItem.getComponent(AmoutItem);
        coinScript.updateAmout(User.diamond);
    }
    onUpdateCoin(){
        let coinItem:Node = this.acmoutScroll.getItemByListId(AmoutType.Coin)
        let coinScript:AmoutItem = coinItem.getComponent(AmoutItem);
        coinScript.updateAmout(User.coin);
    }
    onUpdateStamina(){
        let coinItem:Node = this.acmoutScroll.getItemByListId(AmoutType.Energy)
        let coinScript:AmoutItem = coinItem.getComponent(AmoutItem);
        coinScript.updateAmout(User.stamina);
    }
}


