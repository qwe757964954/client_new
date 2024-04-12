import { _decorator, Asset, Button, Color, Component, Label, Node, ProgressBar, Sprite, SpriteFrame, Vec3 } from 'cc';
import CCUtil from '../../util/CCUtil';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { LoadManager } from '../../manager/LoadManager';
import ImgUtil from '../../util/ImgUtil';
import { User } from '../../models/User';
const { ccclass, property } = _decorator;

@ccclass('CenterView')
export class CenterView extends Component {
    
    @property(Sprite)
    public headBox:Sprite = null;    // 预览的头像框
    @property(Sprite)
    public head:Sprite = null;       // 预览的头像

    @property(Label)
    public idTxt:Label = null;              // id
    @property(Label)
    public nameTxt:Label = null;            // 昵称
    @property(Label)
    public roletitleTxt:Label = null;       // 称号
    @property(Label)
    public levelTxt:Label = null;           // 称号等级
    @property(Label)
    public currentExpTxt:Label = null;      // 称号经验
    @property(ProgressBar)
    public roleTitleProgress:ProgressBar = null;  // 称号进度条

    private _loadAssetAry:Asset[] = [];//加载资源数组

    start() {
        this.init();
    }

    //销毁
    protected onDestroy(): void {
        // this.destoryEvent();
        LoadManager.releaseAssets(this._loadAssetAry);
        this._loadAssetAry = [];
    }

    //初始化
    public init():void {
        this.initHead();
        this.initUserInfo();
        // this.initEvent();
    }
    // 初始化头像/框
    public initHead() {
        let headBoxUrl = ImgUtil.getPropImgUrl(User.instance.curHeadBoxPropId);
        let headUrl = ImgUtil.getAvatarUrl(User.instance.curHeadPropId);
        LoadManager.load(headBoxUrl, SpriteFrame).then((spriteFrame:SpriteFrame) => {
            if (ViewsManager.instance.isExistView(PrefabType.SettingView) && this.headBox) {
                this.headBox.spriteFrame = spriteFrame;
            }
            this._loadAssetAry.push(spriteFrame);
        });
        LoadManager.load(headUrl, SpriteFrame).then((spriteFrame:SpriteFrame) => {
            if (ViewsManager.instance.isExistView(PrefabType.SettingView) && this.head) {
                this.head.spriteFrame = spriteFrame;
            }
            this._loadAssetAry.push(spriteFrame);
        });
    }
    // 初始化用户id、昵称、称号等信息
    public initUserInfo() {
        let user = User.instance;
        this.idTxt.string = user.userId.toString();
        this.nameTxt.string = user.userName;
        this.roletitleTxt.string = user.roletitle;
        this.levelTxt.string = user.level.toString();
        this.currentExpTxt.string = user.currentExp.toString() + "/100";
        this.roleTitleProgress.progress = user.currentExp / 100;
    }

    //初始化事件
    public initEvent(){
        // CCUtil.onTouch(this.centerTab, this.onClickCenter, this);
    }
    //销毁事件
    public destoryEvent(){
        // CCUtil.offTouch(this.btnHead, this.onClickHead, this);
    }

    // 切换头像
    btnChangeHeadFunc() {
        console.log("btnChangeHeadFunc");
        ViewsManager.instance.showView(PrefabType.ChangeHeadView);
    }
    // 修改名称
    btnChangeNameFunc() {
        console.log("btnChangeNameFunc");
    }
    // 称号信息
    btnLookTitleInfoFunc() {
        console.log("btnLookTitleInfoFunc");
    }
    // 我的表格
    btnMyTableFunc() {
        console.log("btnMyTableFunc");
    }
}


