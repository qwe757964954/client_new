import { _decorator, Component, EditBox, Enum, Label, Node} from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
import { User } from '../../models/User';
import { PopView } from '../common/PopView';
import { NetManager } from '../../net/NetManager';
const { ccclass, property } = _decorator;

@ccclass('ChangeNameView')
export class ChangeNameView extends Component {
    
    @property(Label)
    public msgTxt:Label = null;     // 修改限制提示
    @property(EditBox)
    public editBox:EditBox = null;  // 预览的头像框

    start() {
        this.init();
    }

    //初始化
    public init():void {
        this.initUI();
    }
    // 初始化UI
    initUI() {
        this.msgTxt.string = "本月剩余修改次数：" + (2 - User.instance.editRealNameNum);
        this.editBox.string = User.instance.userName;
    }

    // 关闭
    btnCloseFunc() {
        console.log("btnCloseFunc");
        ViewsManager.instance.closeView(PrefabType.ChangeNameView);
    }
    // 头像框tab
    btnChangeNameFunc() {
        if (User.instance.editRealNameNum >= 2) {
            ViewsManager.instance.showView(PrefabType.PopView, (node:Node)=>{
                node.getComponent(PopView).init("本月改名次数已用完");
            });
            return;
        }
        let txt = this.editBox.string;
        if (txt == "") {
            ViewsManager.instance.showView(PrefabType.PopView, (node:Node)=>{
                node.getComponent(PopView).init("名称不能为空哦");
            });
            return;
        }
        console.log("userName = ", User.instance.userName, " txt = ", txt);
        if (User.instance.userName == txt) {
            ViewsManager.instance.showView(PrefabType.PopView, (node:Node)=>{
                node.getComponent(PopView).init("修改后的名称不能和之前相同哦");
            });
            return;
        }
        // 请求数据
        // NetManager.instance.reqChangeRealNameData(txt);
        // PbServiceManager.accountService.accountEidt(this.accountNameTxt.text, (datas) => {
        //     if (this.isClose) return;
        //     if (datas.Code == 200) {
        //         Tool.tip("名称修改成功");
        //         GameData.accountInfoModule.realName = this.accoutName = this.accountNameTxt.text;
        //         User.instance.editRealNameNum++;
        //         this.msgTxt.string = "本月剩余修改次数：" + (2 - User.instance.editRealNameNum);
        //     } else {
        //         Tool.tip(datas.Msg);
        //     }
        // });
    }
}


