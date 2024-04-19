import { NodeEventType, Input, input, EventKeyboard, KeyCode, isValid } from "cc";

export default class CCUtil {
    // 触摸事件监听
    public static onTouch(obj: any, callback: Function, target?: any) {
        let node = obj.node ? obj.node : obj;
        if (node && node.on && isValid(node, true)) {
            node.on(NodeEventType.TOUCH_END, callback, target);
        }
    }
    // 触摸事件解除
    public static offTouch(obj: any, callback: Function, target?: any) {
        let node = obj.node ? obj.node : obj;
        if (node && node.off && isValid(node, true)) {
            node.off(NodeEventType.TOUCH_END, callback, target);
        }
    }
    // 按键事件监听
    public static onKeyBack(obj: any, callback: Function, target?: any) {
        obj._onKeyBack = (event: EventKeyboard) => {
            if (event.keyCode === KeyCode.MOBILE_BACK || event.keyCode === KeyCode.BACKSPACE) {
                if (callback) {
                    callback(target);
                }
            }
        }
        input.on(Input.EventType.KEY_UP, obj._onKeyBack);
    }
    // 按键事件解除
    public static offKeyBack(obj: any) {
        input.off(Input.EventType.KEY_UP, obj._onKeyBack);
    }
}