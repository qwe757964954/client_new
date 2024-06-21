import { _decorator, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { User } from '../../models/User';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { AmoutItem } from './AmoutItem';
const { ccclass, property } = _decorator;

export enum AmoutType {
    Coin = 0, /** 金币 */
    Diamond = 1, /** 钻石 */
    Energy = 2 /** 体力 */
}

export interface AmoutItemData {
    type: AmoutType,
    num: number
}

@ccclass('TopAmoutView')
export class TopAmoutView extends BaseView {

    @property(List)
    public amountScroll: List = null; // 使用更准确的命名

    private _dataArr: AmoutItemData[] = [];

    protected onInitModuleEvent() {
        this.addModelListener(EventType.Diamond_Update, this.onUpdateAmount.bind(this, AmoutType.Diamond, User.diamond));
        this.addModelListener(EventType.Coin_Update, this.onUpdateAmount.bind(this, AmoutType.Coin, User.coin));
        this.addModelListener(EventType.Stamina_Update, this.onUpdateAmount.bind(this, AmoutType.Energy, User.stamina));
    }

    /** 初始化数据 */
    loadAmoutData(dataArr: AmoutItemData[]) {
        this._dataArr = dataArr;
        this.amountScroll.numItems = dataArr.length;
        this.amountScroll.update();
    }

    /** 加载数值item */
    onListHorizontal(item: Node, idx: number) {
        let amountItemScript: AmoutItem = item.getComponent(AmoutItem);
        let itemInfo: AmoutItemData = this._dataArr[idx];
        amountItemScript.updateItemProps(idx, itemInfo);
    }

    /** 更新对应类型的金额 */
    private onUpdateAmount(type: AmoutType, newValue: number) {
        if(type == AmoutType.Diamond){
            newValue = User.diamond;
        }
        if(type == AmoutType.Coin){
            newValue = User.coin;
        }
        if(type == AmoutType.Energy){
            newValue = User.stamina;
        }
        for (let index = 0; index < this.amountScroll.numItems; index++) {
            let amountItem: Node = this.amountScroll.getItemByListId(index);
            if (amountItem) {
                let amountItemScript: AmoutItem = amountItem.getComponent(AmoutItem);
                if (amountItemScript.amount_info.type === type) {
                    amountItemScript.updateAmout(newValue);
                }
            } else {
                console.warn(`No amount item found at index ${index}`);
            }
        }
    }
}
