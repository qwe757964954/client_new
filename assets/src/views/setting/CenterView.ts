import { Component, Label, Node, ProgressBar, Sprite, _decorator } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsManager } from '../../manager/ViewsManager';
import { UserPlayerDetail } from '../../models/SettingModel';
import { User } from '../../models/User';
import ImgUtil from '../../util/ImgUtil';
import { ChangeNameView } from './ChangeNameView';
const { ccclass, property } = _decorator;

@ccclass('CenterView')
export class CenterView extends Component {

    @property(Sprite)
    public headBox: Sprite = null;    // 预览的头像框
    @property(Sprite)
    public head: Sprite = null;       // 预览的头像

    @property(Label)
    public idTxt: Label = null;              // id
    @property(Label)
    public nameTxt: Label = null;            // 昵称
    @property(Label)
    public roletitleTxt: Label = null;       // 称号
    @property(Label)
    public levelTxt: Label = null;           // 称号等级
    @property(Label)
    public currentExpTxt: Label = null;      // 称号经验
    @property(ProgressBar)
    public roleTitleProgress: ProgressBar = null;  // 称号进度条

    private _playerDetail: UserPlayerDetail = null;

    start() {
        this.init();
    }

    //销毁
    protected onDestroy(): void {
        // this.destoryEvent();
    }

    //初始化
    public init(): void {
        
        // this.initEvent();
    }
    // 初始化头像/框
    public initHead() {
        let headBoxUrl = ImgUtil.getPropImgUrl(User.curHeadBoxPropId);
        let headUrl = ImgUtil.getAvatarUrl(User.avatarID);
        LoadManager.loadSprite(headBoxUrl, this.headBox);
        LoadManager.loadSprite(headUrl, this.head);
    }
    // 初始化用户id、昵称、称号等信息
    public updateUserInfo(data:UserPlayerDetail) {
        this.initHead();
        this._playerDetail = data;
        this.idTxt.string = data.user_id.toString();
        this.nameTxt.string = data.nick_name;
        // this.roletitleTxt.string = data.roletitle;
        // this.levelTxt.string = user.level.toString();
        this.currentExpTxt.string = data.exp.toString() + "/100";
        this.roleTitleProgress.progress = data.exp / 100;
    }

    //初始化事件
    public initEvent() {
        // CCUtil.onTouch(this.centerTab, this.onClickCenter, this);
    }
    //销毁事件
    public destoryEvent() {
        // CCUtil.offTouch(this.btnHead, this.onClickHead, this);
    }

    // 切换头像
    btnChangeHeadFunc() {
        console.log("btnChangeHeadFunc");
        ViewsManager.instance.showView(PrefabType.ChangeHeadView);
    }
    // 修改名称
    async btnChangeNameFunc() {
        console.log("btnChangeNameFunc");
        let node:Node = await ViewsManager.instance.showPopup(PrefabType.ChangeNameView);
        let nodeScript: ChangeNameView = node.getComponent(ChangeNameView);
        nodeScript.updataData(this._playerDetail);
    }
    // 称号信息
    btnLookTitleInfoFunc() {
        console.log("btnLookTitleInfoFunc");
    }
    // 我的表格
    btnMyTableFunc() {
        console.log("btnMyTableFunc");
        ViewsManager.instance.showView(PrefabType.MyTableView);
    }

    /**点击订阅学习周报事件 */
    btnSubscribeFunc() {
        console.log("btnSubscribeFunc");
        ViewsManager.instance.showView(PrefabType.SubscribeView);
    }
}


