import { _decorator, Node, UITransform } from 'cc';
import { ItemID } from '../../export/ItemConfig';
import { ItemData } from '../../manager/DataMgr';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { RewardItem } from '../common/RewardItem';
const { ccclass, property } = _decorator;

@ccclass('BreakdownView')
export class BreakdownView extends BasePopup {

    @property(List)
    public item_list: List = null;

    @property(Node)
    public sure_btn: Node = null;

    public initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]);
        this.item_list.numItems = 5;
    }
    initEvent() {
        CCUtil.onBtnClick(this.sure_btn, this.onClickSure.bind(this));
    }

    onClickSure(){
        this.closePop();
    }

    onLoadItemListHorizontal(item:Node, idx:number){
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


