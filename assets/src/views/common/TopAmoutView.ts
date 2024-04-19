import { _decorator, Component, Enum, Node } from 'cc';
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
export class TopAmoutView extends Component {

    @property(List)
    public acmoutScroll:List = null;

    private _dataArr:AmoutItemData[] = [];

    start() {

    }
    /**初始化数据 */
    loadAmoutData(dataArr:AmoutItemData[]){
        this._dataArr = dataArr;
        this.acmoutScroll.numItems = dataArr.length;
        this.acmoutScroll.update();
    }
    /**加载数值item */
    onListHorizontal(item:Node, idx:number){
        console.log("onListHorizontal_______________");
        let amountItemScript:AmoutItem = item.getComponent(AmoutItem);
        let itemInfo:AmoutItemData = this._dataArr[idx];
        amountItemScript.updateItemProps(idx,itemInfo);
    }
}


