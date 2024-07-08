import { _decorator, Node } from 'cc';
import { DataMgr, EditInfo, EditType } from '../../manager/DataMgr';
import { BuildingIDType } from '../../models/BuildingModel';
import { User } from '../../models/User';
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

    updateData(){
        let editConfig = DataMgr.instance.editInfo;
        this._itemsData = [];
        editConfig.forEach(info => {
            if (BuildingIDType.mine == info.id) return;//矿山，需特殊处理
            if (EditType.Decoration == info.type || EditType.Land == info.type) {
                this._itemsData.push(info);
            } else {
                if (undefined == User.buildingList.find(item => item == info.id)) {
                    this._itemsData.push(info);
                }
            }
        });
        this.build_list.numItems = this._itemsData.length;
        this.build_list.scrollTo(0, 0);
    }
    /**列表加载 */
    onListLoad(node: Node, idx: number) {
        let info = this._itemsData[idx];
        node.getComponent(ShopGoodsItem).initData(info);
    }
}

