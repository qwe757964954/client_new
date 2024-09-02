import { _decorator, Button, EditBox, Label, Node } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { ViewsMgr } from '../../manager/ViewsManager';
import { ServiceMgr } from '../../net/ServiceManager';
import CCUtil from '../../util/CCUtil';
import { TimerMgr } from '../../util/TimerMgr';
import { ToolUtil } from '../../util/ToolUtil';
import { LoginMiddleBase } from './LoginMiddleBase';
const { ccclass, property } = _decorator;

@ccclass('LoginCodeView')
export class LoginCodeView extends LoginMiddleBase {
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
    @property(Node)
    public btnGoToRegister: Node = null;    // 去注册按钮

    private _codeTime: number = 0;          // 验证码时间
    private _loopID: number = null;             // 验证码循环id

    protected onLoad(): void {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
        this.clearTimer();
    }

    private initEvent() {
        CCUtil.onTouch(this.btnGoToAccount, this.btnGoToAccountClick, this);
        CCUtil.onTouch(this.btnGoToRegister, this.btnGoToRegisterClick, this);
        CCUtil.onTouch(this.btnCode, this.btnPhoneCodeClick, this);
        CCUtil.onTouch(this.btnCodeLogin, this.btnPhoneCodeLoginClick, this);
    }
    private removeEvent() {
        CCUtil.offTouch(this.btnGoToAccount, this.btnGoToAccountClick, this);
        CCUtil.offTouch(this.btnGoToRegister, this.btnGoToRegisterClick, this);
        CCUtil.offTouch(this.btnCode, this.btnPhoneCodeClick, this);
        CCUtil.offTouch(this.btnCodeLogin, this.btnPhoneCodeLoginClick, this);
    }
    /**清理定时器 */
    clearTimer() {
        if (this._loopID) {
            TimerMgr.stopLoop(this._loopID);
            this._loopID = null;
        }
    }
    /**去账号登录 */
    private btnGoToAccountClick() {
        this.goToAccount();
    }
    /**去注册 */
    private btnGoToRegisterClick() {
        this.goToRegister();
    }
    /**验证码 */
    private btnPhoneCodeClick() {
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
    private btnPhoneCodeLoginClick() {
        if (!this.checkAgree()) {
            return;
        }
        let phone = this.phoneEdit.string;
        let code = this.codeEdit.string;
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
    /**手机号验证码登录 */
    private mobileLogin(mobile: string, code: string) {
        console.log("mobileLogin mobile = ", mobile, " code = ", code);
        ServiceMgr.accountService.reqPhoneCodeLogin(mobile, code);
    }
}


