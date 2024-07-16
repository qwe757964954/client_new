import { _decorator, Component, Label, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import { TimerMgr } from '../../util/TimerMgr';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;
/**倒计时框 加速按钮 */
@ccclass('CountdownFrame')
export class CountdownFrame extends Component {
    @property(Node)
    public btnSpeed: Node = null;//加速按钮
    @property(Label)
    public labelTime: Label = null;//倒计时

    private _timer: number = 0;//定时器
    private _time: number = 0;//剩余时间
    private _totalTime: number = 0;//总时间
    private _reqCall: Function = null;//请求回调

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.clearTimer();
        this.removeEvent();
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.btnSpeed, this.onBtnSpeedClick, this);
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.btnSpeed, this.onBtnSpeedClick, this);
    }
    /**初始化 */
    init(time: number, reqCall?: Function, callBack?: Function) {
        this._time = Math.floor(time);
        this._totalTime = Math.floor(time);
        this._reqCall = reqCall;

        this.showTime();
        this.clearTimer();
        this._timer = TimerMgr.loop(() => {
            this._time--;
            if (this._time < 0) {
                this.clearTimer();
                if (callBack) callBack(this.node);
                return;
            }
            this.showTime();
        }, 1000);
    }
    /**加速按钮点击 */
    onBtnSpeedClick() {
        if (this._reqCall) this._reqCall();
    }
    /**清理定时器 */
    clearTimer() {
        if (!this._timer) return;
        TimerMgr.stopLoop(this._timer);
        this._timer = null;
    }
    /**显示时间 */
    showTime() {
        this.labelTime.string = "剩余" + ToolUtil.getSecFormatStr(this._time);
    }
}


