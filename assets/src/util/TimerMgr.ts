// 时间调度器
export class TimerMgr {
    //调用一次
    public static once(func:Function, time:number):number {
        return setTimeout(func, time);
    }
    // 循环调用
    public static loop(func:Function, time:number):number {
        return setInterval(func, time);
    }
    // 停止
    public static stop(timerId:number) {
        clearTimeout(timerId);
    }
    public static stopLoop(timerId:number) {
        clearInterval(timerId);
    }
}