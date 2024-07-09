import { _decorator, Node } from 'cc';
import { DataMgr, EditInfo, EditType } from '../../manager/DataMgr';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { ShopGoodsItem } from './ShopGoodsItem';
const { ccclass, property } = _decorator;

@ccclass('ShopBuildView')
export class ShopBuildView extends BaseView {
    @property(List)
    public build_list:List = null;
    private _itemsData: EditInfo[] = null;//编辑数据
    start() {

    }

    updateData(type:EditType){
        let editConfig = DataMgr.instance.editInfo;
        this._itemsData = [];
        this._itemsData = editConfig.filter(item => item.type === type);
        this.build_list.numItems = this._itemsData.length;
        this.build_list.scrollTo(0, 0);
    }
    /**列表加载 */
    onListLoad(node: Node, idx: number) {
        let info = this._itemsData[idx];
        node.getComponent(ShopGoodsItem).initData(info);
    }
}

