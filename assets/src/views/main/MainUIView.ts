import { _decorator, Component, director, Node, Size, Sprite, UITransform, v3, Vec3, View } from 'cc';
import { MapStatus } from '../../config/MapConfig';
import { PrefabType, SceneType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import GlobalConfig from '../../GlobalConfig';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { NetMgr } from '../../net/NetManager';
import CCUtil from '../../util/CCUtil';
import { TimerMgr } from '../../util/TimerMgr';
import { PetInteractionView } from '../map/PetInteractionView';
import { BrocastMgr } from '../notice/BrocastMgr';
import { MainScene } from './MainScene';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import { NoticeContentData } from '../notice/Brocast';
const { ccclass, property } = _decorator;

@ccclass('MainUIView')
export class MainUIView extends Component {
    @property(Node)
    public btnHead: Node = null;//头像
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
    @property(Node)
    public btnReviewFix: Node = null;//复习计划修复
    @property(Node)
    public btnTranslateFix: Node = null;//翻译查词修复
    @property(Node)
    public btnBrocast: Node = null;//点击公告
    //@property(Node) //跑马灯广播根结点
    //public brocastRoot: Node = null;
    @property(Node) //测试按钮，已经隐藏
    public btnTest: Node = null;

    private _mainScene: MainScene = null;//主场景

    start() {
        this.init();
    }

    update(deltaTime: number) {

    }
    //销毁
    protected onDestroy(): void {
        this.removeEvent();
    }
    //初始化
    public init(): void {
        this.initUI();
        this.initEvent();
        //this.setBrocast(); //跑马灯测试，不用此功能可注掉
    }
    /**初始化UI */
    initUI() {
        if (GlobalConfig.WIN_RATE < GlobalConfig.MAIN_RATE_MAX) {
            this.btnReview.node.position = this.btnReviewFix.position;
            this.btnTranslate.node.position = this.btnTranslateFix.position;
        }
    }
    //设置主场景
    public set mainScene(mainScene: MainScene) {
        this._mainScene = mainScene;
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
        CCUtil.onTouch(this.btnBrocast, this.onClickNotice, this);
        CCUtil.onTouch(this.btnTest, this.onClickTest, this);
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
        CCUtil.offTouch(this.btnBrocast, this.onClickNotice, this);
        CCUtil.offTouch(this.btnTest, this.onClickTest, this);
    }
    //头像点击
    public onClickHead() {
        // ViewsManager.instance.showView(PrefabType.SettingView);
        ViewsManager.showTip(TextConfig.Function_Tip);
    }
    //菜单点击
    public onClickMenu() {
        User.isAutoLogin = false;
        NetMgr.closeNet();
        director.loadScene(SceneType.LoginScene);
    }
    //复习计划点击
    public onClickReview() {
        //ViewsManager.instance.showView(PrefabType.ReviewMainView);
        ViewsManager.showTip(TextConfig.Function_Tip);
    }
    //翻译查词点击
    public onClickTranslate() {
        // ViewsManager.instance.showView(PrefabType.SearchWorldView);
        ViewsManager.showTip(TextConfig.Function_Tip);
    }
    //编辑点击
    public onClickEdit() {
        this._mainScene.changeMapStatus(MapStatus.EDIT);
    }
    //BOSS点击
    public onClickBoss() {
        // ViewsManager.showTip(TextConfig.Function_Tip);
        ViewsManager.instance.showView(PrefabType.WorldBossView, (node: Node) => {
        });
    }
    //商店点击
    public onClickShop() {
        // ViewsManager.showTip(TextConfig.Function_Tip);
        ViewsManager.instance.showView(PrefabType.ShopUIView, (node: Node) => {
        });
    }
    //任务点击
    public onClickTask() {
        console.log("onClickTask");
        ViewsManager.showTip(TextConfig.Function_Tip);
    }
    //任务前往点击
    public onClickTaskGo() {
        console.log("onClickTaskGo");
        //延迟一针调用，防止点击事件触发异常（后续点击会穿透）
        TimerMgr.once(() => {
            this._mainScene.hideMainUIView();
        }, 1);
        ViewsManager.instance.showView(PrefabType.PetInteractionView, (node: Node) => {
            node.getComponent(PetInteractionView).setRemoveCallback(() => {
                this._mainScene.showMainUIView();
            });
        });
    }
    //学习点击
    public onClickStudy() {
        director.loadScene(SceneType.WorldMapScene);
    }

    //点击公告
    public onClickNotice() {
        let data: NoticeContentData = {
            "id": "1001",
            "content": "这是一则公告\n公告内容明天公布\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新\n明天更新",
        };
        EventManager.emit(EventType.Notice_ShowNotice, data);
    }

    // 点击测试
    public onClickTest() {
        ViewsManager.instance.showView(PrefabType.AchieveDialogView, (node: Node) => {

        });
    }
}


