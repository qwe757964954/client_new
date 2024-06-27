import { _decorator, Component, director, Node } from 'cc';
import { PrefabType, SceneType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { UserPlayerDetail } from '../../models/SettingModel';
import { User } from '../../models/User';
import { NetMgr } from '../../net/NetManager';
import { ApplyLogoutView } from './ApplyLogoutView';
import { ChangeRoleView } from './ChangeRoleView';
const { ccclass, property } = _decorator;

@ccclass('AccountView')
export class AccountView extends Component {
    private _playerDetail:UserPlayerDetail = null;
    start() {
        this.init();
    }

    public updateUserInfo(data:UserPlayerDetail) {
        this._playerDetail = data;
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
    // 重置
    async btnChongZhiFunc() {
        console.log("btnChongZhiFunc");
        let node:Node = await ViewsManager.instance.showPopup(PrefabType.ResetPasswordView);
    }
    // 剧情回顾
    btnJuQingHuiGuFunc() {
        console.log("btnJuQingHuiGuFunc");
    }
    // 切换角色
    async btnChangeRoleFunc() {
        console.log("btnChangeRoleFunc");
        try {
            let node = await ViewsManager.instance.showViewAsync(PrefabType.ChangeRoleView);
            let changeRoleView = node.getComponent(ChangeRoleView);
            changeRoleView.updateData(this._playerDetail);
        } catch (error) {
            console.error("Failed to show ChangeRoleView", error);
        }
        // let node = await ViewsManager.instance.showViewAsync(PrefabType.ChangeRoleView);
        // node.getComponent(ChangeRoleView).updateData(this._playerDetail);
    }
    // 会员中心
    btnVipCenterFunc() {
        console.log("btnVipCenterFunc");
        ViewsManager.instance.showView(PrefabType.MemberCentreView);
    }
    // 意见反馈
    btnFanKuiFunc() {
        console.log("btnFanKuiFunc");
        ViewsManager.instance.showView(PrefabType.FeedbackView);
    }
    // 账号注销
    btnZhuXiaoFunc() {
        console.log("btnZhuXiaoFunc");
        ViewsManager.instance.showView(PrefabType.ApplyLogoutView,(node: Node) => {
            let itemScript = node.getComponent(ApplyLogoutView);
            itemScript.setAgreeCallback(()=>{
                console.log("agree  call  back");
                ViewsManager.instance.showView(PrefabType.LogoutView);
            })
        });
    }
    // 用户隐私政策
    btnYinSiFunc() {
        console.log("btnYinSiFunc");
    }
    // 退出登录
    btnLoginOutFunc() {
        console.log("btnLoginOutFunc");
        User.isAutoLogin = false;
        User.resetData();
        NetMgr.closeNet();
        director.loadScene(SceneType.LoginScene);
    }
}


