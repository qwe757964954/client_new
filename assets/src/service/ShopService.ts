import { _decorator } from 'cc';
import { EventType } from '../config/EventType';
import { TextConfig } from '../config/TextConfig';
import { ViewsMgr } from '../manager/ViewsManager';
import { GoodsItemData, ShopAllGoods } from '../models/GoodsModel';
import { BaseControll } from '../script/BaseControll';
import EventManager from '../util/EventManager';
const { ccclass, property } = _decorator;
/**商城相关的服务 */
@ccclass('ShopService')
export class ShopService extends BaseControll {
    constructor() {
        super("ShopService");
    }

    onInitModuleEvent() {
        //this.addModelListener(InterfacePath.WordGame_Words, this.onWordGameWords);
    }

    goodsList(type: number) {
        let propDatas: GoodsItemData[] = [];
        for (let i = 0; i < ShopAllGoods.length; i++) {
            let goodsItem: GoodsItemData = ShopAllGoods[i];
            if (goodsItem.type === type) {
                propDatas.push(goodsItem);
            }
        }

        EventManager.emit(EventType.Shop_GoodsList, propDatas);
    }

    buyGood(id: number) {
        ViewsMgr.showTip(TextConfig.Function_Tip2);
    }
}


