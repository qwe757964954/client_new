import { EditBox, Node, _decorator } from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { UserPasswordModifyModel } from '../../models/SettingModel';
import { BasePopup } from '../../script/BasePopup';
import { STServer } from '../../service/SettingService';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('ResetPasswordView')
export class ResetPasswordView extends BasePopup {

    @property(EditBox)
    public passEdit:EditBox = null;

    @property(EditBox)
    public sureEdit:EditBox = null;

    @property(Node)
    public commit_btn:Node = null;

    @property(Node)
    public Close:Node = null;

    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("content")]).then(()=>{
        });
        this.passEdit.update();
        this.sureEdit.update();
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.commit_btn,this.onCommitClick.bind(this));
        CCUtil.onBtnClick(this.Close,this.onCloseClick.bind(this));
    }

    onCloseClick(){
        console.log('onCloseClick');
        this.closePop();
    }

    onCommitClick(){
        console.log('onCommitClick');
        let sure_text = this.sureEdit.string;
        let pass_text = this.passEdit.string;
        if (sure_text != pass_text) {
            ViewsManager.showTip("修改密码与确认密码不一致");
            return;
        }
        if (pass_text.length < 3) {
            ViewsManager.showTip("修改密码长度不能小于3位");
            return;
        }
        let param:UserPasswordModifyModel = {
            new_passwd:pass_text,
            confirm_passwd:sure_text,
        }
        STServer.reqUserPasswordModify(param);
        this.closePop();
    }
}


