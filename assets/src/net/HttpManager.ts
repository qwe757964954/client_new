import { NetConfig } from "../config/NetConfig";
import GlobalConfig from "../GlobalConfig";
import HttpUtil from "../util/HttpUtil";

// http管理类
export class HttpManager {
    /**版本检测 */
    static reqVersionCheck(successFunc: Function, failedFunc: Function) {
        HttpUtil.get(NetConfig.versionCheck + "?version=" + GlobalConfig.APP_VERSION).then(
            (s: string) => {
                let obj = JSON.parse(s);
                successFunc?.(obj);
            },
            () => {
                failedFunc?.();
            }
        );
    }
}