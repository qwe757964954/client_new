import { _decorator, Component, Label, Sprite, SpriteFrame } from 'cc';
import { PetMoodInfo } from '../../config/PetConfig';
import { DataMgr } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { TimerMgr } from '../../util/TimerMgr';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;

@ccclass('PetMoodView')
export class PetMoodView extends Component {
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Label)
    public label: Label = null;//文字
    @property(Sprite)
    public bg: Sprite = null;//背景
    @property([SpriteFrame])
    public spriteFrames: SpriteFrame[] = [];//图片资源

    private _moodInfo: PetMoodInfo = null;//心情信息
    private _moodScore: number = null;//心情分
    private _timer: number = null;//计时器

    protected onDestroy(): void {
        this.clearTimer();
    }
    private clearTimer() {
        if (this._timer) {
            TimerMgr.stop(this._timer);
            this._timer = null;
        }
    }

    init(moodScore: number) {
        let config = DataMgr.getMoodConfig(moodScore);
        if (!config) return;
        console.log("PetMoodView init", moodScore, config);
        let limitScore = config.minscore;
        if (0 != limitScore && moodScore == limitScore) {
            this.bg.spriteFrame = this.spriteFrames[1];
        } else {
            this.bg.spriteFrame = this.spriteFrames[0];
        }
        if (this._moodScore != moodScore) {
            this.label.string = ToolUtil.getRandomItem(config.text);
            this._moodScore = moodScore;
            if (0 != limitScore && moodScore == limitScore) {
                this.clearTimer();
                let tmpConfig = DataMgr.getMoodConfig(moodScore - 1);
                if (tmpConfig) {
                    this.label.string = ToolUtil.getRandomItem(tmpConfig.text);
                }
            }
        }
        if (config != this._moodInfo) {
            this._moodInfo = config;
            LoadManager.loadSprite(ToolUtil.getRandomItem(config.png), this.img);
        }
        this.timeShow();
    }

    private timeShow() {
        if (this._timer) return;
        this.node.active = true;
        let limitScore = this._moodInfo.minscore;
        if (0 != limitScore && this._moodScore == limitScore) return;
        this._timer = TimerMgr.once(() => {
            this.node.active = false;
            this._timer = TimerMgr.once(() => {
                this.clearTimer();
                this.timeShow();
            }, 60000);
        }, 3000);
    }
}


