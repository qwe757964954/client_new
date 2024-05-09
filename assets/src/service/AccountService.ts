import { director } from "cc";
import { KeyConfig } from "../config/KeyConfig";
import { SceneType } from "../config/PrefabType";
import { TextConfig } from "../config/TextConfig";
import { ViewsManager } from "../manager/ViewsManager";
import { c2sAccountInit, c2sAccountLogin, s2cAccountLogin } from "../models/NetModel";
import { User } from "../models/User";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import EventManager from "../util/EventManager";
import StorageUtil from "../util/StorageUtil";

//用户信息服务
export default class AccountService {
    constructor() {
        this.addServerEvent();
    }

    addServerEvent() {
        EventManager.on(InterfacePath.Account_Init, this.onAccountInit.bind(this));
        EventManager.on(InterfacePath.c2sAccountLogin, this.onAccountLogin.bind(this));
        EventManager.on(InterfacePath.s2cAccountLogout, this.onAccountLogout.bind(this));
    }

    //账号初始化
    accountInit() {
        let para: c2sAccountInit = new c2sAccountInit();
        para.MemberToken = User.memberToken;
        NetMgr.sendMsg(para);
    }
    onAccountInit(data: any) {
        console.log("AccountService onAccountInit", data);
    }
    /**账号登录 */
    accountLogin() {
        let para: c2sAccountLogin = new c2sAccountLogin();
        para.user_name = User.account;
        para.password = User.password;
        NetMgr.sendMsg(para);
    }
    /**登录返回 */
    onAccountLogin(data: s2cAccountLogin) {
        NetMgr.resetReconnceTime();
        console.log("AccountService onAccountLogin", data.code, data.msg, data.user_id);
        if (200 == data.code) {
            User.isLogin = true;
            User.userId = data.user_id;
            User.memberToken = data.token;

            StorageUtil.saveData(KeyConfig.Last_Login_Account, User.account);
            StorageUtil.saveData(KeyConfig.Last_Login_Pwd, User.password);
        }
    }
    onAccountLogout() {
        NetMgr.closeNet();//主动关闭网络，不重连
        ViewsManager.showAlert(TextConfig.Account_Logout_Tip, () => {
            director.loadScene(SceneType.LoginScene);
        });
    }
}