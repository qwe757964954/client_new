import { _decorator, Asset, Button, Color, Component, EditBox, Enum, instantiate, Label, Node, Size, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import CCUtil from '../../util/CCUtil';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabConfig, PrefabType } from '../../config/PrefabType';
import { PbConst } from '../../config/PbConst';
import ImgUtil from '../../util/ImgUtil';
import { LoadManager } from '../../manager/LoadManager';
import { User } from '../../models/User';
import { PopView } from '../common/PopView';
import { NetManager } from '../../net/NetManager';
const { ccclass, property } = _decorator;

const ChangeHeadTypeEnum = Enum({
    Type_HeadBox: 1,
    Type_Head: 2,
})

const DefaultHeadBoxId = 800;
const DefaultHeadId = 101;

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


