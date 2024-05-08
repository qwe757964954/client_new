import { native } from "cc";
import { InterfaceUtil } from "../InterfaceUtil";

// 手机接口类
export class PhoneApi {
    /**消息方法 */
    public static onNative(arg0: string, arg1?: string) {
        if ("checkPhoneLoginResult" === arg0) {
            PhoneApi.checkPhoneLoginResult();
            return true;
        } else if ("phoneLoginResult" === arg0) {
            PhoneApi.phoneLoginResult();
            return true;
        }
        return false;
    }
    // 检测是否支持本地手机号一键登录
    public static checkPhoneLogin() {
        console.log("checkPhoneLogin");
        native.bridge?.sendToNative("checkPhoneLogin");
    }
    /**检测结果 */
    public static checkPhoneLoginResult() {
    }
    // 一键登录
    public static phoneLogin() {
        console.log("phoneLogin");
        native.bridge?.sendToNative("phoneLogin");
    }
    /**一键登录结果 */
    public static phoneLoginResult() {
    }
    /**设置登录类型 0登录 1绑定手机号*/
    public static setLoginOpenType(type: number) {
        native.bridge?.sendToNative("setLoginOpenType", type.toString());
    }
}
InterfaceUtil.registerOnNative(PhoneApi.onNative.bind(PhoneApi));