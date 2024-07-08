import { Label, Node, UITransform, _decorator, isValid, tween, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import ListItem from '../../util/list/ListItem';
import { TaskTabInfo } from './TaskInfo';
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
    
    private _showSubItem:boolean = false;
    private _start_height:number = 0;
    private _tab_info:TaskTabInfo = null;
    start(): void {
        this.initEvent();
    }

    initEvent(){
        CCUtil.onBtnClick(this.btn_select, ()=>{
            this.selectEvent();
        });
    }

    set showSubItem(value:boolean){
        this._showSubItem = value;
    }

    selectEvent(){
        this._showSubItem = !this._showSubItem;
        this.clearTabContent();
        this.updateSelectTabContent();    
        let to_angles = this._showSubItem ? 0 : 180;
        tween(this.tab_focus).to(0.3, {eulerAngles: v3(0, 0, to_angles)}).start();
    }

    initPropsItem(info:TaskTabInfo) {
        this._tab_info = info;
        this.name_lab.string = this._tab_info.title;
        this._start_height = this.node.getChildByName("btn_ash").getComponent(UITransform).height;
    }

    clearTabContent(){
        this.sub_scroll.scrollView.getComponent(UITransform).height = 0;
        this.sub_scroll.scrollView.view.getComponent(UITransform).height = 0;
        this.node.getComponent(UITransform).height = this._start_height;
    }

    updateSelectTabContent(){
        let to_numItems = this._showSubItem ? this._tab_info.subTabItems.length : 0;
        this.sub_scroll.numItems = to_numItems;
        let calculate_height = to_numItems * sub_item_height;
        this.sub_scroll.scrollView.getComponent(UITransform).height = calculate_height;
        this.sub_scroll.scrollView.view.getComponent(UITransform).height = calculate_height;
        this.node.getComponent(UITransform).height = calculate_height + this._start_height;
        this.sub_scroll.selectedId = 0;
        this.tab_focus.active = this._tab_info.subTabItems.length > 0;
        tween(this.tab_focus).to(0.3, {eulerAngles: v3(0, 0, 0)}).start();
    }

    onLoadSubItemVertical(item:Node, idx:number){
        let item_sript:TaskTabSubItem = item.getComponent(TaskTabSubItem);
        item_sript.initPropsItem(this._tab_info.subTabItems[idx]);
    }

    onSubItemListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        EventMgr.dispatch(EventType.Sub_Tab_Item_Click,this._tab_info.subTabItems[selectedId]);
    }

}


