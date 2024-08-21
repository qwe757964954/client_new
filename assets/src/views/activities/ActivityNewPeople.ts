import { _decorator, isValid, Node } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { ViewsMgr } from '../../manager/ViewsManager';
import { SignRewardDrawResponse } from '../../models/ActivityModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { ActServer } from '../../service/ActivityService';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ActConfig } from './ActivityConfig';
import { NewPeopleItem } from './NewPeopleItem';
const { ccclass, property } = _decorator;

@ccclass('ActivityNewPeople')
export class ActivityNewPeople extends BaseView {
    
    @property(List)
    public day_scroll:List = null;

    @property(Node)
    public sign_now:Node = null;

    @property(NewPeopleItem)
    public seven_item:NewPeopleItem = null;

    protected initUI(): void {
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [NetNotify.Classification_SignRewardDraw, this.onSignRewardDraw.bind(this)],
        ]);
    }

    updateData(){
        this.day_scroll.numItems = 6;
        this.seven_item.updatePeopleItemProps(6);
    }

    async onSignRewardDraw(response:SignRewardDrawResponse){
        ViewsMgr.showRewards(response.award);
        ActServer.reqGetActivityInfo();
    }
    protected initEvent(): void {
        CCUtil.onBtnClick(this.sign_now,this.onSignNowClick.bind(this));
        CCUtil.onTouch(this.seven_item.node,this.onSevenItemClick.bind(this));
    }
    protected removeEvent(): void {
        CCUtil.offTouch(this.seven_item.node, this.onSevenItemClick.bind(this))
    }

    onSevenItemClick(){
        let draw_length = ActConfig.activityInfoResponse.sign_status_list.length;
        let can_draw = 6 === draw_length;
        if(can_draw) {
            this.onSignNowClick();
        }
    }

    onSignNowClick(){
        if(!ActConfig.isTodayDayGreaterThanGivenDateDay()){
            ViewsMgr.showTip(TextConfig.Insufficient_Day_Sign);
            return;
        }
        ActServer.reqSignRewardDraw(); 
    }
    onLoadDayGrid(item:Node, idx:number){
        let item_sript:NewPeopleItem = item.getComponent(NewPeopleItem);
        item_sript.updatePeopleItemProps(idx);
    }

    onDayListGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onDayListGridSelected",selectedId);
        let draw_length = ActConfig.activityInfoResponse.sign_status_list.length;
        let can_draw = selectedId === draw_length;
        if(can_draw) {
            this.onSignNowClick();
        }
    }

}

