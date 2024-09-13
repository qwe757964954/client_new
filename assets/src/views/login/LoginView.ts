import { _decorator, Node, sys, Toggle } from 'cc';
import { EventType } from '../../config/EventType';
import { KeyConfig } from '../../config/KeyConfig';
import { NetConfig } from '../../config/NetConfig';
import { PrefabType, SceneType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { SceneMgr } from '../../manager/SceneMgr';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { s2cAccountLogin, s2cGetPhoneCode } from '../../models/NetModel';
import { LoginType, User } from '../../models/User';
import { InterfacePath } from '../../net/InterfacePath';
import { NetMgr } from '../../net/NetManager';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import GlobalService from '../../service/GlobalService';
import CCUtil from '../../util/CCUtil';
import StorageUtil from '../../util/StorageUtil';
import { WxApi } from '../../util/third/WxApi';
import { ActivationCodeView } from './ActivationCodeView';
import { LoginAccountView } from './LoginAccountView';
import { LoginCodeView } from './LoginCodeView';
import { LoginMiddleBase } from './LoginMiddleBase';
import { LoginRegisterView } from './LoginRegisterView';
import { QRCodeView } from './QRCodeView';
const { ccclass, property } = _decorator;

// 隐私协议是否勾选过
const PRIVATE_HAS_CHECK_KEY = "private_has_check_key";
// 登录信息
const LOGIN_INFO_KEY = "login_info_key";

@ccclass('LoginView')
export class LoginView extends BaseComponent {
    @property(Node)
    public middle: Node = null;              // middle节点
    @property(Node)
    public plMiddle: Node = null;             // middle节点
    @property(Node)
    public btnWxLogin: Node = null;          // 微信登录按钮

    @property(Toggle)
    public agreeToggle: Toggle = null;       // 隐私协议确认
    @property(Node)
    public btnAgree: Node = null;            // 用户协议
    @property(Node)
    public btnPrivacy: Node = null;          // 隐私协议
    @property(Node)
    public agreeTip: Node = null;            // 提示节点

    private plQRCode: QRCodeView = null;      // 二维码
    private plActivationCode: ActivationCodeView = null;      // 激活码
    private plMiddleAry: Node[] = [];          // middle节点数组
    private _isInitUI = false;                  // 是否初始化UI

    protected start() {
        WxApi.isWxInstalled();
        this.iniEvent();
        GlobalService.getInstance();
        this.connectServer();

        this.checkToken();
        DataMgr.instance.initData();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    //初始化事件
    private iniEvent() {
        this.addEvent(InterfacePath.c2sAccountLogin, this.onAccountLogin.bind(this));
        this.addEvent(InterfacePath.c2sTokenLogin, this.onAccountLogin.bind(this));
        this.addEvent(InterfacePath.c2sPhoneCodeLogin, this.onAccountLogin.bind(this));
        this.addEvent(EventType.Socket_ReconnectFail, this.onSocketDis.bind(this));

        CCUtil.onTouch(this.btnWxLogin, this.wxLogin, this);
        CCUtil.onTouch(this.btnAgree, this.btnUserAgreeClick, this);
        CCUtil.onTouch(this.btnPrivacy, this.btnPrivacyClick, this);

        this.agreeToggle.node.on(Toggle.EventType.TOGGLE, this.onToggle, this);

    }
    /**移除事件 */
    private removeEvent() {
        this.clearEvent();

        CCUtil.offTouch(this.btnWxLogin, this.wxLogin, this);
        CCUtil.offTouch(this.btnAgree, this.btnUserAgreeClick, this);
        CCUtil.offTouch(this.btnPrivacy, this.btnPrivacyClick, this);
    }

    private checkToken() {
        if (User.isAutoLogin) {
            let token = StorageUtil.getData(KeyConfig.Last_Login_Token, "");
            if (token && "" != token) {
                this.middle.active = false;
                User.isLogin = true;//标记账号已经登录过，用来重连
                this.tokenLogin(token);
                return;
            }
        }
        this.initUI();
    }

    private initUI() {
        this._isInitUI = true;
        this.showMiddleAcount(() => {
            this.middle.active = true;
            // 隐私协议
            let privateHasCheck = StorageUtil.getData(PRIVATE_HAS_CHECK_KEY, "0") == "0" ? false : true;
            this.agreeToggle.isChecked = privateHasCheck;
            this.agreeTip.active = !privateHasCheck;
            this.btnWxLogin.active = true;// 微信登录按钮
        });
    }
    /**设置LoginMiddleBase */
    private setLoginMiddleBase(view: LoginMiddleBase) {
        view.agreeToggle = this.agreeToggle;
        view.goToAccountCall = this.showMiddleAcount.bind(this);
        view.goToCodeCall = this.showMiddlePhoneCode.bind(this);
        view.goToRegisterCall = this.showMiddleRegister.bind(this);
    }

    /**用户协议 */
    private btnUserAgreeClick() {
        sys.openURL(NetConfig.userAgreement);
    }
    /**隐私政策 */
    private btnPrivacyClick() {
        sys.openURL(NetConfig.privacyPage);
    }

    // 隐私选中方法
    private onToggle(toggle: Toggle) {
        StorageUtil.saveData(PRIVATE_HAS_CHECK_KEY, toggle.isChecked ? "1" : "0");
        this.agreeTip.active = !toggle.isChecked;
    }
    /**显示账号密码登录 */
    private showMiddleAcount(callBack?: Function) {
        let isLoad = false;
        for (let i = 0; i < 3; i++) {
            const element = this.plMiddleAry[i];
            if (element) {
                element.active = 0 == i;
            } else {
                if (0 == i) {
                    isLoad = true;
                    LoadManager.loadPrefab(PrefabType.LoginAccountView.path, this.plMiddle).then((node: Node) => {
                        this.plMiddleAry[0] = node;
                        let view = node.getComponent(LoginAccountView);
                        this.setLoginMiddleBase(view);
                        if (callBack) callBack();
                    });
                }
            }
        }
        if (!isLoad && callBack) callBack();
    }
    /**显示验证码登录 */
    private showMiddlePhoneCode() {
        for (let i = 0; i < 3; i++) {
            const element = this.plMiddleAry[i];
            if (element) {
                element.active = 1 == i;
            } else {
                if (1 == i) {
                    LoadManager.loadPrefab(PrefabType.LoginCodeView.path, this.plMiddle).then((node: Node) => {
                        this.plMiddleAry[1] = node;
                        let view = node.getComponent(LoginCodeView);
                        this.setLoginMiddleBase(view);
                    });
                }
            }
        }
    }
    /**显示注册登录 */
    private showMiddleRegister() {
        for (let i = 0; i < 3; i++) {
            const element = this.plMiddleAry[i];
            if (element) {
                element.active = 2 == i;
            } else {
                if (2 == i) {
                    LoadManager.loadPrefab(PrefabType.LoginRegisterView.path, this.plMiddle).then((node: Node) => {
                        this.plMiddleAry[2] = node;
                        let view = node.getComponent(LoginRegisterView);
                        this.setLoginMiddleBase(view);
                    });
                }
            }
        }
    }
    /**二维码层返回 */
    private onPlQrCodeBack() {
        this.middle.active = true;
        if (this.plQRCode) this.plQRCode.node.active = false;
        if (this.plActivationCode) this.plActivationCode.node.active = false;
    }
    /**激活码层返回 */
    private onPlActivationCodeBack() {
        this.middle.active = true;
        if (this.plQRCode) this.plQRCode.node.active = false;
        if (this.plActivationCode) this.plActivationCode.node.active = false;
    }
    /**激活码激活 */
    private onActivationCodeActive(code: string) {
        if ("" == code) {
            ViewsMgr.showTip(TextConfig.ActivationCode_Null_Tip);
            return;
        }
        ViewsMgr.showTip(TextConfig.Function_Tip);//TODO 激活码验证
    }
    /**显示二维码层 */
    private showPlQRCode() {
        this.middle.active = false;
        LoadManager.loadPrefab(PrefabType.QRCodeView.path, this.node).then((node: Node) => {
            this.plQRCode = node.getComponent(QRCodeView);
            this.plQRCode.setBackCall(this.onPlQrCodeBack.bind(this));
        });
        if (this.plActivationCode) {
            this.plActivationCode.node.active = false;
        }
    }
    /**显示激活码层 */
    private showPlActivationCode() {
        this.middle.active = false;
        if (this.plQRCode) {
            this.plQRCode.node.active = false;
        }
        LoadManager.loadPrefab(PrefabType.ActivationCodeView.path, this.node).then((node: Node) => {
            this.plActivationCode = node.getComponent(ActivationCodeView);
            this.plActivationCode.setCallFunc(this.onPlActivationCodeBack.bind(this), this.onActivationCodeActive.bind(this));
        });
    }

    /**验证码结果 */
    private onRepGetPhoneCode(data: s2cGetPhoneCode) {
        if (200 != data.code) {
            ViewsMgr.showTip(data.msg);
            return;
        }
        ViewsMgr.showTip(TextConfig.Get_Code_Success);
    }
    /**登录结果 */
    private onAccountLogin(data: s2cAccountLogin) {
        if (200 != data.code) {
            console.log("登录失败", data.msg);
            ViewsMgr.removeWaiting();
            ViewsManager.showAlert(data.msg ? data.msg : "数据异常", () => {
                this.initUI();
            });
            return;
        }
        console.log("登录成功", data);
        SceneMgr.loadScene(SceneType.MainScene);
    }
    /**连接断开 */
    private onSocketDis() {
        ViewsMgr.removeWaiting();
        // if (!this._isInitUI) {
        //     this.initUI();
        // }
    }
    /**连接服务器 */
    private connectServer() {
        NetMgr.connectNet();
    }

    /**token登录 */
    private tokenLogin(token: string) {
        ViewsMgr.showWaiting();
        User.memberToken = token;
        User.loginType = LoginType.token;
        ServiceMgr.accountService.tokenLogin();
    }

    /**手机号一键登录 */
    private mobileQuickLogin(mobile: string) {
        console.log("mobileQuickLogin mobile = ", mobile);
    }
    /**微信登录 */
    private wxLogin() {
        console.log("wxLogin", WxApi.isWxInstall);
        if (WxApi.isWxInstall) {
            WxApi.wxLogin((code) => {
                console.log("wxLogin code = ", code);
                ViewsMgr.showTip(TextConfig.Function_Tip);
            });
        } else {
            this.showPlQRCode();
        }
    }
}