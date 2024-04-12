import { MainScene } from "./MainScene";

// 基础控制器
export class MainBaseCtl {

    protected _mainScene:MainScene;//主场景
    constructor(mainScene:MainScene) {
        this._mainScene = mainScene;
    }
    // 摄像机缩放
    public onCameraScale(rate:number):void {
        
    }
    // 销毁
    public dispose(): void {
    }
}