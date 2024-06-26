import { _decorator, Component, Node } from 'cc';
import AudioUtil from '../../util/AudioUtil';
const { ccclass, property } = _decorator;

@ccclass('SoundView')
export class SoundView extends Component {
    
    @property(Node)
    public musicOn:Node = null;         // 背景音乐on
    @property(Node)
    public musicOff:Node = null;        // 背景音乐off
    
    @property(Node)
    public effectOn:Node = null;        // 动作音效on
    @property(Node)
    public effectOff:Node = null;       // 动作音效off
    
    @property(Node)
    public YingOn:Node = null;          // 英打开
    @property(Node)
    public MeiOn:Node = null;           // 美打开

    start() {
        this.init();
    }

    //销毁
    protected onDestroy(): void {
        // this.destoryEvent();
    }
    //初始化
    public init():void {
        this.initUI();
        // this.initEvent();
    }
    // 初始化UI
    initUI() {
        // 默认开
        this.musicOn.active = AudioUtil.instance.musicSwich;
        this.musicOff.active = !AudioUtil.instance.musicSwich;
        this.effectOn.active = AudioUtil.instance.effectSwich;
        this.effectOff.active = !AudioUtil.instance.effectSwich;
        // 默认英
        this.MeiOn.active = false;
        this.YingOn.active = true;
    }
    //初始化事件
    public initEvent(){
        // CCUtil.onTouch(this.centerTab, this.onClickCenter, this);
    }
    //销毁事件
    public destoryEvent(){
        // CCUtil.offTouch(this.btnHead, this.onClickHead, this);
    }

    // 背景音乐开关
    btnMusicSwitchFunc(data: Event, customEventData: string) {
        console.log("btnChangeHeadFunc customEventData = ", customEventData);
        if (customEventData == "On") {
            // 关
            this.musicOff.active = true;
            this.musicOn.active = false;
            AudioUtil.instance.musicSwich = false;
            AudioUtil.instance.pauseMusic();
        }
        else if (customEventData == "Off") {
            // 开
            this.musicOff.active = false;
            this.musicOn.active = true;
            AudioUtil.instance.musicSwich = true;
            AudioUtil.instance.resumeMusic();
        }
    }
    // 动作音效开关
    btnEffectSwitchFunc(data: Event, customEventData: string) {
        console.log("btnChangeNameFunc customEventData = ", customEventData);
        if (customEventData == "On") {
            // 关
            this.effectOff.active = true;
            this.effectOn.active = false;
            AudioUtil.instance.effectSwich = false;
        }
        else if (customEventData == "Off") {
            // 开
            this.effectOff.active = false;
            this.effectOn.active = true;
            AudioUtil.instance.effectSwich = true;
        }
    }
    // 切换英美音
    btnChangeYingMeiFunc() {
        console.log("btnLookTitleInfoFunc");
        if (this.YingOn.active) {
            // 切换美
            this.MeiOn.active = true;
            this.YingOn.active = false;
        }
        else {
            // 切换英
            this.MeiOn.active = false;
            this.YingOn.active = true;
        }
    }
}


