import { TimerMgr } from "./TimerMgr";

/**超时bool类 */
export class TimeOutBool {
    private _time: number = 0;//超时时间
    private _value: boolean = false;//值
    private _timer: number = null;//定时器

    constructor(time: number) {
        this._time = time;
    }

    get value(): boolean {
        return this._value;
    }

    set value(value: boolean) {
        if (this._value != value) {
            this._value = value;
            if (this._value) {
                this.clearTimer();
                this._timer = TimerMgr.once(() => {
                    this._value = false;
                }, this._time);
            } else {
                this.clearTimer();
            }
        }
    }

    clearTimer() {
        if (this._timer) {
            TimerMgr.stop(this._timer);
            this._timer = null;
        }
    }


}