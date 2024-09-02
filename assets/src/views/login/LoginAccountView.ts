import { _decorator, EditBox, Node } from 'cc';
import { KeyConfig } from '../../config/KeyConfig';
import { TextConfig } from '../../config/TextConfig';
import { ViewsMgr } from '../../manager/ViewsManager';
import { LoginType, User } from '../../models/User';
import { ServiceMgr } from '../../net/ServiceManager';
import CCUtil from '../../util/CCUtil';
import StorageUtil from '../../util/StorageUtil';
import { LoginMiddleBase } from './LoginMiddleBase';
const { ccclass, property } = _decorator;

@ccclass('LoginAccountView')
export class LoginAccountView extends LoginMiddleBase {
    @property(EditBox)
    public userNameEdit: EditBox = null;     // 用户名输入框
    @property(EditBox)
    public pwdEdit: EditBox = null;          // 密码输入框
    @property(Node)
    public btnAccountLogin: Node = null;     // 账号登录按钮
    @property(Node)
    public btnGoToPhoneCode: Node = null;    // 去手机号登录按钮
    @property(Node)
    public btnGoToRegister: Node = null;     // 去注册按钮

    protected onLoad(): void {
        this.initEvent();
        this.init();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }

    private initEvent() {
        CCUtil.onTouch(this.btnAccountLogin, this.btnLoginClick, this);
        CCUtil.onTouch(this.btnGoToPhoneCode, this.btnGoToPhoneCodeClick, this);
        CCUtil.onTouch(this.btnGoToRegister, this.btnGoToRegisterClick, this);
    }
    private removeEvent() {
        CCUtil.offTouch(this.btnAccountLogin, this.btnLoginClick, this);
        CCUtil.offTouch(this.btnGoToPhoneCode, this.btnGoToPhoneCodeClick, this);
        CCUtil.offTouch(this.btnGoToRegister, this.btnGoToRegisterClick, this);
    }
    private init() {
        let account = StorageUtil.getData(KeyConfig.Last_Login_Account, "");
        let password = StorageUtil.getData(KeyConfig.Last_Login_Pwd, "");
        if (account && password) {
            this.userNameEdit.string = account;
            this.pwdEdit.string = password;
        }
    }
    /** 登录 */
    private btnLoginClick() {
        if (!this.checkAgree()) {
            return;
        }
        let userName = this.userNameEdit.string;
        let pwd = this.pwdEdit.string;
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
    /**账号密码登录 */
    private accountLogin(account: string, pwd: string) {
        console.log("accountLogin account = ", account, " pwd = ", pwd);
        ViewsMgr.showWaiting();
        User.account = account;
        User.password = pwd;
        User.loginType = LoginType.account;
        ServiceMgr.accountService.accountLogin();
    }
    /**去手机号登录 */
    private btnGoToPhoneCodeClick() {
        this.goToCode();
    }
    /**去注册 */
    private btnGoToRegisterClick() {
        this.goToRegister();
    }
}


