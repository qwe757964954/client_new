import { Vec2 } from "cc";


export class ToolUtil {
    /**
     * 替换文本描述 {0}{1}{2}....
     * @param str 
     * @param args 参数
     */
    static replace(str: string, ...args: (string | number)[]): string {
        if (str === null || str === undefined) {
            console.error("参数错误！");
            return "";
        }
        return str.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? String(args[number]) : match;
        });
    }
    // 两个向量相减
    static vec2Sub(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(a.x - b.x, a.y - b.y);
    }

    // 将秒转换成时间格式
    static secondsToTimeFormat(seconds: number): string {
        // let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secs = seconds % 60;
     
        // hours = hours < 10 ? '0' + hours : hours;
        // return hours + ':' + minutes + ':' + secs;
        
        return (minutes < 10 ? '0' + minutes : minutes) + ':' + (secs < 10 ? '0' + secs : secs);
    }
}
