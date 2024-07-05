import { _decorator, isValid, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { ClothingIllustratedItem } from './ClothingIllustratedItem';
const { ccclass, property } = _decorator;

@ccclass('ClothingIllustratedView')
export class ClothingIllustratedView extends BaseView {
    @property(List)
    public cloth_list: List = null;
    
    protected initUI(): void {
        this.cloth_list.numItems = 20;
    }

    onLoadClothingAtlasGrid(item:Node, idx:number){
        let item_sript:ClothingIllustratedItem = item.getComponent(ClothingIllustratedItem);
        // let data = this._weekTask[idx];
        // item_sript.initPropsItem(data);
    }

    onClothingAtlasListGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
    }
}

