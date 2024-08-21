import { _decorator, Component, Label, Node, ProgressBar, Slider, VideoPlayer } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { TimerMgr } from '../../util/TimerMgr';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;

@ccclass('VideoView')
export class VideoView extends Component {
    
    @property(Label)
    public titleTxt:Label = null;   // 标题
    @property(Label)
    public timeTxt:Label = null;    // 时长

    @property(VideoPlayer)
    public videoPlayer:VideoPlayer = null;      // 视频播放器
    
    @property(ProgressBar)
    public playProgress:ProgressBar = null;     // 进度条
    @property(Slider)
    public slider:Slider = null;                // 进度条

    @property(Node)
    public btnOn:Node = null;         // 播放on
    @property(Node)
    public btnOff:Node = null;        // 暂停off

    private _isEndPlay: boolean = false;    // 是否播放完
    private _loopID:number = 0;             // 验证码循环id

    start() {
        this.init();
    }

    //初始化
    public init():void {
        this._isEndPlay = false;
        this.initUI();
    }
    // 初始化UI
    initUI() {
        this.playVideo();
    }

    // 播放
    playVideo() {
        this.btnOff.active = true;
        this.btnOn.active = false;
        if (this._isEndPlay) {
            this.videoPlayer.currentTime = 0;
            this._isEndPlay = false;
        }
        this.videoPlayer.play();
    }
    // 暂停
    pauseVideo() {
        this.btnOff.active = false;
        this.btnOn.active = true;
        this.videoPlayer.pause();
    }

    // 关闭
    btnCloseFunc() {
        console.log("btnCloseFunc");
        ViewsMgr.closeView(PrefabType.VideoView);
    }
    // 关闭
    btnResumePauseFunc(event: Event, customEventData: string) {
        console.log("btnResumePauseFunc customEventData = ", customEventData);
        if (customEventData == "On") {
            // 播放
            this.playVideo();
        }
        else if (customEventData == "Off") {
            // 暂停
            this.pauseVideo();
        }
    }
    // 视频播放器回调
    videoFunc(event: Event, customEventData: string) {
        console.log("videoFunc customEventData = ", customEventData);
        switch (customEventData) {
            // 暂停
            case "paused":
                this.stopRefresh();
                break;
            case "playing":
                this.startRefresh();
                break;
            case "stopped":
                break;
            case "completed":
                this._isEndPlay = true;
                this.pauseVideo();
                break;
            case "meta-loaded":
                this.timeTxt.string = "00:00 / " + ToolUtil.secondsToTimeFormat(Math.ceil(this.videoPlayer.duration));
                break;
            case "error":
                console.log("videoFunc error");
                break;
            default:
                break;
        }
    }
    // 滑动器回调
    sliderFunc() {
        console.log("sliderFunc");
        let curTime = this.slider.progress * this.videoPlayer.duration;
        this.videoPlayer.currentTime = curTime;
        this.playProgress.progress = this.slider.progress;
    }

    // 开启定时器刷新时间和进度条
    startRefresh() {
        this.stopRefresh();
        this._loopID = TimerMgr.loop(() => {
            let curTime = ToolUtil.secondsToTimeFormat(Math.ceil(this.videoPlayer.currentTime));
            let duration = ToolUtil.secondsToTimeFormat(Math.ceil(this.videoPlayer.duration));
            this.timeTxt.string = curTime + " / " + duration;

            let ratio = this.videoPlayer.currentTime / this.videoPlayer.duration;
            this.slider.progress = ratio;
            this.playProgress.progress = ratio;
        }, 100);
    }
    stopRefresh() {
        if (this._loopID > 0) {
            TimerMgr.stopLoop(this._loopID);
            this._loopID = 0;
        }
    }
}


