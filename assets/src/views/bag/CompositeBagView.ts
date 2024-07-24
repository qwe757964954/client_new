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

@ccclass('CompositeBagView')
export class CompositeBagView extends BasePopup {

    @property(List)
    public goods_list: List = null;

    @property(List)
    public composite_list: List = null;

    @property(Node)
    public btn_composite:Node = null;

    @property(CaleBagView)
    public caleBagView: CaleBagView = null;

    @property(Node)
    public target_node:Node = null;

    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("frame")]);
        this.goods_list.numItems = 40;
        this.goods_list.selectedId = 0;
        this.composite_list.numItems = 3;
        this.caleBagView.disableCale();
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.btn_composite,this.onCompositeClick.bind(this));
    }

    onCompositeClick(){

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

    async showTargetProps(itemId:number){
        let node = this.target_node.getChildByName("RewardItem");
        if(!isValid(node)){
            const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.RewardItem.path}`, Prefab) as Prefab;
            node = instantiate(prefab);
            this.target_node.addChild(node);
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

    onCompositeListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onCompositeListSelected",selectedId);
        this.showTargetProps(ItemID.hoe);
        // this.clearAllTabLabelColors();
        // let item_script = item.getComponent(BagTabItem);
        // item_script.tab_name.color = new Color("#FFFFFF");
    }

    getRandomEnumValue(enumObject: typeof ItemID): ItemID {
        const enumValues = Object.values(enumObject).filter(value => typeof value === 'number') as number[];
        const randomIndex = Math.floor(Math.random() * enumValues.length);
        return enumValues[randomIndex] as ItemID;
    }
}

