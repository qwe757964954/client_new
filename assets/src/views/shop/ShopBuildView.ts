import { _decorator, Component, Node } from 'cc';
import { DataMgr, EditInfo, EditType } from '../../manager/DataMgr';
import List from '../../util/list/List';
import { TabTypeIds } from '../task/TaskInfo';
import { ShopGoodsItem } from './ShopGoodsItem';
import { buildTypeMapping } from './ShopInfo';
const { ccclass, property } = _decorator;

@ccclass('ShopBuildView')
export class ShopBuildView extends Component {
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
        let editConfig = DataMgr.editInfo;
        let cleanedEditConfig = editConfig.filter(item => item !== null && item !== undefined && item.type !== EditType.Null );
        // 使用 filter 方法过滤掉具有特定 id 的元素  Buiding = 1,//功能性建筑
        // cleanedEditConfig = cleanedEditConfig.filter(item => 
        // );   
        if(id === TabTypeIds.BuildAll){
            this._itemsData = cleanedEditConfig;
        }else{
            // 获取对应的 ClothingType
            const buildType = buildTypeMapping[id];
            if (id !== undefined) {
                // 过滤数据
                this._itemsData = editConfig.filter(item => item.type === buildType);
            }
        }
    }

    /**列表加载 */
    onListLoad(node: Node, idx: number) {
        let info = this._itemsData[idx];
        node.getComponent(ShopGoodsItem).initData(info);
    }
}

