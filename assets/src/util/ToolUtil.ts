import { Node, UIOpacity, Vec2, Vec3, tween } from "cc";
import { PropID } from "../config/PropConfig";
import { PropData } from "../manager/DataMgr";

const Time_S = "{0}秒"
const Time_M = "{0}分钟"
const Time_M_S = "{0}分钟{1}秒"

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
    static vec3Sub(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
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

    private static _objectIdCounter = 0;
    private static _objectIdMap = new WeakMap<object, number>();
    /**获取对象唯一标识 */
    static getObjectId(obj: object): number {
        if (!ToolUtil._objectIdMap.has(obj)) {
            ToolUtil._objectIdMap.set(obj, ++ToolUtil._objectIdCounter);
        }
        return ToolUtil._objectIdMap.get(obj)!;
    }
    private static _idx = 1;
    /**获取唯一标识idx */
    static getIdx(): number {
        return this._idx++;
    }
    /**随机数 */
    static getRandom(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
    static getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**透明度渐变 */
    static toggleOpacity(node: Node, transTime = 0, endOpacity = 0, onUpdate = (target) => { }) {
        let wheelMaskUIOpacity = node.getComponent(UIOpacity);
        return tween(wheelMaskUIOpacity).to(transTime, { opacity: endOpacity }, { onUpdate });
    }
    /**
     * 获取 分秒 字符串
     */
    static getSecFormatStr(sec: number): string {
        let minute = Math.floor(sec / 60);
        let second = sec % 60;
        if (minute <= 0) {
            return ToolUtil.replace(Time_S, second);
        } else if (second <= 0) {
            return ToolUtil.replace(Time_M, minute);
        }
        return ToolUtil.replace(Time_M_S, minute, second);
    }
    /**获取值 */
    static getValue(val: number, min: number, max: number): number {
        return Math.min(Math.max(val, min), max);
    }
    /**获取当前时间(s) */
    static now() {
        return Math.floor(Date.now() / 1000);
    }
    /**是字典 */
    static isMap(value: any): boolean {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }
    /**是数组 */
    static isArray(value: any): boolean {
        return Array.isArray(value);
    }
    /**道具字典转换 */
    static propMapToList(map: any): PropData[] {
        let list = [];
        if (ToolUtil.isArray(map)) {
            map.forEach(element => {
                ToolUtil.propMapToListEx(element, list);
            });
        } else if (ToolUtil.isMap(map)) {
            ToolUtil.propMapToListEx(map, list);
        }
        return list;
    }
    static propMapToListEx(map: any, list: PropData[]) {
        if (ToolUtil.isArray(map)) {
            list = list.concat(ToolUtil.propMapToList(map));
            return;
        }
        if (!ToolUtil.isMap(map)) {
            return;
        }
        for (let key in map) {
            if (Object.prototype.hasOwnProperty.call(map, key)) {
                let value = map[key];
                if ("coin" == key) {
                    list.push({ id: PropID.coin, num: value });
                } else if ("diamond" == key) {
                    list.push({ id: PropID.diamond, num: value });
                }
            }
        }
    }
    /**判断数组是否变化 */
    static arrayIsChange(arr1: number[], arr2: number[]): boolean {
        if (arr1.length != arr2.length) return true;
        arr1 = arr1.slice();
        arr2 = arr2.slice();
        arr1.sort();
        arr2.sort();
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) return true;
        }
        return false;
    }
}
