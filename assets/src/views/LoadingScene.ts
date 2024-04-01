import { _decorator, Component, director, Label, ProgressBar, sp } from 'cc';
import GlobalConfig from '../GlobalConfig';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends Component {
    //进度条
    @property(ProgressBar)
    progressBar:ProgressBar = null;
    //进度文字
    @property(Label)
    label:Label = null;

    private _time:number = 0;//加载时间
    private _maxtime:number = 5.0;//最大加载时间

    start() {
        this.checkVersion();
    }

    update(deltaTime: number) {
        if(this._time > this._maxtime) return;
        this._time += deltaTime;
        if(this._time < this._maxtime)  {
            let num = this._time/this._maxtime;
            this.progressBar.progress = num;
            this.label.string = `Loading...${Math.floor(num*100)}%`;
            return;
        }
        this.label.string = "Loading...100%";
        this.progressBar.progress = 1.0;
        this.checkVersionOver();
    }
    // 版本检测
    private checkVersion(){
        // director.preloadScene("MainScene");

        this.progressBar.progress = 0;

        this._time = 0;
        this._maxtime = 3.0;
    }
    //版本检测完成
    checkVersionOver() {
        // director.loadScene("MainScene");
    }
}


