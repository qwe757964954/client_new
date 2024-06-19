import GlobalConfig from "../GlobalConfig";
import { User } from "../models/User";

class ErrorData {
    userID: number;
    appVer: string;
    exeVer: number;
    exeResVer: string;
    channelID: number;
    appVerName: string;
    deviceModel: string;
    osVersion: string;
    androidId: string;
    msg: string;
}

export class ErrorUtil {

    static getData(msg) {
        let data = new ErrorData();
        data.userID = User.userID;
        data.appVer = GlobalConfig.APP_VERSION;
        data.exeVer = GlobalConfig.EXE_VERSION;
        data.exeResVer = GlobalConfig.EXE_RES_VERSION;
        data.channelID = GlobalConfig.CHANNEL_ID;
        data.appVerName = GlobalConfig.APPVERSION_NAME;
        data.deviceModel = GlobalConfig.DEVICE_MODEL;
        data.osVersion = GlobalConfig.OS_VERSION;
        data.androidId = GlobalConfig.ANDROID_ID;
        data.msg = msg;
        return data;
    }
    static log(msg) {
        let data = ErrorUtil.getData(msg);
        let str = JSON.stringify(data);
        // HttpUtil.post(NetConfig.logUrl, str);
        console.log("ErrorUtil log", msg);
    }
}