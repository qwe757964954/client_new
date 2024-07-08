import { _decorator, EditBox, Label } from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { UserPlayerDetail, UserPlayerModifyModel } from '../../models/SettingModel';
import { User } from '../../models/User';
import { BasePopup } from '../../script/BasePopup';
import { STServer } from '../../service/SettingService';
const { ccclass, property } = _decorator;

@ccclass('ChangeNameView')
export class ChangeNameView extends BasePopup {

    @property(Label)
    public msgTxt: Label = null;     // 修改限制提示
    @property(EditBox)
    public editBox: EditBox = null;  // 预览的头像框

    private _playerDetail:UserPlayerDetail = null;
    public initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("BG")]).then(()=>{
        });
    }
    updataData(data:UserPlayerDetail){
        this._playerDetail = data;
        this.updateUI();
        // this.updateUI();
    }

    // 初始化UI
    updateUI() {
        this.msgTxt.string = "本月剩余修改次数：" + (2 - User.editRealNameNum);
        this.editBox.string = this._playerDetail.nick_name;
    }

    // 关闭
    btnCloseFunc() {
        console.log("btnCloseFunc");
        this.closePop();
    }
    // 头像框tab
    btnChangeNameFunc() {
        if (User.editRealNameNum >= 2) {
            ViewsManager.showTip("本月改名次数已用完");
            return;
        }
        let txt = this.editBox.string;
        if (txt.length <= 2 || txt.length >= 20) {
            ViewsManager.showTip("昵称长度为2-20个字符");
            return;
        }
        console.log("userName = ", User.userName, " txt = ", txt);
        if (User.userName == txt) {
            ViewsManager.showTip("修改后的名称不能和之前相同哦");
            return;
        }
        let param:UserPlayerModifyModel ={
            nick_name:txt
        }
        STServer.reqUserPlayerModify(param);
        this.closePop();
        // 请求数据
        // NetMgr.reqChangeRealNameData(txt);
        // PbServiceManager.accountService.accountEidt(this.accountNameTxt.text, (datas) => {
        //     if (this.isClose) return;
        //     if (datas.Code == 200) {
        //         Tool.tip("名称修改成功");
        //         GameData.accountInfoModule.realName = this.accoutName = this.accountNameTxt.text;
        //         User.editRealNameNum++;
        //         this.msgTxt.string = "本月剩余修改次数：" + (2 - User.editRealNameNum);
        //     } else {
        //         Tool.tip(datas.Msg);
        //     }
        // });
    }
}


