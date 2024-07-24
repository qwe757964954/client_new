import { _decorator, instantiate, isValid, Node, Prefab, UITransform } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ItemID } from '../../export/ItemConfig';
import { ItemData } from '../../manager/DataMgr';
import { ResLoader } from '../../manager/ResLoader';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { RewardItem } from '../common/RewardItem';
import { CaleBagView } from './CaleBagView';
const { ccclass, property } = _decorator;

@ccclass('BreakdownView')
export class BreakdownView extends BasePopup {

    @property(List)
    public item_list: List = null;

    @property(Node)
    public sure_btn: Node = null;

    @property(CaleBagView)
    public caleBagView: CaleBagView = null;

    @property(Node)
    public source_node:Node = null;

    public initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]);
        this.item_list.numItems = 5;
        this.showSourceProps(ItemID.hoe);
    }
    initEvent() {
        CCUtil.onBtnClick(this.sure_btn, this.onClickSure.bind(this));
    }

    onClickSure(){
        this.closePop();
    }

    async showSourceProps(itemId:number){
        let node = this.source_node.getChildByName("RewardItem");
        if(!isValid(node)){
            const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.RewardItem.path}`, Prefab) as Prefab;
            node = instantiate(prefab);
            this.source_node.addChild(node);
        }
        let itemScript: RewardItem = node.getComponent(RewardItem);
        let node_trans = node.getComponent(UITransform);
        let scale = 97 / node_trans.height;
        node.setScale(scale, scale, scale)
        let data:ItemData = {
            id: itemId,
            num: 1,
        }
        itemScript.init(data);
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


