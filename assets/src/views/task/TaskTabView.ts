import { _decorator, Color, color, isValid, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { TaskTabInfo } from './TaskInfo';
import { TaskTabItem } from './TaskTabItem';
const { ccclass, property } = _decorator;

@ccclass('TaskTabView')
export class TaskTabView extends BaseView {

    @property(List)
    tab_scroll: List = null;

    public tab_datas: TaskTabInfo[] = [];

    private callSelectCallback: (info: TaskTabInfo) => void = null;

    protected initUI(): void {
        this.offViewAdaptSize();
    }

    updateData(tabs: TaskTabInfo[], selectId: number = 0) {
        this.tab_datas = tabs;
        this.tab_scroll.numItems = this.tab_datas.length;
        this.tab_scroll.selectedId = selectId;
    }

    setTabSelectClick(callBack: (info: TaskTabInfo) => void) {
        this.callSelectCallback = callBack;
    }
    onLoadTabHorizontal(item: Node, idx: number) {
        let item_sript: TaskTabItem = item.getComponent(TaskTabItem);
        item_sript.initPropsItem(this.tab_datas[idx]);
    }



    onTabListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!isValid(selectedId) || selectedId < 0 || !isValid(item)) { return; }
        let item_sript: TaskTabItem = item.getComponent(TaskTabItem);
        this.clearAllTabContent();
        item_sript.showSubItem = true;
        item_sript.name_lab.color = Color.WHITE;
        item_sript.updateSelectTabContent();
        if (this.callSelectCallback) {
            this.callSelectCallback(this.tab_datas[selectedId]);
        }
    }

    clearAllTabContent() {
        for (let index = 0; index < this.tab_scroll.numItems; index++) {
            let item = this.tab_scroll.getItemByListId(index);
            let item_script = item.getComponent(TaskTabItem);
            item_script.name_lab.color = color("#d2c1a8");
            item_script.clearTabContent();
        }
    }

    firstTabsUnselected(){
        let item = this.tab_scroll.getItemByListId(0);
        let item_script = item.getComponent(TaskTabItem);
        item_script.selectEvent();
    }

    onDestroy(): void {
        super.onDestroy();
        console.log("TaskTabView   onDestroy");
    }
}


