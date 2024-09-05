import { _decorator, Component, Label, Node, VideoPlayer } from 'cc';
import { BaseView } from '../../script/BaseView';
const { ccclass, property } = _decorator;

@ccclass('SymbolPanel')
export class SymbolPanel extends BaseView {
    @property(VideoPlayer)
    videoPlayer: VideoPlayer = null;
    @property(Label)
    playMsgLabel: Label = null;
    @property(Label)
    resultTipLabel: Label = null;
    @property(Label)
    yuanyinLabel: Label = null;
    @property(Label)
    fuyinLabel: Label = null;
    @property(Node)
    recordNode: Node = null;
    @property(Node)
    mySoundNode: Node = null;
    @property(Label)
    scoreLabel: Label = null;
    @property(Label)
    topScoreLabel: Label = null;
    @property(Node)
    public nodeContent: Node = null;

    protected initUI(): void {
        this.videoPlayer.remoteURL = "https://www.chuangciyingyu.com/assets/videos/course/letterMusic.mp4";
    }

    protected initEvent(): void {

    }

    protected removeEvent(): void {

    }
}


