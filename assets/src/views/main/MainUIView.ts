import { _decorator, Label, Node, Sprite } from 'cc';
import { MapStatus } from '../../config/MapConfig';
import { PrefabType, SceneType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { SceneMgr } from '../../manager/SceneMgr';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { ActivityInfoResponse } from '../../models/ActivityModel';
import { User } from '../../models/User';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { ActServer } from '../../service/ActivityService';
import CCUtil from '../../util/CCUtil';
import { ActConfig } from '../activities/ActivityConfig';
import { ReviewPlanView } from '../reviewPlan/ReviewPlanView';
import { MainRightActivity } from './MainRightActivity';
import { MainScene } from './MainScene';
const { ccclass, property } = _decorator;

@ccclass('MainUIView')
export class MainUIView extends BaseView {
    @property(Node)
    public btnHead: Node = null;//头像
    @property(Node)
    public btn_friend: Node = null;//头像
    @property(Sprite)
    public btnMenu: Sprite = null;//菜单
    @property(Sprite)
    public btnReview: Sprite = null;//复习计划
    @property(Sprite)
    public btnTranslate: Sprite = null;//翻译查词
    @property(Sprite)
    public btnEdit: Sprite = null;//编辑
    @property(Sprite)
    public btnBoss: Sprite = null;//BOSS
    @property(Sprite)
    public btnShop: Sprite = null;//商店
    @property(Sprite)
    public btnTask: Sprite = null;//任务
    @property(Sprite)
    public btnTaskGo: Sprite = null;//任务前往
    @property(Sprite)
    public btnStudy: Sprite = null;//学习
    @property(Label)
    public labelNick: Label = null;//昵称

    @property(Node)
    public operational_activities: Node = null;//

    private _mainScene: MainScene = null;//主场景
    private _mainRightActivity: MainRightActivity = null;//右侧活动
    /**初始化UI */
    initUI() {
        this.labelNick.string = User.nick;
        this.initViews();
        ActServer.reqGetActivityInfo();
    }

    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.MainRightActivity, (node) => {
                this._mainRightActivity = node.getComponent(MainRightActivity)
                this._mainRightActivity.showPos = this._mainRightActivity.node.position;
            }, {
                isAlignVerticalCenter: true,
                isAlignRight: true,
                verticalCenter: 0,
                right: -480
            }),
            this.initViewComponent(PrefabType.MainNotifyView, (node) => { }, {
                isAlignBottom: true,
                isAlignRight: true,
                bottom: -22.447,
                right: 44.158
            }, this.node.getChildByName("RightUp"))
        ]);
    }
    //设置主场景
    public set mainScene(mainScene: MainScene) {
        this._mainScene = mainScene;
    }
    protected onInitModuleEvent() {
        this.addModelListeners([
            [NetNotify.Classification_GetActivityInfo, this.onGetActivityInfo.bind(this)],
        ]);
    }

    onGetActivityInfo(data: ActivityInfoResponse) {
        ActConfig.updateActivityInfoResponse(data);
        const { draw_activity, sign_activity } = ActConfig.activityInfoResponse;
        this.operational_activities.active = draw_activity || sign_activity;
    }

    //初始化事件
    public initEvent() {
        CCUtil.onTouch(this.btnHead, this.onClickHead, this);
        CCUtil.onTouch(this.btnMenu, this.onClickMenu, this);
        CCUtil.onTouch(this.btnReview, this.onClickReview, this);
        CCUtil.onTouch(this.btnTranslate, this.onClickTranslate, this);
        CCUtil.onTouch(this.btnEdit, this.onClickEdit, this);
        CCUtil.onTouch(this.btnBoss, this.onClickBoss, this);
        CCUtil.onTouch(this.btnShop, this.onClickShop, this);
        CCUtil.onTouch(this.btnTask, this.onClickTask, this);
        CCUtil.onTouch(this.btnTaskGo, this.onClickTaskGo, this);
        CCUtil.onTouch(this.btnStudy, this.onClickStudy, this);
        CCUtil.onBtnClick(this.btn_friend, this.onClickFriend.bind(this));
        CCUtil.onBtnClick(this.operational_activities, this.onClickOperationalActivities.bind(this));
        CCUtil.onBtnClick(this.node.getChildByName('mask_node'), this.onMaskClick.bind(this));
    }
    //移除事件
    public removeEvent() {
        CCUtil.offTouch(this.btnHead, this.onClickHead, this);
        CCUtil.offTouch(this.btnMenu, this.onClickMenu, this);
        CCUtil.offTouch(this.btnReview, this.onClickReview, this);
        CCUtil.offTouch(this.btnTranslate, this.onClickTranslate, this);
        CCUtil.offTouch(this.btnEdit, this.onClickEdit, this);
        CCUtil.offTouch(this.btnBoss, this.onClickBoss, this);
        CCUtil.offTouch(this.btnShop, this.onClickShop, this);
        CCUtil.offTouch(this.btnTask, this.onClickTask, this);
        CCUtil.offTouch(this.btnTaskGo, this.onClickTaskGo, this);
    }
    /**好友点击 */
    async onClickFriend() {
        await ViewsManager.instance.showPopup(PrefabType.FriendsDialogView);
    }
    /**运营活动 */
    async onClickOperationalActivities() {
        // ViewsManager.instance.showTip(TextConfig.Function_Tip);
        // return
        await ViewsManager.instance.showViewAsync(PrefabType.ActivityView);
    }

    //头像点击
    public onClickHead() {
        ViewsManager.instance.showView(PrefabType.SettingView);
        // ViewsManager.showTip(TextConfig.Function_Tip);
    }
    //菜单点击
    public onClickMenu() {
        // ViewsManager.instance.showTip(TextConfig.Function_Tip);
        // return
        this.node.getChildByName('mask_node').active = true;
        this._mainRightActivity.onHidenClick();
    }
    //复习计划点击
    public onClickReview() {
        ViewsManager.instance.showView(PrefabType.ReviewPlanView, (node: Node) => {
            // this._mainScene.mapCamera.node.active = false;
            // this._mainScene.mapUICamera.node.active = false;
            node.getComponent(ReviewPlanView).setCloseCall(() => {
                // this._mainScene.mapCamera.node.active = true;
                // this._mainScene.mapUICamera.node.active = true;
            });
        });
    }
    //翻译查词点击
    public onClickTranslate() {
        ViewsManager.instance.showView(PrefabType.SearchWorldView);
        // ViewsManager.showTip(TextConfig.Function_Tip);
    }
    //编辑点击
    public onClickEdit() {
        this._mainScene.changeMapStatus(MapStatus.BUILD_EDIT);
    }
    //BOSS点击
    public onClickBoss() {
        ViewsManager.showTip(TextConfig.Function_Tip);
        // ViewsManager.instance.showView(PrefabType.WorldBossView);
    }
    //商店点击
    public onClickShop() {
        ViewsMgr.showView(PrefabType.ShopUIView);
    }
    onMaskClick() {
        this.node.getChildByName('mask_node').active = false;
        this._mainRightActivity.onHidenClick();
    }
    //任务点击
    public onClickTask() {
        console.log("onClickTask");
        // ViewsManager.showTip(TextConfig.Function_Tip);
        ViewsMgr.showView(PrefabType.WeekTaskView);
    }
    //任务前往点击
    public onClickTaskGo() {
        console.log("onClickTaskGo");
        // let a;
        // a.b.m = 1;
        ViewsMgr.showTip(TextConfig.Function_Tip);
    }
    //学习点击
    public onClickStudy() {
        SceneMgr.loadScene(SceneType.WorldMapScene);
    }
}


