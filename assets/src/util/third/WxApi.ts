import { native } from "cc";
import { InterfaceUtil } from "../InterfaceUtil";

//微信接口类
export class WxApi {
    public static isWxInstall: boolean = false;
    /**消息方法 */
    public static onNative(arg0: string, arg1?: string) {
        if ("isWxInstalledResult" === arg0) {
            WxApi.isWxInstalledResult(arg1);
            return true;
        }
        return false;
    }
    // 微信登录
    public static login() {

    }
    /**微信是否安装 */
    public static isWxInstalled() {
        native.bridge?.sendToNative("isWxInstalled");
    }
    public static isWxInstalledResult(result: string) {
        let code = Number(result);
        if (code > 0) {
            WxApi.isWxInstall = true;
        }
    }
}
InterfaceUtil.registerOnNative(WxApi.onNative.bind(WxApi));