import { EditBox, Node, _decorator } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { ViewsMgr } from '../../manager/ViewsManager';
import CCUtil from '../../util/CCUtil';
import { ToolUtil } from '../../util/ToolUtil';
import { LoginMiddleBase } from './LoginMiddleBase';
const { ccclass, property } = _decorator;

@ccclass('LoginRegisterView')
export class LoginRegisterView extends LoginMiddleBase {
    @property(EditBox)
    public userNameEdit: EditBox = null;     // 用户名输入框
    @property(EditBox)
    public pwdEdit: EditBox = null;          // 密码输入框
    @property(Node)
    public btnRefresh: Node = null;          // 刷新按钮
    @property(Node)
    public btnPassword: Node = null;         // 明文按钮
    @property(Node)
    public btnAccountLogin: Node = null;     // 账号登录按钮
    @property(Node)
    public btnGoToAccount: Node = null;     // 去账号登录按钮
    @property(Node)
    public btnGoToPhoneCode: Node = null;    // 去手机号登录按钮

    protected onLoad(): void {
        this.initEvent();
        this.init();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }

    private initEvent() {
        CCUtil.onTouch(this.btnRefresh, this.btnRefreshClick, this);
        CCUtil.onTouch(this.btnPassword, this.btnPasswordClick, this);
        CCUtil.onTouch(this.btnAccountLogin, this.btnLoginClick, this);
        CCUtil.onTouch(this.btnGoToAccount, this.btnGoToAccountClick, this);
        CCUtil.onTouch(this.btnGoToPhoneCode, this.btnGoToPhoneCodeClick, this);
    }
    private removeEvent() {
        CCUtil.offTouch(this.btnRefresh, this.btnRefreshClick, this);
        CCUtil.offTouch(this.btnPassword, this.btnPasswordClick, this);
        CCUtil.offTouch(this.btnAccountLogin, this.btnLoginClick, this);
        CCUtil.offTouch(this.btnGoToAccount, this.btnGoToAccountClick, this);
        CCUtil.offTouch(this.btnGoToPhoneCode, this.btnGoToPhoneCodeClick, this);
    }
    private init() {
        this.btnRefreshClick();
        this.pwdEdit.string = "123456";
    }
    /** 刷新账号 */
    private btnRefreshClick() {
        let ret = ToolUtil.getRandomLetters(2).toLowerCase() + ToolUtil.getRandomNumbers(3);
        this.userNameEdit.string = ret;
    }
    /** 明文密码 */
    private btnPasswordClick() {
        this.pwdEdit.inputFlag = (this.pwdEdit.inputFlag == EditBox.InputFlag.PASSWORD) ? EditBox.InputFlag.DEFAULT : EditBox.InputFlag.PASSWORD;
    }
    /** 登录 */
    private btnLoginClick() {
        ViewsMgr.showTip(TextConfig.Function_Tip);//TODO 登录
    }
    /** 去账号登录 */
    private btnGoToAccountClick() {
        this.goToAccount();
    }
    /** 去验证码登录 */
    private btnGoToPhoneCodeClick() {
        this.goToCode();
    }

}


