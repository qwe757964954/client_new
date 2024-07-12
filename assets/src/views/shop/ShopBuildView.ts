import { _decorator, Node } from 'cc';
import { DataMgr, EditInfo, EditType } from '../../manager/DataMgr';
import { User } from '../../models/User';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { TabTypeIds } from '../task/TaskInfo';
import { ShopGoodsItem } from './ShopGoodsItem';
const { ccclass, property } = _decorator;

@ccclass('ShopBuildView')
export class ShopBuildView extends BaseView {
    @property(List)
    public build_list:List = null;
    private _itemsData: EditInfo[] = null;//编辑数据
    
    updateData(id:TabTypeIds){
        this.getBuildItems(id);
        this.build_list.numItems = this._itemsData.length;
        this.build_list.scrollTo(0, 0);
    }

    getBuildItems(id:TabTypeIds){
        this._itemsData = [];
        let editConfig = DataMgr.instance.editInfo;
        let cleanedEditConfig = editConfig.filter(item => item !== null && item !== undefined );
        // 使用 filter 方法过滤掉具有特定 id 的元素
        cleanedEditConfig = cleanedEditConfig.filter(item => !User.buildingList.includes(item.id));
        // console.log("cleanedEditConfig.........",cleanedEditConfig);
        switch (id) {
            case TabTypeIds.BuildAll:
                this._itemsData = cleanedEditConfig;
                break;
            case TabTypeIds.FunctionalBuilding:
                this._itemsData = cleanedEditConfig.filter(item => item.type === EditType.Buiding);
                break;
            case TabTypeIds.LandmarkBuilding:
                this._itemsData = cleanedEditConfig.filter(item => item.type === EditType.LandmarkBuiding);
                break;
            case TabTypeIds.Decoration:
                this._itemsData = cleanedEditConfig.filter(item => item.type === EditType.Decoration);
                break;
            case TabTypeIds.ShopFlooring:
                this._itemsData = cleanedEditConfig.filter(item => item.type === EditType.Land);
                break;
            default:
                break;
        }
    }

    /**列表加载 */
    onListLoad(node: Node, idx: number) {
        let info = this._itemsData[idx];
        node.getComponent(ShopGoodsItem).initData(info);
    }
}

