import { _decorator, Component, Label, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { User } from '../../models/User';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { TimerMgr } from '../../util/TimerMgr';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;

@ccclass('EnergyItem')
export class EnergyItem extends Component {
    @property(Label)
    public label: Label = null;
    @property(Label)
    public labelTime: Label = null;
    @property(Node)
    public nodeTime: Node = null;

    private _energyUpdateHandle: string = null;//体力更新事件句柄
    private _timeUpdateHandle: string = null;//体力时间更新事件句柄
    private _timer: number = null;//体力更新计时器

    start() {
        this.initEvent();
        this.onEnergyUpdate();
        this.onStaminaTimeUpdate();
    }
    protected onDestroy(): void {
        this.destoryEvent();
        this.clearTimer();
    }
    /**清理定时器 */
    public clearTimer() {
        if (this._timer) {
            TimerMgr.stopLoop(this._timer);
            this._timer = null;
        }
    }
    //初始化事件
    public initEvent() {
        CCUtil.onTouch(this, this.onClick, this);
        this._energyUpdateHandle = EventManager.on(EventType.Stamina_Update, this.onEnergyUpdate.bind(this));
        this._timeUpdateHandle = EventManager.on(EventType.Stamina_Timer_Update, this.onStaminaTimeUpdate.bind(this));
        this.clearTimer();
        this._timer = TimerMgr.loop(this.onStaminaTimeUpdate.bind(this), 1000);
    }
    //销毁事件
    public destoryEvent() {
        CCUtil.offTouch(this, this.onClick, this);
        EventManager.off(EventType.Stamina_Update, this._energyUpdateHandle);
        EventManager.off(EventType.Stamina_Timer_Update, this._timeUpdateHandle);
    }
    //界面点击
    public onClick() {
        console.log("EnergyItem onClick");
    }
    //体力更新
    public onEnergyUpdate() {
        this.label.string = User.stamina.toString();
    }
    /**体力时间更新 */
    public onStaminaTimeUpdate() {
        let leftTime = User.getStaminaLeftTime();
        if (null == leftTime) {
            this.nodeTime.active = false;
            return;
        }
        this.nodeTime.active = true;
        this.labelTime.string = ToolUtil.secondsToTimeFormat(leftTime);
    }
}


