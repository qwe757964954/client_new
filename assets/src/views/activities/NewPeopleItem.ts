import { _decorator, Label, Node, Sprite } from 'cc';
import ListItem from '../../util/list/ListItem';
import { ActConfig } from './ActivityConfig';
import { ActivityDayChinese } from './ActvityInfo';
const { ccclass, property } = _decorator;

@ccclass('NewPeopleItem')
export class NewPeopleItem extends ListItem {

    @property(Node)
    public bg:Node = null;

    @property(Node)
    public item:Node = null;

    @property(Label)
    public day_text:Label = null;

    @property(Label)
    public has_get_text:Label = null;

    @property(Node)
    public next_day:Node = null;

    @property(Node)
    public day_start:Node = null;

    start() {

    }

    updatePeopleItemProps(idx: number) {
        this.day_text.string = ActivityDayChinese[idx];
        let draw_length = ActConfig.activityInfoResponse.sign_status_list.length;
        let has_get = idx < draw_length;
        this.bg.getComponent(Sprite).grayscale = has_get;
        this.item.getComponent(Sprite).grayscale = has_get;
        this.has_get_text.node.active = has_get;
        this.next_day.active = idx === draw_length && !ActConfig.isTodayDayGreaterThanGivenDateDay();
        this.day_start.active = idx === draw_length && ActConfig.isTodayDayGreaterThanGivenDateDay();
    }
}

