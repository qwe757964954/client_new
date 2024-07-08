import { _decorator, isValid, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { BuildingAtlasItem } from './BuildingAtlasItem';
import { BuildingAtlasTabInfos } from './CollectInfo';
import { MonsterTabItem } from './MonsterTabItem';
const { ccclass, property } = _decorator;

@ccclass('BuildingAtlasView')
export class BuildingAtlasView extends BaseView {
    @property(List)
    public build_list: List = null;

    @property(List)
    public tab_list: List = null;
    

    protected initUI(): void {
        this.tab_list.numItems = BuildingAtlasTabInfos.length;
        this.tab_list.selectedId = 0;
        this.build_list.numItems = 20;
    }

    onLoadBuildingAtlasGrid(item:Node, idx:number){
        let item_sript:BuildingAtlasItem = item.getComponent(BuildingAtlasItem);
        // let data = this._weekTask[idx];
        // item_sript.initPropsItem(data);
    }

    onBuildingAtlasListGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
    }

    onLoadBuildingTabHorizontal(item:Node, idx:number){
        let item_sript:MonsterTabItem = item.getComponent(MonsterTabItem);
        let data = BuildingAtlasTabInfos[idx];
        item_sript.updateTabItem(data);
    }

    onBuildingTabListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
    }

}

