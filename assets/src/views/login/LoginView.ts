import { _decorator, director, EditBox, Event, EventTouch, instantiate, isValid, Label, Node, Prefab, sys, Toggle } from 'cc';
import { HTML5, NATIVE } from 'cc/env';
import { EventType } from '../../config/EventType';
import { KeyConfig } from '../../config/KeyConfig';
import { NetConfig } from '../../config/NetConfig';
import { SceneType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { DataMgr } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { s2cAccountLogin } from '../../models/NetModel';
import { User } from '../../models/User';
import { HttpManager } from '../../net/HttpManager';
import { InterfacePath } from '../../net/InterfacePath';
import { NetMgr } from '../../net/NetManager';
import { BaseView } from '../../script/BaseView';
import EventManager from '../../util/EventManager';
import StorageUtil from '../../util/StorageUtil';
import { TimerMgr } from '../../util/TimerMgr';
import { ServerItem } from './ServerItem';
const { ccclass, property } = _decorator;

// 隐私协议是否勾选过
const PRIVATE_HAS_CHECK_KEY = "private_has_check_key";
// 登录信息
const LOGIN_INFO_KEY = "login_info_key";

@ccclass('LoginView')
export class LoginView extends BaseView {
    @property(Node)
    public middle: Node = null;              // middle节点

    @property(Node)
    public downLoadBox: Node = null;         // downLoadBox
    @property(Node)
    public appleQrCode: Node = null;         // qrCode-apple

    @property(Node)
    public loginBox: Node = null;            // 账号密码节点
    @property(EditBox)
    public userNameEdit: EditBox = null;     // 用户名输入框
    @property(EditBox)
    public pwdEdit: EditBox = null;          // 密码输入框
    @property(Node)
    public eyeHide: Node = null;             // btnEye节点
    @property(Node)
    public eyeShow: Node = null;             // btnEye节点

    @property(Node)
    public inputPhoneBox: Node = null;       // 手机号输入框节点
    @property(EditBox)
    public phoneEdit: EditBox = null;        // 手机号输入框
    @property(Node)
    public getCodeBox: Node = null;          // 验证码输入框节点
    @property(EditBox)
    public codeEdit: EditBox = null;         // 验证码输入框
    @property(Node)
    public codeButton: Node = null;          // 验证码重新获取按钮
    @property(Label)
    public codeTime: Label = null;           // 验证码倒计时

    @property(Node)
    public privacyAgreeBox: Node = null;     // 隐私协议节点
    @property(Node)
    public agreeTip: Node = null;            // 提示节点

    @property(Prefab)
    serverItemPrefab: Prefab = null;        // 服务器item
    @property(Node)
    serverContent: Node = null;              // 服务器列表content
    serverItemList: Node[] = [];             // 服务器item列表

    private _codeTime: number = 60;          // 验证码时间
    private _loopID: number = 0;             // 验证码循环id

    private _isRequest: boolean = false;      // 是否正在请求
    private _socketConnectHandler: string; // socket连接回调事件

    start() {
    }
    //初始化事件
    onInitModuleEvent() {
        this.addModelListener(InterfacePath.c2sAccountLogin, this.onAccountLogin.bind(this));
        this.addModelListener(EventType.Socket_ReconnectFail, this.onSocketDis.bind(this));
    }

    protected onEnable(): void {
        this.middle.active = false;
        this.downLoadBox.active = false;
        // token检查
        this.checkToken();

        HttpManager.reqSelectServer((obj) => {
            console.log("reqSelectServer obj = ", obj);
            if (!isValid(this, true)) return;
            let available_server = obj.available_server;
            for (let k in available_server) {
                let serverItem = instantiate(this.serverItemPrefab);
                if (serverItem) {
                    serverItem.getComponent(ServerItem).setData(k, available_server[k]);
                    serverItem.parent = this.serverContent;
                    serverItem.on(Node.EventType.TOUCH_END, this.onServerItemClick, this);
                    this.serverItemList.push(serverItem);
                }
            }
            if (this.serverItemList.length > 0) {
                this.serverItemList[0].getComponent(ServerItem).selected = true;
            }
        }, () => {
            console.log("reqSelectServer failed");
        });

        DataMgr.instance.initData();
    }

    onServerItemClick(event: EventTouch) {
        let item = event.target;
        for (let i = 0; i < this.serverItemList.length; i++) {
            let serverItem = this.serverItemList[i];
            if (serverItem == item) {
                serverItem.getComponent(ServerItem).selected = true;
            }
            else {
                serverItem.getComponent(ServerItem).selected = false;
            }
        }
    }

    checkToken() {
        if (GlobalConfig.OLD_SERVER) {
            // 有token且登录成功直接进入主界面，否则初始化UI
            let loginInfoStr = StorageUtil.getData(LOGIN_INFO_KEY);
            if (!loginInfoStr) {
                this.initUI();
                return;
            }
            try {
                let loginInfo = JSON.parse(loginInfoStr);
                if (loginInfo.AccountName && loginInfo.LoginPwd) {
                    this.userNameEdit.string = loginInfo.AccountName;
                    this.pwdEdit.string = loginInfo.LoginPwd;
                }
                this._isRequest = true;
                HttpManager.reqTokenLogin(loginInfo?.LoginToken, (obj) => {
                    this._isRequest = false;
                    if (!this.loginSuc(obj)) {
                        this.initUI();
                    }
                }, () => {
                    this._isRequest = false;
                    this.initUI();
                });
            } catch (error) {
                console.error(error);
                this.initUI();
            }
            return;
        }
        let account = StorageUtil.getData(KeyConfig.Last_Login_Account);
        let password = StorageUtil.getData(KeyConfig.Last_Login_Pwd);
        if (account && password) {
            this.userNameEdit.string = account;
            this.pwdEdit.string = password;
            if (User.isAutoLogin) {
                this.btnLoginFunc();
                return;
            }
        }
        this.initUI();
    }

    initUI() {
        this.middle.active = true;
        this.loginBox.active = true;
        this.inputPhoneBox.active = false;
        this.getCodeBox.active = false;
        this.privacyAgreeBox.active = true;
        this.eyeHide.active = true;
        this.eyeShow.active = false;
        // 隐私协议
        let privateHasCheck = StorageUtil.getData(PRIVATE_HAS_CHECK_KEY, "0") == "0" ? false : true;
        (this.privacyAgreeBox.getComponent(Toggle)).isChecked = privateHasCheck;
        this.agreeTip.active = !privateHasCheck;
        // 下载模块
        if (this.downLoadBox.getChildByName("Goole")) {
            this.downLoadBox.getChildByName("Goole").active = !HTML5;
        }
        this.appleQrCode.active = false;
        // 微信登录按钮
        if (this.middle.getChildByName("WxLogin")) {
            this.middle.getChildByName("WxLogin").active = NATIVE;
        }
    }

    update(deltaTime: number) {

    }

    // 密码眼睛切换文本
    btnEyeFunc() {
        console.log("btnEyeFunc");
        if (this.pwdEdit.inputFlag == EditBox.InputFlag.DEFAULT) {
            this.pwdEdit.inputFlag = EditBox.InputFlag.PASSWORD;
            this.eyeHide.active = true;
            this.eyeShow.active = false;
        }
        else {
            this.pwdEdit.inputFlag = EditBox.InputFlag.DEFAULT;
            this.eyeHide.active = false;
            this.eyeShow.active = true;
        }
    }

    // loginBox和phoneBox切换
    btnChangeLoginFunc(data: Event, customEventData: string) {
        console.log("btnChangeLoginFunc customEventData = ", customEventData);
        if (customEventData == "changePhoneBox") {
            this.inputPhoneBox.active = true;
            this.loginBox.active = false;
        }
        else if (customEventData == "changeLoginBox") {
            this.inputPhoneBox.active = false;
            this.loginBox.active = true;
        }
    }

    // 隐私选中方法
    togglePrivateFunc(toggle: Toggle) {
        console.log("togglePrivateFunc isChecked = ", toggle.isChecked);
        StorageUtil.saveData(PRIVATE_HAS_CHECK_KEY, toggle.isChecked ? "1" : "0");
        this.agreeTip.active = !toggle.isChecked;
    }

    // 账号密码登录
    btnLoginFunc() {
        if (this._isRequest) return;
        let isChecked = (this.privacyAgreeBox.getComponent(Toggle)).isChecked;
        console.log("btnLoginFunc isChecked = ", isChecked);
        if (!isChecked) {
            return;
        }
        let userName = this.userNameEdit.string;
        let pwd = this.pwdEdit.string;
        console.log("btnLoginFunc userName = ", userName, " pwd = ", pwd);
        if (userName == "" || pwd == "") {
            console.log("账号密码不能为空");
            return;
        }
        this._isRequest = true;
        if (GlobalConfig.OLD_SERVER) {
            HttpManager.reqAccountLogin(userName, pwd, 0, (obj) => {
                this.loginSuc(obj);
                this._isRequest = false;
            }, () => {
                console.log("账号密码登录失败");
                this._isRequest = false;
            })
            return;
        }
        User.account = userName;
        User.password = pwd;
        NetMgr.setServer(NetConfig.server, NetConfig.port);
        NetMgr.connectNet();
    }

    // 手机号下一步
    btnPhoneNextFunc(data: Event, customEventData: string) {
        let isChecked = (this.privacyAgreeBox.getComponent(Toggle)).isChecked;
        console.log("btnPhoneNextFunc isChecked = ", isChecked);
        if (!isChecked) {
            return;
        }
        let phone = this.phoneEdit.string;
        console.log("btnPhoneNextFunc phone = ", phone);
        if (phone.length != 11) {
            console.log("手机号输入错误");
            return;
        }
        // // 直接登录
        // HttpManager.reqMobileLogin(phone, "", (obj) => {
        //     console.log("登录成功 obj = ", obj);
        // }, () => {
        //     console.log("登录失败");
        // });
        // 请求验证码
        HttpManager.reqSms(phone, (obj) => {
            console.log("验证码返回成功 obj = ", obj);
            if (!obj || obj.Code != 200) {
                console.log("验证码请求失败");
                return;
            }
            console.log("验证码请求成功");
            // 打开验证码输入框
            if (customEventData != "getCodeButton") {
                this.inputPhoneBox.active = false;
                this.getCodeBox.active = true;
            }
            this.codeButton.active = false;
            this.codeTime.node.active = true;
            // 验证码倒计时循环
            this._codeTime = 60;
            this.codeTime.string = "(60s)";
            if (this._loopID > 0) {
                TimerMgr.stopLoop(this._loopID);
                this._loopID = 0;
            }
            this._loopID = TimerMgr.loop(() => {
                this._codeTime--;
                this.codeTime.string = "(" + this._codeTime + "s)";
                if (this._codeTime < 0) {
                    this.codeButton.active = true;
                    this.codeTime.node.active = false;
                    TimerMgr.stopLoop(this._loopID);
                    this._loopID = 0;
                }
            }, 1000);
        }, () => {
            console.log("验证码请求失败");
        });
    }

    // 验证码登录
    btnPhoneLoginFunc() {
        let isChecked = (this.privacyAgreeBox.getComponent(Toggle)).isChecked;
        console.log("btnPhoneLoginFunc isChecked = ", isChecked);
        if (!isChecked) {
            return;
        }
        let phone = this.phoneEdit.string;
        let code = this.codeEdit.string;
        console.log("btnPhoneLoginFunc phone = ", phone, " code = ", code);
        if (code == "") {
            console.log("验证码不能为空");
            return;
        }
        HttpManager.reqSmsLogin(phone, code, "", (obj) => {
            this.loginSuc(obj);
        }, () => {
            console.log("验证码登录失败");
        })
    }

    // 微信登录
    btnWxLoginFunc() {
        console.log("btnWxLoginFunc");
        // 调用sdk微信登录接口
        HttpManager.reqWechatLogin("", (obj) => {
            this.loginSuc(obj);
        }, () => {
            console.log("微信登录失败");
        })
    }

    // 用户协议和隐私政策
    btnUserXieyiOrYinsiFunc(data: Event, customEventData: string) {
        console.log("btnUserXieyiOrYinsiFunc customEventData = ", customEventData);
        if (customEventData == "xieyi") {
            sys.openURL(NetConfig.userAgreement);
        }
        else if (customEventData == "yinsi") {
            sys.openURL(NetConfig.privacyPage);
        }
    }

    // 下载
    btnDownLoadFunc(data: Event, customEventData: string) {
        console.log("btnDownLoadFunc customEventData = ", customEventData);
        if (customEventData == "Goole") {
            sys.openURL(NetConfig.gooleDown);
        }
        else if (customEventData == "Android") {
            sys.openURL(NetConfig.androidDown);
        }
        else if (customEventData == "Apple") {
            this.appleQrCode.active = !this.appleQrCode.active;
        }
    }

    // {
    //     Code: 200,
    //     LoginToken: 'EYjbz2vUDeLKiJOXlcjmB2DPBLrPBwuIoIiYmdi0lta0lta5ideXoJaZoJeXiIWIvxnLCKLKiJOYmdaYmZy5nx0=',
    //     MemberToken: '200236951712631790',
    //     Mobile: '13715061560',
    //     Msg: '请求成功',
    //     Path: 'Account.Login',
    //     PlatType: 0,
    //     SysType: 0,
    //     WebPort: '8995',
    //     WebSocketAddr: 'szxc.chuangciyingyu.com',
    //     WebSocketPort: '8996'
    // }
    // 登录成功回调
    loginSuc(obj) {
        console.log("loginSuc obj = ", obj);
        if (!obj) {
            console.log("loginSuc obj is null");
            return false;
        }
        if (obj.Code != 200) {
            console.log(obj.Msg);
            return false;
        }
        if (obj.op_code == "disable") {
            ViewsManager.showTip("账号已被禁用，请联系客服！");
            return false;
        } else if (obj.op_code == "die") {
            ViewsManager.showTip("账号或密码错误！");
            return false;
        }
        StorageUtil.saveData(LOGIN_INFO_KEY, JSON.stringify({
            LoginToken: obj.LoginToken,
            MemberToken: obj.MemberToken,
            Mobile: obj.Mobile,
            AccountName: this.userNameEdit.string,
            LoginPwd: this.pwdEdit.string
        }));

        User.memberToken = obj["MemberToken"];
        NetMgr.setServer(obj["WebSocketAddr"], obj["WebSocketPort"], obj["WebPort"]);
        NetMgr.connectNet();
        this._socketConnectHandler = EventManager.on(EventType.Socket_Connect, this.onSocketConnect.bind(this));
        return true;
    }

    // socket连接成功
    onSocketConnect() {
        // 跳转主界面
        console.log("跳转主界面");
        director.loadScene(SceneType.MainScene);
    }

    onDestroy() {
        super.onDestroy();
        if (this._socketConnectHandler)
            EventManager.off(EventType.Socket_Connect, this._socketConnectHandler);
    }
    /**登录结果 */
    onAccountLogin(data: s2cAccountLogin) {
        this._isRequest = false;
        if (200 != data.Code) {
            ViewsManager.showAlert(data.Msg ? data.Msg : "数据异常");
            return;
        }
        console.log("登录成功");
        director.loadScene(SceneType.MainScene);
    }
    /**连接断开 */
    onSocketDis() {
        this._isRequest = false;
    }
}