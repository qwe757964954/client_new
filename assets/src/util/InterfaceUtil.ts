import { Game, game, native } from "cc";
import { ChannelCfg } from "../ChannelInfo";
import GlobalConfig from "../GlobalConfig";

//接口工具类 与android、ios代码交互类
export class InterfaceUtil {
    private static _isInit: boolean = false;
    private static _onNativeAry: Function[] = [];
    public static setNative() {
        if (InterfaceUtil._isInit) return;
        if (!native || !native.bridge) return;
        InterfaceUtil._isInit = true;
        native.bridge.onNative = (arg0: string, arg1?: string) => {
            console.log("onNative", arg0, arg1);
            for (let i = 0; i < InterfaceUtil._onNativeAry.length; i++) {
                if (InterfaceUtil._onNativeAry[i](arg0, arg1)) break;
            }
        }
        InterfaceUtil.registerOnNative(InterfaceUtil.onNative.bind(InterfaceUtil));
        InterfaceUtil.init();
    }
    /**注册方法 */
    public static registerOnNative(func: Function) {
        InterfaceUtil._onNativeAry.push(func);
    }
    /**消息方法 */
    public static onNative(arg0: string, arg1?: string) {
        if ("initData" === arg0) {
            InterfaceUtil.initData(arg1);
            return true;
        }
        return false;
    }
    /**初始化数据 */
    public static initData(data: string) {
        if (!data || data.length <= 0) return;
        let obj = JSON.parse(data);
        GlobalConfig.CHANNEL_ID = obj.channelID;
        GlobalConfig.EXE_VERSION = obj.exeVer;
        GlobalConfig.EXE_RES_VERSION = obj.exeResVer;
        ChannelCfg.refresh();
    }
    private static init() {
        native.bridge?.sendToNative("initData");
    }
    /**显示webview */
    public static showWebView(url: string, refer?: string) {
        let obj = { url: url, refer: refer };
        native.bridge?.sendToNative("showWebView", JSON.stringify(obj));
    }
    /**关闭webview */
    public static closeWebView() {
        native.bridge?.sendToNative("closeWebView");
    }
}
game.once(Game.EVENT_POST_PROJECT_INIT, () => {
    InterfaceUtil.setNative();
});
InterfaceUtil.setNative();