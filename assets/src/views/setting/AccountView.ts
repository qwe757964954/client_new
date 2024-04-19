import { _decorator, Component } from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
const { ccclass, property } = _decorator;

@ccclass('AccountView')
export class AccountView extends Component {

    start() {
        this.init();
    }

    //销毁
    protected onDestroy(): void {
        // this.destoryEvent();
    }
    //初始化
    public init():void {
        // this.initEvent();
    }
    //初始化事件
    public initEvent(){
        // CCUtil.onTouch(this.centerTab, this.onClickCenter, this);
    }
    //销毁事件
    public destoryEvent(){
        // CCUtil.offTouch(this.btnHead, this.onClickHead, this);
    }

    // 激活码激活
    btnJiHuoFunc() {
        console.log("btnJiHuoFunc");
        ViewsManager.instance.showView(PrefabType.AccountActivationView);
    }
    // 充值
    btnChongZhiFunc() {
        console.log("btnChongZhiFunc");
    }
    // 剧情回顾
    btnJuQingHuiGuFunc() {
        console.log("btnJuQingHuiGuFunc");
    }
    // 切换角色
    btnChangeRoleFunc() {
        console.log("btnChangeRoleFunc");
    }
    // 会员中心
    btnVipCenterFunc() {
        console.log("btnVipCenterFunc");
        ViewsManager.instance.showView(PrefabType.MemberCentreView);
    }
    // 意见反馈
    btnFanKuiFunc() {
        console.log("btnFanKuiFunc");
    }
    // 账号注销
    btnZhuXiaoFunc() {
        console.log("btnZhuXiaoFunc");
    }
    // 用户隐私政策
    btnYinSiFunc() {
        console.log("btnYinSiFunc");
    }
    // 退出登录
    btnLoginOutFunc() {
        console.log("btnLoginOutFunc");
    }
}


