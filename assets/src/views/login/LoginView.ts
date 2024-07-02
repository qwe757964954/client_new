import { _decorator, Button, director, EditBox, Label, Node, sys, Toggle } from 'cc';
import { EventType } from '../../config/EventType';
import { KeyConfig } from '../../config/KeyConfig';
import { NetConfig } from '../../config/NetConfig';
import { SceneType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr } from '../../manager/DataMgr';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { s2cAccountLogin, s2cGetPhoneCode } from '../../models/NetModel';
import { LoginType, User } from '../../models/User';
import { InterfacePath } from '../../net/InterfacePath';
import { NetMgr } from '../../net/NetManager';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseView } from '../../script/BaseView';
import GlobalService from '../../service/GlobalService';
import CCUtil from '../../util/CCUtil';
import StorageUtil from '../../util/StorageUtil';
import { TimerMgr } from '../../util/TimerMgr';
import { ToolUtil } from '../../util/ToolUtil';
import { ActivationCodeView } from './ActivationCodeView';
import { QRCodeView } from './QRCodeView';
const { ccclass, property } = _decorator;

// 隐私协议是否勾选过
const PRIVATE_HAS_CHECK_KEY = "private_has_check_key";
// 登录信息
const LOGIN_INFO_KEY = "login_info_key";

@ccclass('LoginView')
export class LoginView extends BaseView {
    @property(Node)
    public middle: Node = null;              // middle节点
    @property(QRCodeView)
    public plQRCode: QRCodeView = null;      // 二维码
    @property(ActivationCodeView)
    public plActivationCode: ActivationCodeView = null;      // 激活码
    @property(Node)
    public btnWxLogin: Node = null;          // 微信登录按钮

    @property(Node)
    public loginBox: Node = null;            // 账号密码节点
    @property(EditBox)
    public userNameEdit: EditBox = null;     // 用户名输入框
    @property(EditBox)
    public pwdEdit: EditBox = null;          // 密码输入框
    @property(Node)
    public btnAccountLogin: Node = null;     // 账号登录按钮
    @property(Node)
    public btnGoToPhoneCode: Node = null;    // 去手机号登录按钮

    @property(Node)
    public inputPhoneBox: Node = null;       // 手机号输入框节点
    @property(EditBox)
    public phoneEdit: EditBox = null;        // 手机号输入框
    @property(EditBox)
    public codeEdit: EditBox = null;         // 验证码输入框
    @property(Button)
    public btnCode: Button = null;          // 验证码获取按钮
    @property(Label)
    public codeTime: Label = null;           // 验证码倒计时
    @property(Node)
    public btnCodeLogin: Node = null;       // 验证码登录按钮
    @property(Node)
    public btnGoToAccount: Node = null;     // 去账号登录按钮

    @property(Toggle)
    public agreeToggle: Toggle = null;       // 隐私协议确认
    @property(Node)
    public btnAgree: Node = null;            // 用户协议
    @property(Node)
    public btnPrivacy: Node = null;          // 隐私协议
    @property(Node)
    public agreeTip: Node = null;            // 提示节点

    private _codeTime: number = 0;          // 验证码时间
    private _loopID: number = null;             // 验证码循环id

    start() {
        super.start();
        GlobalService.getInstance();
        this.connectServer();
        this.plQRCode.setBackCall(this.onPlQrCodeBack.bind(this));
        this.plActivationCode.setCallFunc(this.onPlActivationCodeBack.bind(this), this.onActivationCodeActive.bind(this));

        this.checkToken();
        DataMgr.instance.initData();
    }
    onDestroy(): void {
        this.clearTimer();
    }
    //初始化事件
    onInitModuleEvent() {
        this.addModelListener(InterfacePath.c2sAccountLogin, this.onAccountLogin.bind(this));
        this.addModelListener(InterfacePath.c2sTokenLogin, this.onAccountLogin.bind(this));
        this.addModelListener(InterfacePath.c2sPhoneCodeLogin, this.onAccountLogin.bind(this));
        this.addModelListener(EventType.Socket_ReconnectFail, this.onSocketDis.bind(this));

        this.addModelListener(InterfacePath.Account_Init, this.userInitSuc.bind(this));//老接口

        CCUtil.onTouch(this.btnWxLogin, this.wxLogin, this);
        CCUtil.onTouch(this.btnAccountLogin, this.btnLoginClick, this);
        CCUtil.onTouch(this.btnAgree, this.btnUserAgreeClick, this);
        CCUtil.onTouch(this.btnPrivacy, this.btnPrivacyClick, this);
        CCUtil.onTouch(this.btnGoToPhoneCode, this.btnGoToPhoneCodeClick, this);
        CCUtil.onTouch(this.btnGoToAccount, this.btnGoToAccountClick, this);
        this.agreeToggle.node.on(Toggle.EventType.TOGGLE, this.onToggle, this);
        CCUtil.onTouch(this.btnCode, this.btnPhoneCodeClick, this);
        CCUtil.onTouch(this.btnCodeLogin, this.btnPhoneCodeLoginClick, this);
    }

    checkToken() {
        if (User.isAutoLogin) {
            let token = StorageUtil.getData(KeyConfig.Last_Login_Token, "");
            if (token && "" != token) {
                this.middle.active = false;
                User.isLogin = true;//标记账号已经登录过，用来重连
                this.tokenLogin(token);
                return;
            }
        }
    }

    initUI() {
        let account = StorageUtil.getData(KeyConfig.Last_Login_Account, "");
        let password = StorageUtil.getData(KeyConfig.Last_Login_Pwd, "");
        if (account && password) {
            this.userNameEdit.string = account;
            this.pwdEdit.string = password;
        }

        this.middle.active = true;
        this.loginBox.active = true;
        this.inputPhoneBox.active = false;
        // 隐私协议
        let privateHasCheck = StorageUtil.getData(PRIVATE_HAS_CHECK_KEY, "0") == "0" ? false : true;
        this.agreeToggle.isChecked = privateHasCheck;
        this.agreeTip.active = !privateHasCheck;
        this.btnWxLogin.active = false;// 微信登录按钮
    }



    // 账号密码登录
    btnLoginClick() {
        let isChecked = this.agreeToggle.isChecked;
        let userName = this.userNameEdit.string;
        let pwd = this.pwdEdit.string;
        if (!isChecked) {
            ViewsMgr.showTip(TextConfig.Agree_Maksure_Tip);
            return;
        }
        if (userName == "") {
            ViewsMgr.showTip(TextConfig.Account_Null_Tip);
            return;
        }
        if (pwd == "") {
            ViewsMgr.showTip(TextConfig.Password_Null_Tip);
            return;
        }
        this.accountLogin(userName, pwd);
    }
    /**用户协议 */
    btnUserAgreeClick() {
        sys.openURL(NetConfig.userAgreement);
    }
    /**隐私政策 */
    btnPrivacyClick() {
        sys.openURL(NetConfig.privacyPage);
    }
    /**去手机号登录 */
    btnGoToPhoneCodeClick() {
        this.loginBox.active = false;
        this.inputPhoneBox.active = true;
    }
    /**去账号登录 */
    btnGoToAccountClick() {
        this.loginBox.active = true;
        this.inputPhoneBox.active = false;
    }
    /**清理定时器 */
    clearTimer() {
        if (this._loopID) {
            TimerMgr.stopLoop(this._loopID);
            this._loopID = null;
        }
    }
    /**验证码 */
    btnPhoneCodeClick() {
        let phone = this.phoneEdit.string;
        if ("" == phone) {
            ViewsMgr.showTip(TextConfig.Phone_Null_Tip);
            return;
        }
        if (this._codeTime > 0) {
            return;
        }
        this._codeTime = 60;
        this.codeTime.string = "(60s)";
        this.btnCode.interactable = false;
        this.clearTimer();
        this._loopID = TimerMgr.loop(() => {
            this._codeTime--;
            this.codeTime.string = ToolUtil.replace(TextConfig.Get_Code_Time, this._codeTime);
            if (this._codeTime < 0) {
                this.clearTimer();

                this.codeTime.string = TextConfig.Get_Code;
                this.btnCode.interactable = true;
            }
        }, 1000);

        ServiceMgr.accountService.reqGetPhoneCode(phone);
    }
    /**手机验证码登录 */
    btnPhoneCodeLoginClick() {
        let isChecked = this.agreeToggle.isChecked;
        let phone = this.phoneEdit.string;
        let code = this.codeEdit.string;
        if (!isChecked) {
            ViewsMgr.showTip(TextConfig.Agree_Maksure_Tip);
            return;
        }
        if ("" == phone) {
            ViewsMgr.showTip(TextConfig.Phone_Null_Tip);
            return;
        }
        if ("" == code) {
            ViewsMgr.showTip(TextConfig.Code_Null_Tip);
            return;
        }
        this.mobileLogin(phone, code);
    }
    // 隐私选中方法
    onToggle(toggle: Toggle) {
        StorageUtil.saveData(PRIVATE_HAS_CHECK_KEY, toggle.isChecked ? "1" : "0");
        this.agreeTip.active = !toggle.isChecked;
    }
    /**二维码层返回 */
    onPlQrCodeBack() {
        this.middle.active = true;
        this.plQRCode.node.active = false;
        this.plActivationCode.node.active = false;
    }
    /**激活码层返回 */
    onPlActivationCodeBack() {
        this.middle.active = true;
        this.plQRCode.node.active = false;
        this.plActivationCode.node.active = false;
    }
    /**激活码激活 */
    onActivationCodeActive(code: string) {
        if ("" == code) {
            ViewsMgr.showTip(TextConfig.ActivationCode_Null_Tip);
            return;
        }
        ViewsMgr.showTip(TextConfig.Function_Tip);//TODO 激活码验证
    }
    /**显示二维码层 */
    showPlQRCode() {
        this.middle.active = false;
        this.plQRCode.node.active = true;
        this.plActivationCode.node.active = false;
    }
    /**显示激活码层 */
    showPlActivationCode() {
        this.middle.active = false;
        this.plQRCode.node.active = false;
        this.plActivationCode.node.active = true;
    }
    /**验证码结果 */
    onRepGetPhoneCode(data: s2cGetPhoneCode) {
        if (200 != data.code) {
            ViewsMgr.showTip(data.msg);
            return;
        }
        ViewsMgr.showTip(TextConfig.Get_Code_Success);
    }
    /**登录结果 */
    onAccountLogin(data: s2cAccountLogin) {
        if (200 != data.code) {
            console.log("登录失败", data.msg);
            ViewsMgr.removeWaiting();
            ViewsManager.showAlert(data.msg ? data.msg : "数据异常", () => {
                this.initUI();
            });
            return;
        }
        console.log("登录成功");
        director.loadScene(SceneType.MainScene);
    }
    /**连接断开 */
    onSocketDis() {
        ViewsMgr.removeWaiting();
    }
    /**连接服务器 */
    connectServer() {
        NetMgr.connectNet();
    }
    /**账号密码登录 */
    accountLogin(account: string, pwd: string) {
        console.log("accountLogin account = ", account, " pwd = ", pwd);
        ViewsMgr.showWaiting();
        User.account = account;
        User.password = pwd;
        User.loginType = LoginType.account;
        ServiceMgr.accountService.accountLogin();
    }
    /**token登录 */
    tokenLogin(token: string) {
        ViewsMgr.showWaiting();
        User.memberToken = token;
        User.loginType = LoginType.token;
        ServiceMgr.accountService.tokenLogin();
    }
    /**手机号验证码登录 */
    mobileLogin(mobile: string, code: string) {
        console.log("mobileLogin mobile = ", mobile, " code = ", code);
        ServiceMgr.accountService.reqPhoneCodeLogin(mobile, code);
    }
    /**手机号一键登录 */
    mobileQuickLogin(mobile: string) {
        console.log("mobileQuickLogin mobile = ", mobile);
    }
    /**微信登录 */
    wxLogin() {
        console.log("wxLogin");
    }


    // 老接口
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
        return true;
    }
    // 用户初始化成功
    userInitSuc() {
        director.loadScene(SceneType.MainScene);
    }
}