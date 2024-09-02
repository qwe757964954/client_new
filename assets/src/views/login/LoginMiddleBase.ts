import { _decorator, Toggle } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { ViewsMgr } from '../../manager/ViewsManager';
import { BaseComponent } from '../../script/BaseComponent';
const { ccclass, property } = _decorator;

@ccclass('LoginMiddleBase')
export class LoginMiddleBase extends BaseComponent {
    private _agreeToggle: Toggle = null;
    private _goToAccountCall: Function = null;
    private _goToCodeCall: Function = null;
    private _goToRegisterCall: Function = null;

    public set agreeToggle(toggle: Toggle) {
        this._agreeToggle = toggle;
    }
    public set goToAccountCall(call: Function) {
        this._goToAccountCall = call;
    }
    public set goToCodeCall(call: Function) {
        this._goToCodeCall = call;
    }
    public set goToRegisterCall(call: Function) {
        this._goToRegisterCall = call;
    }

    protected checkAgree() {
        if (this._agreeToggle && this._agreeToggle.isChecked) {
            return true;
        }
        ViewsMgr.showTip(TextConfig.Agree_Maksure_Tip);
        return false;
    }

    protected goToAccount() {
        if (this._goToAccountCall) {
            this._goToAccountCall();
        }
    }

    protected goToCode() {
        if (this._goToCodeCall) {
            this._goToCodeCall();
        }
    }

    protected goToRegister() {
        if (this._goToRegisterCall) {
            this._goToRegisterCall();
        }
    }
}


