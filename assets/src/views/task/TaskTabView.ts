import { _decorator, isValid, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { TaskTabInfo } from './TaskInfo';
import { TaskTabItem } from './TaskTabItem';
const { ccclass, property } = _decorator;

@ccclass('TaskTabView')
export class TaskTabView extends BaseView {

    @property(List)
    tab_scroll:List = null;

    public tab_datas:TaskTabInfo[] = [];

    private callSelectCallback:(selectId:number)=>void = null;

    updateData(tabs:TaskTabInfo[]){
        this.tab_datas = tabs;
        this.tab_scroll.numItems = this.tab_datas.length;
        this.tab_scroll.selectedId = 0;
    }

    setTabSelectClick(callBack:(selectId:number)=>void){
        this.callSelectCallback = callBack;
    }
    onLoadTabHorizontal(item:Node, idx:number){
        let item_sript:TaskTabItem = item.getComponent(TaskTabItem);
        item_sript.initPropsItem(this.tab_datas[idx]);
    }

    onTabListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        let item_sript:TaskTabItem = item.getComponent(TaskTabItem);
        this.clearAllTabContent();
        item_sript.showSubItem = true;
        item_sript.updateSelectTabContent();
        if(this.callSelectCallback){
            this.callSelectCallback(selectedId);
        }
    }

    clearAllTabContent(){
        for (let index = 0; index < this.tab_scroll.numItems; index++) {
            let item = this.tab_scroll.getItemByListId(index);
            let item_script = item.getComponent(TaskTabItem);
            item_script.clearTabContent();
        }
    }
}


