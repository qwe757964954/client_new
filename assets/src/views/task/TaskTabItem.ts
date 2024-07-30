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

    @property(Node)
    red_point:Node = null;
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
        this.animateRotation(this.tab_focus,to_angles);
    }

    initPropsItem(info:TaskTabInfo) {
        this._tab_info = info;
        this.name_lab.string = this._tab_info.title;
        this.red_point.active = this._tab_info.red_point || false;
        this._start_height = this.node.getChildByName("btn_ash").getComponent(UITransform).height;
    }

    clearTabContent(){
        this.animateHeightChange(this.sub_scroll.scrollView, 0);
        this.animateHeightChange(this.sub_scroll.scrollView.view, 0);
        this.animateHeightChange(this.node, this._start_height);
    }

    updateSelectTabContent(){
        let to_numItems = this._showSubItem ? this._tab_info.subTabItems.length : 0;
        this.sub_scroll.numItems = to_numItems;
        let calculate_height = to_numItems * sub_item_height;
        this.animateHeightChange(this.sub_scroll.scrollView, calculate_height);
        this.animateHeightChange(this.sub_scroll.scrollView.view, calculate_height);
        this.animateHeightChange(this.node, calculate_height + this._start_height);
        this.sub_scroll.selectedId = 0;
        this.tab_focus.active = this._tab_info.subTabItems.length > 0;
        this.animateRotation(this.tab_focus,0);
    }

    animateHeightChange(node: any, height: number) {
        if (node && node.isValid) {
            tween(node.getComponent(UITransform))
                .to(0.1, { height: height })
                .start();
        }
    }

    animateRotation(node: Node, toAngles: number) {
        if (node && node.isValid) {
            tween(node)
                .to(0.1, { eulerAngles: v3(0, 0, toAngles) })
                .start();
        }
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


