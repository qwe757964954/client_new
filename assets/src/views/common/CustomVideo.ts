import { _decorator, Component, director, instantiate, Label, Node, Slider, Sprite, SpriteFrame, UITransform, VideoPlayer, Widget } from 'cc';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import { ToolUtil } from '../../util/ToolUtil';
import { ViewsMgr } from '../../manager/ViewsManager';
import GlobalConfig from '../../GlobalConfig';
const { ccclass, property } = _decorator;

@ccclass('CustomVideo')
export class CustomVideo extends BaseView {
    @property(VideoPlayer)
    videoPlayer: VideoPlayer = null;
    @property(Slider)
    slider: Slider = null;
    @property(UITransform)
    progressBg: UITransform = null;
    @property(UITransform)
    progressBar: UITransform = null;
    @property(Label)
    timeLabel: Label = null;
    @property(Node)
    playBtn: Node = null;
    @property(Node)
    fullscreenBtn: Node = null;
    @property([SpriteFrame])
    sprites: SpriteFrame[] = [];
    @property(Node)
    volumeBtn: Node = null;
    @property(Node)
    volNode: Node = null;
    @property(Slider)
    volumeSlider: Slider = null;
    @property(Node)
    loadingNode: Node = null;

    private _url: string;
    private _isReady: boolean = false;

    private _isFullscreen: boolean = false;

    private _oldParent: Node;

    protected onEnable(): void {
        if (this.node.parent) {
            let parentTf = this.node.parent.getComponent(UITransform);
            let tf = this.node.getComponent(UITransform);
            tf.width = parentTf.width;
            tf.height = parentTf.height;
            this.node.getComponent(Widget).updateAlignment();
            console.log("w,h", tf.width, tf.height);
        }
    }

    onVideoEvent(videoplayer: VideoPlayer, eventType: string) {
        if (eventType == VideoPlayer.EventType.READY_TO_PLAY) {
            this.loadingNode.active = false;
            this._isReady = true;
            this.timeLabel.string = `${ToolUtil.secondsToTimeFormat(Math.ceil(this.videoPlayer.currentTime))}/${ToolUtil.secondsToTimeFormat(Math.ceil(this.videoPlayer.duration))}`;
        } else if (eventType == VideoPlayer.EventType.COMPLETED) {
            this.videoPlayer.currentTime = 0;
            this.slider.progress = 0;
            this.progressBar.width = 0;
            this.timeLabel.string = `${ToolUtil.secondsToTimeFormat(Math.ceil(this.videoPlayer.currentTime))}/${ToolUtil.secondsToTimeFormat(Math.ceil(this.videoPlayer.duration))}`;
        }
    }

    setVideoUrl(url: string) {
        this._isReady = false;
        this.slider.progress = 0;
        this._url = url;
        this.videoPlayer.remoteURL = url;
        this.loadingNode.active = true;
    }

    onPlayBtnClick() {
        if (!this._isReady) return;
        if (this.videoPlayer.isPlaying) {
            this.videoPlayer.pause();
            this.playBtn.getComponent(Sprite).spriteFrame = this.sprites[0];
        } else {
            this.videoPlayer.play();
            this.playBtn.getComponent(Sprite).spriteFrame = this.sprites[1];
        }
    }

    onSliderChange(slider: Slider) {
        if (!this._isReady) return;
        this.videoPlayer.currentTime = this.videoPlayer.duration * this.slider.progress;
        this.timeLabel.string = `${ToolUtil.secondsToTimeFormat(Math.ceil(this.videoPlayer.currentTime))}/${ToolUtil.secondsToTimeFormat(Math.ceil(this.videoPlayer.duration))}`;
        this.progressBar.width = this.progressBg.width * this.slider.progress;
    }

    onVolumeSliderChange(slider: Slider) {
        this.videoPlayer.volume = slider.progress;
        if (slider.progress == 0) {
            this.volumeBtn.getComponent(Sprite).spriteFrame = this.sprites[5];
        } else {
            this.volumeBtn.getComponent(Sprite).spriteFrame = this.sprites[4];
        }
    }

    protected update(dt: number): void {
        if (!this._isReady) return;
        if (this.videoPlayer.isPlaying) {
            this.timeLabel.string = `${ToolUtil.secondsToTimeFormat(Math.ceil(this.videoPlayer.currentTime))}/${ToolUtil.secondsToTimeFormat(Math.ceil(this.videoPlayer.duration))}`;
            this.slider.progress = this.videoPlayer.currentTime / this.videoPlayer.duration;
            this.progressBar.width = this.progressBg.width * this.slider.progress;
        }
    }

    onFullscreenBtnClick() {
        this._isFullscreen = !this._isFullscreen;
        if (this._isFullscreen) {
            this.videoPlayer.pause();
            this.fullscreenBtn.getComponent(Sprite).spriteFrame = this.sprites[3];
            this._oldParent = this.node.parent;
            this.node.removeFromParent();
            ViewsMgr.popupLayer.addChild(this.node);
        } else {
            this._oldParent.addChild(this.node);
            this.fullscreenBtn.getComponent(Sprite).spriteFrame = this.sprites[2];
        }
    }

    onVolumeBtnClick() {
        // this.volNode.active = !this.volNode.active;
        this.videoPlayer.mute = !this.videoPlayer.mute;
        if (this.videoPlayer.mute) {
            this.volumeBtn.getComponent(Sprite).spriteFrame = this.sprites[5];
        } else {
            this.volumeBtn.getComponent(Sprite).spriteFrame = this.sprites[4];
        }
    }

    reset() {
        this.videoPlayer.remoteURL = "";
        this.videoPlayer.currentTime = 0;
        this.slider.progress = 0;
        this.progressBar.width = 0;
        this.timeLabel.string = "00:00/00:00";
        this.playBtn.getComponent(Sprite).spriteFrame = this.sprites[0];
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.playBtn, this.onPlayBtnClick, this);
        CCUtil.onTouch(this.fullscreenBtn, this.onFullscreenBtnClick, this);
        CCUtil.onTouch(this.volumeBtn, this.onVolumeBtnClick, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.playBtn, this.onPlayBtnClick, this);
        CCUtil.offTouch(this.fullscreenBtn, this.onFullscreenBtnClick, this);
        CCUtil.offTouch(this.volumeBtn, this.onVolumeBtnClick, this);
    }
}


