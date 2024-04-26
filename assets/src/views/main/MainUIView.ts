import { _decorator, Button, Component, director, Node, Sprite } from 'cc';
import { MapStatus } from '../../config/MapConfig';
import { PrefabType, SceneType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import CCUtil from '../../util/CCUtil';
import { MainScene } from './MainScene';
const { ccclass, property } = _decorator;

@ccclass('MainUIView')
export class MainUIView extends Component {
    @property(Node)
    public btnHead: Node = null;//头像
    @property(Sprite)
    public btnMenu: Sprite = null;//菜单
    @property(Sprite)
    public btnOnlineGift: Sprite = null;//在线礼包
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
    @property(Button)
    public btnTextbook: Button = null;//教材单词

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
        this.initEvent();
    }
    //设置主场景
    public set mainScene(mainScene: MainScene) {
        this._mainScene = mainScene;
    }
    //初始化事件
    public initEvent() {
        CCUtil.onTouch(this.btnHead, this.onClickHead, this);
        CCUtil.onTouch(this.btnMenu, this.onClickMenu, this);
        CCUtil.onTouch(this.btnOnlineGift, this.onClickOnlineGift, this);
        CCUtil.onTouch(this.btnReview, this.onClickReview, this);
        CCUtil.onTouch(this.btnTranslate, this.onClickTranslate, this);
        CCUtil.onTouch(this.btnEdit, this.onClickEdit, this);
        CCUtil.onTouch(this.btnBoss, this.onClickBoss, this);
        CCUtil.onTouch(this.btnShop, this.onClickShop, this);
        CCUtil.onTouch(this.btnTask, this.onClickTask, this);
        CCUtil.onTouch(this.btnTaskGo, this.onClickTaskGo, this);
        CCUtil.onTouch(this.btnStudy, this.onClickStudy, this);
    }
    //移除事件
    public removeEvent() {
        CCUtil.offTouch(this.btnHead, this.onClickHead, this);
        CCUtil.offTouch(this.btnMenu, this.onClickMenu, this);
        CCUtil.offTouch(this.btnOnlineGift, this.onClickOnlineGift, this);
        CCUtil.offTouch(this.btnReview, this.onClickReview, this);
        CCUtil.offTouch(this.btnTranslate, this.onClickTranslate, this);
        CCUtil.offTouch(this.btnEdit, this.onClickEdit, this);
        CCUtil.offTouch(this.btnBoss, this.onClickBoss, this);
        CCUtil.offTouch(this.btnShop, this.onClickShop, this);
        CCUtil.offTouch(this.btnTask, this.onClickTask, this);
        CCUtil.offTouch(this.btnTaskGo, this.onClickTaskGo, this);
        CCUtil.offTouch(this.btnStudy, this.onClickStudy, this);
    }
    //头像点击
    public onClickHead() {
        ViewsManager.instance.showView(PrefabType.SettingView);
    }
    //菜单点击
    public onClickMenu() {

    }
    //在线礼包点击
    public onClickOnlineGift() {

    }
    //复习计划点击
    public onClickReview() {

    }
    //翻译查词点击
    public onClickTranslate() {

    }
    //编辑点击
    public onClickEdit() {
        this._mainScene.changeMapStatus(MapStatus.EDIT);
    }
    //BOSS点击
    public onClickBoss() {

    }
    //商店点击
    public onClickShop() {

    }
    //任务点击
    public onClickTask() {

    }
    //任务前往点击
    public onClickTaskGo() {

    }
    //学习点击
    public onClickStudy() {
        director.loadScene(SceneType.WorldMapScene);
    }
    /**点击教材单词事件 */
    protected async onTextbookClick() {
        console.log("点击教材单词");
        ViewsManager.instance.showView(PrefabType.TextbookListView);
    }
}


