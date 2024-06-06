import { _decorator, Asset, Component, director, Label, Node, ProgressBar, sys } from 'cc';
import { SceneType } from '../config/PrefabType';
import { TextConfig } from '../config/TextConfig';
import GlobalConfig from '../GlobalConfig';
import { ViewsManager, ViewsMgr } from '../manager/ViewsManager';
import { HttpManager } from '../net/HttpManager';
import DownloaderUtil from '../util/DownloaderUtil';
const { ccclass, property } = _decorator;


class VersionCheck {
    version: string = "";
    url: string = "";
}

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

    @property(Asset)
    manifest: Asset = null;//版本文件
    //进度条
    @property(ProgressBar)
    public progressBar: ProgressBar = null;
    //进度文字
    @property(Label)
    public label: Label = null;
    @property(Label)
    public labelVer: Label = null;

    private _time: number = 0;//加载时间
    private _maxtime: number = 1.0;//最大加载时间
    private _downloaderUtil: DownloaderUtil = null;//下载器
    private _httpCheck: boolean = false;//http版本检测
    private _downCheck: boolean = false;//下载版本检测
    private _uiCheck: boolean = false;//ui版本检测

    start() {
        ViewsManager.instance.initLayer(this.sceneLayer, this.popupLayer, this.tipLayer, this.loadingLayer);
        this.labelVer.string = GlobalConfig.getVersionStr();
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
        this._uiCheck = true;
        this.checkVersionOver();
    }
    // 版本检测
    private checkVersion() {
        // director.preloadScene(SceneType.LoginScene);

        this.progressBar.progress = 0;

        this._time = 0;
        this._maxtime = 1.0;

        this.httpReqVersionCheck();
    }
    //版本检测完成
    checkVersionOver() {
        if (!this._uiCheck || !this._httpCheck || !this._downCheck) return;
        director.loadScene(SceneType.LoginScene);
    }
    /**http请求版本成功 */
    httpReqVersionCheckSuccess(data: VersionCheck) {
        console.log("httpReqVersionCheckSuccess", data.url);
        this._httpCheck = true;
        if (!sys.isNative || !data.url || "" == data.url) {
            this._downCheck = true;
            this.checkVersionOver();
            return;
        }

        this._downloaderUtil = new DownloaderUtil(this.manifest.nativeUrl, data.url);
        this.startDownload();
    }
    /**http请求版本失败 */
    httpReqVersionCheckFailed() {
        ViewsMgr.showAlert(TextConfig.Net_Error, this.httpReqVersionCheck.bind(this));
    }
    /**http请求版本 */
    httpReqVersionCheck() {
        HttpManager.reqVersionCheck(this.httpReqVersionCheckSuccess.bind(this), this.httpReqVersionCheckFailed.bind(this));
    }
    /**开始下载更新 */
    startDownload() {
        this._downloaderUtil.hotUpdate(this.updateSuccess.bind(this), this.updateFailed.bind(this), this.updateProgress.bind(this));
    }
    /**更新成功 */
    updateSuccess() {
        ViewsMgr.showAlert("更新成功，准备资源中");
    }
    /**更新失败 */
    updateFailed() {
        ViewsMgr.showAlert("更新失败，请检测网络后再重试", this.startDownload.bind(this));
    }
    /**更新进度 */
    updateProgress(num: number) {
        console.log("updateProgress", num);
        this.progressBar.progress = num;
    }
}


