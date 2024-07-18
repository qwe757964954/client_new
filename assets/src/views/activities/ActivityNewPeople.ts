import { _decorator, isValid, Node } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { ViewsManager } from '../../manager/ViewsManager';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { NewPeopleItem } from './NewPeopleItem';
const { ccclass, property } = _decorator;

@ccclass('ActivityNewPeople')
export class ActivityNewPeople extends BaseView {
    
    @property(List)
    public day_scroll:List = null;

    @property(Node)
    public sign_now:Node = null;

    protected initUI(): void {
        this.day_scroll.numItems = 6;
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.sign_now,this.onSignNowClick.bind(this));
    }
    onSignNowClick(){
        ViewsManager.instance.showTip(TextConfig.Function_Tip);
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

