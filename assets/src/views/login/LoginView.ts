import { _decorator, Component, EditBox, EventTouch, Label, Node, Sprite, sys, Toggle } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import StorageUtil from '../../util/StorageUtil';
import { HttpManager } from '../../net/HttpManager';
import { TimerMgr } from '../../util/TimerMgr';
const { ccclass, property } = _decorator;

// 隐私协议是否勾选过
const PRIVATE_HAS_CHECK_KEY = "private_has_check_key";
// 登录token
const LOGIN_INFO_KEY = "login_info_key";

@ccclass('LoginView')
export class LoginView extends Component {
    @property(Node)
    public middle:Node = null;              // middle节点

    @property(Node)
    public downLoadBox:Node = null;         // downLoadBox
    @property(Node)
    public appleQrCode:Node = null;         // qrCode-apple

    @property(Node)
    public loginBox:Node = null;            // 账号密码节点
    @property(EditBox)
    public userNameEdit:EditBox = null;     // 用户名输入框
    @property(EditBox)
    public pwdEdit:EditBox = null;          // 密码输入框
    @property(Node)
    public eyeHide:Node = null;             // btnEye节点
    @property(Node)
    public eyeShow:Node = null;             // btnEye节点

    @property(Node)
    public inputPhoneBox:Node = null;       // 手机号输入框节点
    @property(EditBox)
    public phoneEdit:EditBox = null;        // 手机号输入框
    @property(Node)
    public getCodeBox:Node = null;          // 验证码输入框节点
    @property(EditBox)
    public codeEdit:EditBox = null;         // 验证码输入框
    @property(Node)
    public codeButton:Node = null;          // 验证码重新获取按钮
    @property(Label)
    public codeTime:Label = null;           // 验证码倒计时

    @property(Node)
    public privacyAgreeBox:Node = null;     // 隐私协议节点
    @property(Node)
    public agreeTip:Node = null;            // 提示节点

    private _codeTime:number = 60;          // 验证码时间
    private _loopID:number = 0;             // 验证码循环id

    start() {
        
    }

    protected onEnable(): void {
        this.middle.active = false;
        // this.downLoadBox.active = false;
        // token检查
        this.checkToken();
    }

    checkToken() {
        // 有token且登录成功直接进入主界面，否则初始化UI
        let loginInfoStr = StorageUtil.getData(LOGIN_INFO_KEY);
        if (!loginInfoStr) {
            this.initUI();
            return;
        }
        try {
            let loginInfo = JSON.parse(loginInfoStr);
            HttpManager.reqTokenLogin(loginInfo?.LoginToken, (obj) => {
                if (!this.loginSuc(obj)) {
                    this.initUI();
                }
            }, () => {
                this.initUI();
            });
        } catch (error) {
            console.error(error);
            this.initUI();
        }
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
        HttpManager.reqAccountLogin(userName, pwd, 0, (obj) => {
            this.loginSuc(obj);
        }, () => {
            console.log("账号密码登录失败");
        })
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
            sys.openURL("https://www.chuangciyingyu.com/%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.htm");
        }
        else if (customEventData == "yinsi") {
            sys.openURL("https://www.chuangciyingyu.com/%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96.htm");
        }
    }

    // 下载
    btnDownLoadFunc(data: Event, customEventData: string) {
        console.log("btnDownLoadFunc customEventData = ", customEventData);
		if (customEventData == "Goole") {
			sys.openURL("https://www.google.cn/chrome/");
		}
        else if (customEventData == "Android") {
			sys.openURL("https://www.chuangciyingyu.com/chuangci_v20220720.apk");
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
        // 登录成功
        console.log("登录成功");
        StorageUtil.saveData(LOGIN_INFO_KEY, JSON.stringify({
            LoginToken: obj.LoginToken,
            MemberToken: obj.MemberToken,
            Mobile: obj.Mobile
        }));
        // 跳转主界面
        console.log("跳转主界面");
        return true;
    }
}