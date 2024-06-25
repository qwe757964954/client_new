import { _decorator, Button, Color, Label, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { ViewsManager } from '../../manager/ViewsManager';
import { UserPlayerDetail } from '../../models/SettingModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { STServer } from '../../service/SettingService';
import { CenterView } from './CenterView';
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

    @property(Button)
    public centerTab:Button = null;     // 个人中心TAB
    @property(Button)
    public soundTab:Button = null;      // 声音设置TAB
    @property(Button)
    public accountTab:Button = null;    // 账户设置TAB
    @property(Button)
    public aboutUsTab:Button = null;    // 关于我们TAB
    // private _mainScene:MainScene = null;//主场景
    private initNavTitle() {
        this.createNavigation("设置",this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.SettingView);
        });
    }

    protected onInitModuleEvent() {
        this.addModelListeners([
            [NetNotify.Classification_UserPlayerDetail, this.onUserPlayerDetail.bind(this)],
        ]);
    }
    
    onUserPlayerDetail(data:UserPlayerDetail){
        console.log("onUserPlayerDetail data = ", data);
        this.center.getComponent(CenterView).updateUserInfo(data);
    }

    //初始化
    public initUI():void {
        GlobalConfig.initResolutionRules();
        this.initNavTitle();
        this.fetchInitialData();
        this.btnChangeTabFunc(null, "Center");
    }

    private fetchInitialData() {
        STServer.reqUserPlayerDetail();
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
    //销毁事件
    public destoryEvent(){
        // CCUtil.offTouch(this.btnHead, this.onClickHead, this);
        // CCUtil.offTouch(this.btnMenu, this.onClickMenu, this);
    }

    // 切换tab
    btnChangeTabFunc(data: Event, customEventData: string) {
        console.log("btnChangeTabFunc customEventData = ", customEventData);
        this.changeTabStaus(this.center, this.centerTab.node, false);
        this.changeTabStaus(this.sound, this.soundTab.node, false);
        this.changeTabStaus(this.account, this.accountTab.node, false);
        switch (customEventData) {
            case "Center":
                this.changeTabStaus(this.center, this.centerTab.node, true);
                break;
            case "Sound":
                this.changeTabStaus(this.sound, this.soundTab.node, true);
                break;
            case "Account":
                this.changeTabStaus(this.account, this.accountTab.node, true);
                break;
            default:
                this.changeTabStaus(this.center, this.centerTab.node, true);
                break;
        }
    }
    // 关于我们
    btnAboutUsFunc() {
        console.log("btnAboutUsFunc");
        ViewsManager.instance.showView(PrefabType.VideoView);
    }

    changeTabStaus(view: Node, tab: Node, visible: boolean) {
        view.active = visible;
        // 文字和底部图
        let lb = tab.getChildByName("Label");
        let sp = tab.getChildByName("Sprite");
        lb && (lb.getComponent(Label).color = visible ? new Color(255, 255, 255, 255) : new Color(83, 191, 34, 255));
        sp && (sp.active = visible);
    }

    // 返回主界面
    btnCloseFunc() {
        console.log("btnCloseFunc");
        ViewsManager.instance.closeView(PrefabType.SettingView);
        GlobalConfig.initRessolutionHeight();
    }
}


