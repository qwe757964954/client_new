import { Label, Node, UITransform, _decorator, isValid, tween, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import CCUtil from '../../util/CCUtil';
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

    @property(Node)
    btn_select:Node = null;


    @property(Node)
    tab_focus:Node = null;
    

    private _start_height:number = 0;

    private _tabSelectIdx:number = 0;

    start(): void {
        // this.sub_scroll.numItems = 0;
        this.initEvent();
    }

    initEvent(){
        CCUtil.onBtnClick(this.btn_select, ()=>{
            this.selectEvent();
        });
    }

    selectEvent(){
        if(this._tabSelectIdx === 0){
            let now_numItems = this.sub_scroll.numItems;
            let to_numItems = now_numItems === 0 ? AchevementRewardInfos.length : 0;
            this.sub_scroll.numItems = to_numItems;
            if(to_numItems === 0){
                this.clearTabContent();
            }else{
                this.updateSelectTabContent(this._tabSelectIdx);
            }
        }
        let now_angles = this.tab_focus.eulerAngles;
        let to_angles = now_angles.z === 0 ? 180 : 0;
        tween(this.tab_focus).to(0.3, {eulerAngles: v3(0, 0, to_angles)}).start();
    }

    initPropsItem(idx:number) {
        this._tabSelectIdx = idx;
        this.name_lab.string = TaskTabInfos[idx].title;
        this._start_height = this.node.getChildByName("btn_ash").getComponent(UITransform).height;
        // if (idx === 0) {
        //     this.sub_scroll.numItems = AchevementRewardInfos.length;
        // }else{
            
        // }
        
    }

    clearTabContent(){
        this.sub_scroll.scrollView.getComponent(UITransform).height = 0;
        this.sub_scroll.scrollView.view.getComponent(UITransform).height = 0;
        this.node.getComponent(UITransform).height = this._start_height;
    }

    updateSelectTabContent(idx: number){
        if (idx === 0) {
            this.sub_scroll.numItems = AchevementRewardInfos.length;
            let calculate_height = AchevementRewardInfos.length * sub_item_height;
            this.sub_scroll.scrollView.getComponent(UITransform).height = calculate_height;
            this.sub_scroll.scrollView.view.getComponent(UITransform).height = calculate_height;
            this.node.getComponent(UITransform).height = calculate_height + this._start_height;
            this.sub_scroll.selectedId = 0;
        }else{
            this.sub_scroll.numItems = 0;
        }
        tween(this.tab_focus).to(0.3, {eulerAngles: v3(0, 0, 0)}).start();
    }

    onLoadSubItemVertical(item:Node, idx:number){
        let item_sript:TaskTabSubItem = item.getComponent(TaskTabSubItem);
        item_sript.initPropsItem(idx);
    }

    onSubItemListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        EventMgr.dispatch(EventType.Sub_Tab_Item_Click,AchevementRewardInfos[selectedId]);
    }

}


