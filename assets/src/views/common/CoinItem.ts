import { _decorator, Component, Label, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('CoinItem')
export class CoinItem extends Component {
    @property(Label)
    public label:Label = null;

    private _coinUpdateHandle:string = null;//金币更新事件句柄

    start() {
        this.initEvent();
    }
    //初始化事件
    public initEvent(){
        CCUtil.onTouch(this, this.onClick, this);
        this._coinUpdateHandle = EventManager.on(EventType.Coin_Update, this.onCoinUpdate.bind(this));
    }
    //销毁事件
    public destoryEvent(){
        CCUtil.offTouch(this, this.onClick, this);
        EventManager.off(EventType.Coin_Update, this._coinUpdateHandle);
    }
    //界面点击 TODO
    public onClick(){
        console.log("EnergyItem onClick");
    }
    //金币更新 TODO
    public onCoinUpdate(){
        // this.label.string = GlobalConfig.energy.toString();
    }
}


