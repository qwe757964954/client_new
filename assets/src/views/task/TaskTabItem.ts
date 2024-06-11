import { Label, Node, UITransform, _decorator, isValid } from 'cc';
import { EventType } from '../../config/EventType';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import ListItem from '../../util/list/ListItem';
import { AchevementRewardInfos, TaskTabInfos } from './TaskInfo';
import { TaskTabSubItem } from './TaskTabSubItem';
const { ccclass, property } = _decorator;


const sub_item_height:number = 72;

@ccclass('TaskTabItem')
export class TaskTabItem extends ListItem {
    @property(Label)
    name_lab:Label = null;

    @property(List)
    sub_scroll:List = null;

    private _start_height:number = 0;

    start(): void {
        // this.sub_scroll.numItems = 0;
    }

    initPropsItem(idx:number) {
        this.name_lab.string = TaskTabInfos[idx].title;
        this._start_height = this.node.getChildByName("btn_ash").getComponent(UITransform).height;
        if (idx === 0) {
            this.sub_scroll.numItems = AchevementRewardInfos.length;
        }else{
            this.sub_scroll.numItems = 0;
        }
        
    }

    clearTabContent(){
        this.sub_scroll.scrollView.getComponent(UITransform).height = 0;
        this.sub_scroll.scrollView.view.getComponent(UITransform).height = 0;
        this.node.getComponent(UITransform).height = this._start_height;
    }

    updateSelectTabContent(idx: number){
        if (idx === 0) {
            let calculate_height = AchevementRewardInfos.length * sub_item_height;
            this.sub_scroll.scrollView.getComponent(UITransform).height = calculate_height;
            this.sub_scroll.scrollView.view.getComponent(UITransform).height = calculate_height;
            this.node.getComponent(UITransform).height = calculate_height + this._start_height;
            this.sub_scroll.selectedId = 0;
        }
    }

    onLoadSubItemVertical(item:Node, idx:number){
        let item_sript:TaskTabSubItem = item.getComponent(TaskTabSubItem);
        item_sript.initPropsItem(idx);
    }

    onSubItemListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onSubItemListHorizontalSelected",selectedId);
        EventMgr.dispatch(EventType.Sub_Tab_Item_Click,AchevementRewardInfos[selectedId]);
    }

}


