import { _decorator, isValid, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { MonsterCardTabInfos } from './CollectInfo';
import { MonsterCardItem } from './MonsterCardItem';
import { MonsterTabItem } from './MonsterTabItem';
const { ccclass, property } = _decorator;

@ccclass('MonsterCardView')
export class MonsterCardView extends BaseView {
    @property(List)
    public monster_list: List = null;

    @property(List)
    public tab_list: List = null;

    protected initUI(): void {
        this.tab_list.numItems = MonsterCardTabInfos.length;
        this.tab_list.selectedId = 0;

        this.monster_list.numItems = 20;
    }

    onLoadMonsterCardGrid(item:Node, idx:number){
        let item_sript:MonsterCardItem = item.getComponent(MonsterCardItem);
        // let data = this._weekTask[idx];
        // item_sript.initPropsItem(data);
    }

    onMonsterCardListGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
    }

    onLoadMonsterTabHorizontal(item:Node, idx:number){
        let item_sript:MonsterTabItem = item.getComponent(MonsterTabItem);
        let data = MonsterCardTabInfos[idx];
        item_sript.updateTabItem(data);
    }

    onMonsterTabListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
    }

}

