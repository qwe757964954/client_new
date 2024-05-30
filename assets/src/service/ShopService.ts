import { _decorator, Component, Node } from 'cc';
import { BaseControll } from '../script/BaseControll';
import { GoodsItemData, ShopAllGoods } from '../models/GoodsModel';
import EventManager from '../util/EventManager';
import { EventType } from '../config/EventType';
import { ViewsManager } from '../manager/ViewsManager';
import { TextConfig } from '../config/TextConfig';
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
        ViewsManager.instance.showTip(TextConfig.Function_Tip2);
    }
}


