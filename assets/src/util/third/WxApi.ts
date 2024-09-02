import { native } from "cc";
import { InterfaceUtil } from "../InterfaceUtil";

//微信接口类
export class WxApi {
    public static isWxInstall: boolean = false;
    /**消息方法 */
    public static onNative(arg0: string, arg1?: string) {
        if ("isWxInstalledResult" === arg0) {
            this.isWxInstalledResult(arg1);
            return true;
        } else if ("wxLoginResult" === arg0) {
            this.wxLoginResult(arg1);
            return true;
        } else if ("wxLoginQrcodeResult" === arg0) {
            this.wxLoginQrcodeResult(arg1);
            return true;
        } else if ("wxLoginQrcodeLoginResult" === arg0) {
            this.wxLoginQrcodeLoginResult(arg1);
            return true;
        }
        return false;
    }
    /**微信是否安装 */
    public static isWxInstalled() {
        native.bridge?.sendToNative("isWxInstalled");
    }
    private static isWxInstalledResult(result: string) {
        let code = Number(result);
        this.isWxInstall = (code > 0);
    }
    /**微信登录 */
    private static _wxLoginCallBack: Function = null;
    public static wxLogin(callBack: Function) {
        this._wxLoginCallBack = callBack;
        native.bridge?.sendToNative("wxLogin");
    }
    private static wxLoginResult(result: string) {
        if (null == this._wxLoginCallBack) return;
        this._wxLoginCallBack(result);
        this._wxLoginCallBack = null;
    }
    /**微信二维码登录 */
    private static _wxLoginQrcodeCallBack: Function = null;
    private static _wxLoginQrcodeImgCallBack: Function = null;
    public static wxLoginQrcode(callBack: Function, imgCall: Function) {
        this._wxLoginQrcodeCallBack = callBack;
        this._wxLoginQrcodeImgCallBack = imgCall;
        native.bridge?.sendToNative("wxLoginQrcode");
    }
    public static clearWxLoginQrcodeCallback() {
        this._wxLoginQrcodeCallBack = null;
        this._wxLoginQrcodeImgCallBack = null;
    }
    private static wxLoginQrcodeResult(result: string) {
        if (null == this._wxLoginQrcodeImgCallBack) return;
        this._wxLoginQrcodeImgCallBack(result);
    }
    private static wxLoginQrcodeLoginResult(result: string) {
        if (null == this._wxLoginQrcodeCallBack) return;
        this._wxLoginQrcodeCallBack(result);
    }
}
InterfaceUtil.registerOnNative(WxApi.onNative.bind(WxApi));