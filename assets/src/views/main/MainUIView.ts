import { _decorator, Component, Node, Sprite } from 'cc';
import { MainScene, MapStatus } from './MainScene';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('MainUIView')
export class MainUIView extends Component {
    @property(Node)
    public btnHead:Node = null;//头像
    @property(Sprite)
    public btnMenu:Sprite = null;//菜单
    @property(Sprite)
    public btnOnlineGift:Sprite = null;//在线礼包
    @property(Sprite)
    public btnReview:Sprite = null;//复习计划
    @property(Sprite)
    public btnTranslate:Sprite = null;//翻译查词
    @property(Sprite)
    public btnEdit:Sprite = null;//编辑
    @property(Sprite)
    public btnBoss:Sprite = null;//BOSS
    @property(Sprite)
    public btnShop:Sprite = null;//商店
    @property(Sprite)
    public btnTask:Sprite = null;//任务
    @property(Sprite)
    public btnTaskGo:Sprite = null;//任务前往
    @property(Sprite)
    public btnStudy:Sprite = null;//学习


    private _mainScene:MainScene = null;//主场景

    start() {
        this.init();
    }

    update(deltaTime: number) {
        
    }
    //销毁
    protected onDestroy(): void {
        this.destoryEvent();
    }
    //初始化
    public init():void {
        this.initEvent();
    }
    //设置主场景
    public set mainScene(mainScene:MainScene){
        this._mainScene = mainScene;
    }
    //初始化事件
    public initEvent(){
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
    //销毁事件
    public destoryEvent(){
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
    public onClickHead(){
        
    }
    //菜单点击
    public onClickMenu(){
        
    }
    //在线礼包点击
    public onClickOnlineGift(){
        
    }
    //复习计划点击
    public onClickReview(){
        
    }
    //翻译查词点击
    public onClickTranslate(){
        
    }
    //编辑点击
    public onClickEdit(){
        this._mainScene.changeMapStatus(MapStatus.EDIT);
        this.node.active = false;
    }
    //BOSS点击
    public onClickBoss(){
        
    }
    //商店点击
    public onClickShop(){
        
    }
    //任务点击
    public onClickTask(){
        
    }
    //任务前往点击
    public onClickTaskGo(){
        
    }
    //学习点击
    public onClickStudy(){
        
    }
}


