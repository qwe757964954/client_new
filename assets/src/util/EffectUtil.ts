import { Node, UIOpacity, Vec3, easing, tween } from "cc";

/** 特效工具类 */
export class EffectUtil {
    /** 居中弹出 */
    static centerPopup(node: Node, callBack?: Function) {
        node.pauseSystemEvents(true);
        let scale = node.scale;
        node.scale = new Vec3(0.2, 0.2, 1.0);
        tween(node).to(0.4, { scale: new Vec3(1.0, 1.0, 1.0) }, { easing: easing.backOut }).call(() => {
            node.resumeSystemEvents(true);
            if (callBack) callBack();
        }).start();
    }
    /** 居中关闭 */
    static centerClose(node: Node, callBack?: Function) {
        node.pauseSystemEvents(true);
        tween(node).to(0.4, { scale: new Vec3(0.0, 0.0, 1.0) }, { easing: easing.backIn }).call(() => {
            node.resumeSystemEvents(true);
            if (callBack) callBack();
        }).start();
    }
    /** 渐变进入 */
    static fadingIn(node: Node, time: number = 0.4, callBack?: Function) {
        let nodeOpacity = node.getComponent(UIOpacity);
        nodeOpacity.opacity = 0;
        tween(nodeOpacity).to(time, { opacity: 255 }).call(() => {
            if (callBack) callBack();
        }).start();
    }
    /** 渐变退出 */
    static fadingOut(node: Node, time: number = 0.4, callBack?: Function) {
        let nodeOpacity = node.getComponent(UIOpacity);
        nodeOpacity.opacity = 255;
        tween(nodeOpacity).to(time, { opacity: 0 }).call(() => {
            if (callBack) callBack();
        }).start();
    }
}