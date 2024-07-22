import { _decorator, Node, UITransform } from 'cc';
import { ItemID } from '../../export/ItemConfig';
import { ItemData } from '../../manager/DataMgr';
import { BasePopup } from '../../script/BasePopup';
import List from '../../util/list/List';
import { RewardItem } from '../common/RewardItem';
const { ccclass, property } = _decorator;

@ccclass('CompositeBagView')
export class CompositeBagView extends BasePopup {

    @property(List)
    public goods_list: List = null;

    @property(List)
    public composite_list: List = null;

    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]);
        this.goods_list.numItems = 40;
        this.composite_list.numItems = 3;
    }

    onLoadGoodsListHorizontal(item:Node, idx:number){
        let itemScript: RewardItem = item.getComponent(RewardItem);
        let node_trans = item.getComponent(UITransform);
        let scale = 97 / node_trans.height;
        item.setScale(scale, scale, scale)
        const randomItemID = this.getRandomEnumValue(ItemID);
        let data:ItemData = {
            id: randomItemID,
            num: 999,
        }
        itemScript.init(data);
    }


    onLoadCompositeListHorizontal(item:Node, idx:number){
        let itemScript: RewardItem = item.getComponent(RewardItem);
        let node_trans = item.getComponent(UITransform);
        let scale = 97 / node_trans.height;
        item.setScale(scale, scale, scale)
        const randomItemID = this.getRandomEnumValue(ItemID);
        let data:ItemData = {
            id: randomItemID,
            num: 999,
        }
        itemScript.init(data);
    }

    getRandomEnumValue(enumObject: typeof ItemID): ItemID {
        const enumValues = Object.values(enumObject).filter(value => typeof value === 'number') as number[];
        const randomIndex = Math.floor(Math.random() * enumValues.length);
        return enumValues[randomIndex] as ItemID;
    }
}

