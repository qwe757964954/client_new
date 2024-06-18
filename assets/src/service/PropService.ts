import { _decorator } from 'cc';
import { EventType } from '../config/EventType';
import { ItemData } from '../manager/DataMgr';
import { BagAllProps, BagConsumeProps, BagDecoratorProps, BagOtherProps } from '../models/PropModel';
import { BaseControll } from '../script/BaseControll';
import EventManager from '../util/EventManager';
const { ccclass, property } = _decorator;
/**背包物品以及使用相关的服务 */
@ccclass('PropService')
export class PropService extends BaseControll {

    constructor() {
        super("PropService");
    }

    onInitModuleEvent() {
        //this.addModelListener(InterfacePath.WordGame_Words, this.onWordGameWords);
    }

    //请求玩家的背包物品列表
    propList(type: number) {
        let propDatas: ItemData[] = [];
        if (type == 1) {
            propDatas = BagAllProps;
        }
        else if (type == 2) {
            propDatas = BagDecoratorProps;
        }
        else if (type == 3) {
            propDatas = BagConsumeProps;
        }
        else {
            propDatas = BagOtherProps;
        }

        EventManager.emit(EventType.Bag_PropList, propDatas);
    }
}


