import { JsonAsset } from "cc";
import { ItemData } from "../../manager/DataMgr";
import { ResLoader } from "../../manager/ResLoader";
import { User } from "../../models/User";
import { BackpackItemInfo, BagItemType, BagOperationData, BagOperationIds, BagOperationNames, GameBagData } from "./BagInfo";

//用户信息服务
export default class _BagConfig {
    private static _instance: _BagConfig;
    private _BagConfigInfo:GameBagData = null;
    public static getInstance(): _BagConfig {
        if (!this._instance || this._instance == null) {
            this._instance = new _BagConfig();
        }
        return this._instance;
    }
    
    get BagConfigInfo() {
        return this._BagConfigInfo;
    }
    public async loadBagConfigInfo(): Promise<void> {
        try {
            const jsonData = await ResLoader.instance.loadAsyncPromise<JsonAsset>('Bag/item_info', JsonAsset);
            this._BagConfigInfo = jsonData.json as GameBagData;
        } catch (err) {
            console.error("Failed to load task configuration:", err);
            throw err;
        }
    }

    public filterBagItems(datas: ItemData[]): ItemData[]{
        if (!this._BagConfigInfo) {
            console.error("BagConfigInfo is not loaded.");
            return [];
        }
        const filteredDatas = datas.filter(dataItem => 
            this._BagConfigInfo.backpack_item_info.some(backpackItem => backpackItem.id === dataItem.id)
        );
        return filteredDatas;
    }

    public filterItemsByType(datas: ItemData[], type: BagItemType): ItemData[] {
        if (!this._BagConfigInfo) {
            console.error("BagConfigInfo is not loaded.");
            return [];
        }
        // 找到所有符合类型的背包物品
        const filteredBackpackItems = this._BagConfigInfo.backpack_item_info.filter(item => item.type === type);

        // 过滤出 datas 中与这些背包物品 ID 匹配的项
        const filteredDatas = datas.filter(dataItem => 
            filteredBackpackItems.some(backpackItem => backpackItem.id === dataItem.id)
        );
        return filteredDatas;
    }

    filterCanMergeItems(){
        if (!this._BagConfigInfo) {
            console.error("BagConfigInfo is not loaded.");
            return [];
        }
        // 找到所有可以合成的背包物品
        const filteredBackpackItems = this._BagConfigInfo.backpack_item_info.filter(item => item.merge_item.length > 0);
        return filteredBackpackItems;
    }

    findMergeItems(itemInfo:BackpackItemInfo){
        if (!this._BagConfigInfo) {
            console.error("BagConfigInfo is not loaded.");
            return [];
        }
        // 查找 dataItem 对应的背包物品
        const backpackItem = this._BagConfigInfo.backpack_item_info.find(item => item.id === itemInfo.id);
        const merge_items = backpackItem.merge_item;
        return merge_items;
    }

    findBreakdownItems(itemInfo:ItemData){
        if (!this._BagConfigInfo) {
            console.error("BagConfigInfo is not loaded.");
            return [];
        }
        // 查找 dataItem 对应的背包物品
        const backpackItem = this._BagConfigInfo.backpack_item_info.find(item => item.id === itemInfo.id);
        const decompose_items = backpackItem.decompose_item;
        return decompose_items;
    }

    findItemInfo(itemInfo:ItemData){
        if (!this._BagConfigInfo) {
            console.error("BagConfigInfo is not loaded.");
            return null;
        }
        // 查找 dataItem 对应的背包物品
        const backpackItem = this._BagConfigInfo.backpack_item_info.find(item => item.id === itemInfo.id);
        return backpackItem;
    }

    public getItemCanOperations(dataItem: ItemData): BagOperationData[] {
        if (!this._BagConfigInfo) {
            console.error("BagConfigInfo is not loaded.");
            return [];
        }

        // 查找 dataItem 对应的背包物品
        const backpackItem = this._BagConfigInfo.backpack_item_info.find(item => item.id === dataItem.id);
        if (!backpackItem) {
            return [];
        }

        const isCostume = backpackItem.type === BagItemType.Costume;
        const hasMergeItems = backpackItem.merge_item.length > 0;
        const hasDecomposeItems = backpackItem.decompose_item.length > 0;

        // 根据物品属性过滤操作列表
        return BagOperationNames.filter(operation => {
            if (operation.id === BagOperationIds.Outfit || operation.id === BagOperationIds.UnOutfit) {
                return isCostume;
            }
            if (operation.id === BagOperationIds.Combine) {
                return hasMergeItems;
            }
            if (operation.id === BagOperationIds.Disassemble) {
                return hasDecomposeItems;
            }
            return false;
        });
    }
    public convertItemArrayData(itemAry:{ [key: number]: number } ){
        const arrayData: ItemData[] = Object.keys(User.itemAry).map(key => ({
            id: parseInt(key),
            num: User.itemAry[parseInt(key) as keyof typeof User.itemAry]
        }));
        return arrayData;
    }
}

export const BagConfig = _BagConfig.getInstance();