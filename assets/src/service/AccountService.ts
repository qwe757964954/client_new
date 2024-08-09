import { director } from "cc";
import { EventType } from "../config/EventType";
import { KeyConfig } from "../config/KeyConfig";
import { SceneType } from "../config/PrefabType";
import { TextConfig } from "../config/TextConfig";
import { ItemData } from "../manager/DataMgr";
import { SceneMgr } from "../manager/SceneMgr";
import { ViewsManager } from "../manager/ViewsManager";
import { c2sAccountInit, c2sAccountLogin, c2sGetPhoneCode, c2sPhoneCodeLogin, c2sTokenLogin, s2cAccountLogin, s2cItemUpdate } from "../models/NetModel";
import { LoginType, User } from "../models/User";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import EventManager, { EventMgr } from "../util/EventManager";
import StorageUtil from "../util/StorageUtil";

//用户信息服务
export default class AccountService {
    constructor() {
        this.addServerEvent();
    }

    addServerEvent() {
        EventManager.on(InterfacePath.Account_Init, this.onAccountInit.bind(this));
        EventManager.on(InterfacePath.c2sAccountLogin, this.onAccountLogin.bind(this));
        EventManager.on(InterfacePath.c2sPhoneCodeLogin, this.onAccountLogin.bind(this));
        EventManager.on(InterfacePath.c2sTokenLogin, this.onAccountLogin.bind(this));
        EventManager.on(InterfacePath.s2cAccountLogout, this.onAccountLogout.bind(this));
        EventManager.on(InterfacePath.s2cItemUpdate, this.onItemUpdate.bind(this));
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
        console.log("accountLogin", User.account, User.password);
        let para: c2sAccountLogin = new c2sAccountLogin();
        para.user_name = User.account;
        para.password = User.password;
        NetMgr.sendMsg(para);
    }
    /**token登录 */
    tokenLogin() {
        console.log("tokenLogin", User.memberToken);
        let para: c2sTokenLogin = new c2sTokenLogin();
        para.token = User.memberToken;
        NetMgr.sendMsg(para);
    }
    /**手机号验证码登录 */
    phoneCodeLogin() {
    }
    /**手机号一键登录 */
    phoneQuickLogin() {
    }
    /**微信登录 */
    wxLogin() {
    }
    /**登录返回 */
    onAccountLogin(data: s2cAccountLogin) {
        NetMgr.resetReconnceTime();
        console.log("AccountService onAccountLogin", data.code, data.msg, data.user_id);
        if (200 == data.code) {
            User.isLogin = true;
            User.userID = data.user_id;
            if (data.token) {
                User.memberToken = data.token;
            }
            let extra = data.detail?.extra;
            if (extra) {
                User.coin = extra.coin;
                User.diamond = extra.diamond;
                User.amethyst = extra.amethyst;
                User.stamina = extra.stamina;
                User.roleID = extra.role_id;
                User.level = extra.level;
                User.exp = extra.exp;
                User.nick = extra.nick_name;
                User.gender = extra.gender;
                User.avatarID = Number(extra.avatar);
                // User.updateStaminaLimitAndTime(extra.stamina_limit, extra.next_stamina_update);
                EventMgr.emit(EventType.Stamina_Timeout);
            }
            this.itemUpdate(data.detail?.item_list);
            if (LoginType.account == User.loginType) {
                StorageUtil.saveData(KeyConfig.Last_Login_Account, User.account);
                StorageUtil.saveData(KeyConfig.Last_Login_Pwd, User.password);
            }
            if (User.memberToken) {
                StorageUtil.saveData(KeyConfig.Last_Login_Token, User.memberToken);
            }
        }
        else {
            if (621 == data.code) { //token无效
                User.memberToken = "";
                StorageUtil.removeData(KeyConfig.Last_Login_Token);
            }
            if (SceneType.LoginScene != director.getScene().name) {
                ViewsManager.showAlert(data.msg, () => {
                    SceneMgr.loadScene(SceneType.LoginScene);
                });
            }
        }
        EventMgr.emit(EventType.Login_Success);
    }
    onAccountLogout() {
        NetMgr.closeNet();//主动关闭网络，不重连
        ViewsManager.showAlert(TextConfig.Account_Logout_Tip, () => {
            SceneMgr.loadScene(SceneType.LoginScene);
        });
    }
    /**物品更新 */
    onItemUpdate(data: s2cItemUpdate) {
        console.log("AccountService onItemUpdate", data, User.userID);
        if (data.user_id != User.userID) return;
        this.itemUpdate(data.item_list);
        // let detail = data.item_list;
        // if (!detail) return;
        // for (const key in detail) {
        //     User.setItem(Number(key), detail[key]);
        // }
    }
    /**物品更新 */
    itemUpdate(data: ItemData[]) {
        if (!data || data.length == 0) return;
        data.forEach(item => {
            User.setItem(item.id, item.num);
        });
        EventMgr.dispatch(EventType.Item_Props_Refresh);
    }
    /**手机号验证码登录 */
    reqPhoneCodeLogin(phone: string, code: string) {
        let para: c2sPhoneCodeLogin = new c2sPhoneCodeLogin();
        para.phone = phone;
        para.check_code = code;
        NetMgr.sendMsg(para);
    }
    /**手机号获得验证码 */
    reqGetPhoneCode(phone: string) {
        let para: c2sGetPhoneCode = new c2sGetPhoneCode();
        para.phone = phone;
        NetMgr.sendMsg(para);
    }
}