import { EventMgr } from "../../util/EventManager";
import { MainScene } from "./MainScene";

// 基础控制器
export class MainBaseCtl {

    protected _mainScene: MainScene;//主场景
    constructor(mainScene: MainScene, callBack?: Function) {
        this._mainScene = mainScene;
        console.log(this.constructor.name + " constructor");
        if (callBack) callBack();
    }
    // 摄像机缩放
    public onCameraScale(rate: number): void {

    }
    // 销毁
    public dispose(): void {
    }


    private _eventlistener = {};
    public addEvent(name: string, callback: Function) {
        this.delEvent(name);
        this._eventlistener[name] = EventMgr.on(name, callback);
    }
    public delEvent(name: string) {
        if (Object.prototype.hasOwnProperty.call(this._eventlistener, name)) {
            EventMgr.off(name, this._eventlistener[name])
            this._eventlistener[name] = null;
        }
    }
    public clearEvent() {
        for (let event in this._eventlistener) {
            this.delEvent(event);
        }
        this._eventlistener = {};
    }
}