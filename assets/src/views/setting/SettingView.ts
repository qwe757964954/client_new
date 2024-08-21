import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { UserPlayerDetail } from '../../models/SettingModel';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { STServer } from '../../service/SettingService';
import { AccountView } from './AccountView';
import { CenterView } from './CenterView';
import { SettingTabType } from './SettingInfo';
import { SettingTabView } from './SettingTabView';
const { ccclass, property } = _decorator;

@ccclass('SettingView')
export class SettingView extends BaseView {
    @property(Node)
    public center:Node = null;          // 个人中心
    @property(Node)
    public top_layout:Node = null;          // 个人中心
    @property(Node)
    public sound:Node = null;           // 声音设置
    @property(Node)
    public account:Node = null;         // 账户设置
    // private _mainScene:MainScene = null;//主场景
    
    private _tabView:SettingTabView = null;
    protected onInitModuleEvent() {
        this.addModelListeners([
            [NetNotify.Classification_UserPlayerDetail, this.onUserPlayerDetail.bind(this)],
            [NetNotify.Classification_UserPlayerModify, this.onUserPlayerModify.bind(this)],
        ]);
    }
    
    onUserPlayerModify(data:any){
        console.log("onUserPlayerModify data = ", data);
        STServer.reqUserPlayerDetail();
    }

    onUserPlayerDetail(data:UserPlayerDetail){
        console.log("onUserPlayerDetail data = ", data);
        User.roleID = data.role_id;
        User.avatarID = parseInt(data.avatar);
        this.center.getComponent(CenterView).updateUserInfo(data);
        this.account.getComponent(AccountView).updateUserInfo(data);
    }

    //初始化
    public async initUI() {
        this.initNavTitle();
        await this.initViews();
        this.initTabLisen();
        this.fetchInitialData();
    }
    private initTabLisen() {
        this._tabView.setTabClickListener(this.onClickTab.bind(this));
        this._tabView.updateTabDatas();
    }
    private initNavTitle() {
        this.createNavigation("设置",this.top_layout, () => {
            ViewsMgr.closeView(PrefabType.SettingView);
        });
    }
    private fetchInitialData() {
        STServer.reqUserPlayerDetail();
    }

    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.SettingTabView, (node) => this._tabView = node.getComponent(SettingTabView), {
                isAlignHorizontalCenter: true,
                isAlignTop: true,
                top: 153.493,
                horizontalCenter: 0
            }),
        ]);
    }

    // //设置主场景
    // public set mainScene(mainScene:MainScene){
    //     this._mainScene = mainScene;
    // }
    //初始化事件
    public initEvent(){
        // CCUtil.onTouch(this.centerTab, this.onClickCenter, this);
        // CCUtil.onTouch(this.btnMenu, this.onClickMenu, this);
    }

    hidenAllFriendView(){
        this.center.active = false;
        this.sound.active = false;
        this.account.active = false;
        // this._fEmailView.node.active = false;
    }

    onClickTab(click:SettingTabType) {
        this.hidenAllFriendView();
        switch (click) {
            case SettingTabType.Center:
                this.center.active = true;
                break;
            case SettingTabType.Sound:
                this.sound.active = true;
                break;
            case SettingTabType.Account:
                this.account.active = true;
                break;
            case SettingTabType.About:
                this.btnAboutUsFunc();
                break;
            default:
                this.center.active = true;
                break;
        }
    }

    // 关于我们
    btnAboutUsFunc() {
        console.log("btnAboutUsFunc");
        ViewsManager.showTip(TextConfig.Function_Tip);
        // ViewsMgr.showView(PrefabType.VideoView);
    }

    // 返回主界面
    btnCloseFunc() {
        console.log("btnCloseFunc");
        ViewsMgr.closeView(PrefabType.SettingView);
    }
}


