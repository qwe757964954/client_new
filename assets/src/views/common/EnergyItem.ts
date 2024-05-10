import { _decorator, Component, Label } from 'cc';
import { EventType } from '../../config/EventType';
import { User } from '../../models/User';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
const { ccclass, property } = _decorator;

@ccclass('EnergyItem')
export class EnergyItem extends Component {
    @property(Label)
    public label: Label = null;

    private _energyUpdateHandle: string = null;//体力更新事件句柄

    start() {
        this.initEvent();
        this.onEnergyUpdate();
    }
    protected onDestroy(): void {
        this.destoryEvent();
    }
    //初始化事件
    public initEvent() {
        CCUtil.onTouch(this, this.onClick, this);
        this._energyUpdateHandle = EventManager.on(EventType.Stamina_Update, this.onEnergyUpdate.bind(this));
    }
    //销毁事件
    public destoryEvent() {
        CCUtil.offTouch(this, this.onClick, this);
        EventManager.off(EventType.Stamina_Update, this._energyUpdateHandle);
    }
    //界面点击
    public onClick() {
        console.log("EnergyItem onClick");
    }
    //体力更新
    public onEnergyUpdate() {
        this.label.string = User.stamina.toString();
    }
}


