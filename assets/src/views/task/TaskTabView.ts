import { _decorator, isValid, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { TaskTabInfos } from './TaskInfo';
import { TaskTabItem } from './TaskTabItem';
const { ccclass, property } = _decorator;

@ccclass('TaskTabView')
export class TaskTabView extends BaseView {

    @property(List)
    tab_scroll:List = null;

    private callSelectCallback:(selectId:number)=>void = null;
    start() {
        super.start();
        this.tab_scroll.numItems = TaskTabInfos.length;
        this.tab_scroll.selectedId = 0;
    }
    setTabSelectClick(callBack:(selectId:number)=>void){
        this.callSelectCallback = callBack;
    }
    onLoadTabHorizontal(item:Node, idx:number){
        let item_sript:TaskTabItem = item.getComponent(TaskTabItem);
        item_sript.initPropsItem(idx);
    }

    onTabListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        let item_sript:TaskTabItem = item.getComponent(TaskTabItem);
        this.clearAllTabContent();
        item_sript.updateSelectTabContent(selectedId);
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


