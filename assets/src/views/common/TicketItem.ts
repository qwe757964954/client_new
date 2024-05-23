import { _decorator, Component, Label } from 'cc';
import { EventType } from '../../config/EventType';
import { User } from '../../models/User';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
const { ccclass, property } = _decorator;

@ccclass('TicketItem')
export class TicketItem extends Component {
    @property(Label)
    public label: Label = null;

    private _tikcetUpdateHandle: string = null;//奖券更新事件句柄

    start() {
        this.initEvent();
        this.onTicketUpdate();
    }
    protected onDestroy(): void {
        this.destoryEvent();
    }
    //初始化事件
    public initEvent() {
        CCUtil.onTouch(this, this.onClick, this);
        this._tikcetUpdateHandle = EventMgr.on(EventType.Coin_Update, this.onTicketUpdate.bind(this));
    }
    //销毁事件
    public destoryEvent() {
        CCUtil.offTouch(this, this.onClick, this);
        EventMgr.off(EventType.Coin_Update, this._tikcetUpdateHandle);
    }
    //界面点击 TODO
    public onClick() {
        console.log("TicketItem onClick");
    }
    //金币更新 TODO
    public onTicketUpdate() {
        this.label.string = User.coin.toString();
    }
}


