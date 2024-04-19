import { _decorator, Component, director, Label, Node, ProgressBar, sp } from 'cc';
import GlobalConfig from '../GlobalConfig';
import { SceneType } from '../config/PrefabType';
import { ViewsManager } from '../manager/ViewsManager';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends Component {
    @property(Node)
    public sceneLayer: Node = null;//场景层
    @property(Node)
    public popupLayer: Node = null;//弹窗层
    @property(Node)
    public tipLayer: Node = null;//提示层
    @property(Node)
    public loadingLayer: Node = null;//加载层

    //进度条
    @property(ProgressBar)
    progressBar: ProgressBar = null;
    //进度文字
    @property(Label)
    label: Label = null;

    private _time: number = 0;//加载时间
    private _maxtime: number = 5.0;//最大加载时间

    start() {
        ViewsManager.instance.initLayer(this.sceneLayer, this.popupLayer, this.tipLayer, this.loadingLayer);
        this.checkVersion();
    }

    update(deltaTime: number) {
        if (this._time > this._maxtime) return;
        this._time += deltaTime;
        if (this._time < this._maxtime) {
            let num = this._time / this._maxtime;
            this.progressBar.progress = num;
            this.label.string = `Loading...${Math.floor(num * 100)}%`;
            return;
        }
        this.label.string = "Loading...100%";
        this.progressBar.progress = 1.0;
        this.checkVersionOver();
    }
    // 版本检测
    private checkVersion() {
        // director.preloadScene(SceneType.LoginScene);

        this.progressBar.progress = 0;

        this._time = 0;
        this._maxtime = 3.0;
    }
    //版本检测完成
    checkVersionOver() {
        director.loadScene(SceneType.LoginScene);
    }
}


