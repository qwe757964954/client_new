import { _decorator, isValid, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { NewPeopleItem } from './NewPeopleItem';
const { ccclass, property } = _decorator;

@ccclass('ActivityNewPeople')
export class ActivityNewPeople extends BaseView {
    
    @property(List)
    public day_scroll:List = null;

    protected initUI(): void {
        this.day_scroll.numItems = 6;
    }

    onLoadDayGrid(item:Node, idx:number){
        let item_sript:NewPeopleItem = item.getComponent(NewPeopleItem);
        // let data = this._weekTask[idx];
        // item_sript.initPropsItem(data);
    }

    onDayListGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onDayListGridSelected",selectedId);
    }

}

