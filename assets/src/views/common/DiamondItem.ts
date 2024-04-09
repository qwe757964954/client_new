import { _decorator, Component, Label, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('DiamondItem')
export class DiamondItem extends Component {
    @property(Label)
    public label:Label = null;

    private _diamondUpdateHandle:string = null;//金币更新事件句柄

    start() {
        this.initEvent();
    }
    //初始化事件
    public initEvent(){
        CCUtil.onTouch(this, this.onClick, this);
        this._diamondUpdateHandle = EventManager.on(EventType.Diamond_Update, this.onDiamondUpdate.bind(this));
    }
    //销毁事件
    public destoryEvent(){
        CCUtil.offTouch(this, this.onClick, this);
        EventManager.off(EventType.Diamond_Update, this._diamondUpdateHandle);
    }
    //界面点击
    public onClick(){
        console.log("EnergyItem onClick");
    }
    //钻石更新
    public onDiamondUpdate(){
        // this.label.string = GlobalConfig.energy.toString();
    }
}


