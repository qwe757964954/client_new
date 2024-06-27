import { _decorator, Label, Node, Prefab } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType, PrefabTypeEntry } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ViewsManager } from '../../manager/ViewsManager';
import { DataFriendApplyListResponse, DataFriendListResponse, FriendListItemModel, SystemMailItem, SystemMailListResponse, UserFriendData } from '../../models/FriendModel';
import { NetNotify } from '../../net/NetNotify';
import { BasePopup } from '../../script/BasePopup';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import { FriendAddView } from './FriendAddView';
import { FriendEmailView } from './FriendEmailView';
import { FriendTabType } from './FriendInfo';
import { FriendLeftTabView } from './FriendLeftTabView';
import { FriendListView } from './FriendListView';
import { FriendMessageView } from './FriendMessageView';
import { FriendPlayerInfoView } from './FriendPlayerInfoView';
import { FriendTalkDialogView } from './FriendTalkDialogView';
const { ccclass, property } = _decorator;

export enum FriendRightStatus {
    Friend = 1,
    Email = 2
}


@ccclass('FriendsDialogView')
export class FriendsDialogView extends BasePopup {
    @property({ type: Node, tooltip: "关闭按钮" })
    public closeBtn: Node = null;

    @property({ type: Node, tooltip: "所有内容根结点" })
    public contentNd: Node = null;

    @property({ type: Label, tooltip: "标题" }) // 
    public titleTxt: Label = null;

    @property({ type: Prefab, tooltip: "邮件列表中的奖励预制体" })
    public preRewardItem: Prefab = null;//
    @property(Node)
    public innerNode: Node = null;


    private _leftTab:FriendLeftTabView = null;
    private _rightPlayerInfo:FriendPlayerInfoView = null;
    private _fListView:FriendListView = null;
    private _fAddView:FriendAddView = null;
    private _fMsgView:FriendMessageView = null;
    private _fEmailView:FriendEmailView = null;

    private _friend_list:FriendListItemModel[] = [];
    
    async initUI() {
        this.enableClickBlankToClose([this.node.getChildByName("content")]).then(()=>{
        });
        await this.initViews();
        this.initData();
        this.node.getChildByName("content").setSiblingIndex(99);
        this.setLeftTab();
        this.setFriendListSelect();
        this.setEmailListSelect();
    }
    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [NetNotify.Classification_UserFriendList, this.onUpdateFriendList],
            [NetNotify.Classification_UserFriendApplyList, this.onUpdateApplyFriendList],
            [NetNotify.Classification_UserFriendSearch, this.onSearchFriendResult],
            [NetNotify.Classification_UserFriendApplyModify, this.onUserFriendApplyModify],
            [NetNotify.Classification_UserDelFriendMessage, this.onUserDelFriendMessage],
            [NetNotify.Classification_UserSystemMailList, this.onUserSystemMailList],
            [NetNotify.Classification_UserSystemMailDetail, this.onUserSystemMailDetail],
            [EventType.Friend_Talk_Event, this.onFriendTalk],
        ]);
    }
    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.FriendLeftTabView, (node) => this._leftTab = node.getComponent(FriendLeftTabView), {
                isAlignTop: true,
                isAlignLeft: true,
                top: 229,
                left: 37
            }),
            this.initViewComponent(PrefabType.FriendPlayerInfoView, (node) => this._rightPlayerInfo = node.getComponent(FriendPlayerInfoView), {
                isAlignVerticalCenter: true,
                isAlignRight: true,
                verticalCenter: 0,
                right: 0
            }),
            this.initViewComponent(PrefabType.FriendListView, (node) => this._fListView = node.getComponent(FriendListView), {
                isAlignLeft: true,
                isAlignRight: true,
                isAlignBottom: true,
                isAlignTop: true,
                left: 43.8995,
                right: 43.8995,
                bottom: 20.0795,
                top: 20.0795
            },this.innerNode),
            this.initViewComponent(PrefabType.FriendAddView, (node) => this._fAddView = node.getComponent(FriendAddView), {
                isAlignLeft: true,
                isAlignRight: true,
                isAlignBottom: true,
                isAlignTop: true,
                left: 43.8995,
                right: 43.8995,
                bottom: 20.0795,
                top: 20.0795
            },this.innerNode),
            this.initViewComponent(PrefabType.FriendMessageView, (node) => this._fMsgView = node.getComponent(FriendMessageView), {
                isAlignLeft: true,
                isAlignRight: true,
                isAlignBottom: true,
                isAlignTop: true,
                left: 43.8995,
                right: 43.8995,
                bottom: 20.0795,
                top: 20.0795
            },this.innerNode),
            this.initViewComponent(PrefabType.FriendEmailView, (node) => this._fEmailView = node.getComponent(FriendEmailView), {
                isAlignLeft: true,
                isAlignRight: true,
                isAlignBottom: true,
                isAlignTop: true,
                left: 43.8995,
                right: 43.8995,
                bottom: 20.0795,
                top: 20.0795
            },this.innerNode),
        ]);
    }

    private setLeftTab(){
        this._leftTab.setTabClickListener(this.onClickTab.bind(this));
        this._leftTab.updateTabList();
    }

    private setFriendListSelect(){
        this._fListView.setFriendSelectListener(this.onSelectFriend.bind(this));
    }
    private setEmailListSelect(){
        this._fEmailView.setEmailListener(this.onSelectEmail.bind(this));
    }
    private onSelectFriend(data:FriendListItemModel){
        this._rightPlayerInfo.updateData(data);
    }

    private onSelectEmail(data:SystemMailItem){
        FdServer.reqUserSystemMailDetail(data.sm_id);
    }
    
    private onUserSystemMailDetail(data:SystemMailItem){
        console.log("onUserSystemMailDetail...",data);
        this._rightPlayerInfo.updateMessageData(data);
    }

    private async initViewComponent(prefabType: PrefabTypeEntry, onComponentInit: (node: Node) => void, alignOptions?: object,defaultParent:Node = this.node) {
        let node = await this.loadAndInitPrefab(prefabType, defaultParent, alignOptions);
        onComponentInit(node);
    }
    hidenAllFriendView(){
        this._fListView.node.active = false;
        this._fAddView.node.active = false;
        this._fMsgView.node.active = false;
        this._fEmailView.node.active = false;
    }

    onClickTab(click:FriendTabType) {
        this.hidenAllFriendView();
        switch (click) {
            case FriendTabType.List:// 好友列表
                this.titleTxt.string = TextConfig.Friend_List; //"好友列表";
                this._fListView.node.active = true;
                this._rightPlayerInfo.node.active = true;
                FdServer.reqUserFriendList();
                break;
            case FriendTabType.Add: //添加好友
                this.titleTxt.string = TextConfig.Friend_Add; //"添加好友";
                this._fAddView.node.active = true;
                this._rightPlayerInfo.node.active = false;
                break;
            case FriendTabType.Apply: //好友申请列表
                this.titleTxt.string = TextConfig.Friend_Apply; //"好友申请";
                this._fMsgView.node.active = true;
                this._rightPlayerInfo.node.active = false;
                break;
            case FriendTabType.Message: // 好友消息通知
                this.titleTxt.string = TextConfig.Friend_Notify; // "好友通知";
                this._fEmailView.node.active = true;
                this._rightPlayerInfo.node.active = true;
                break;
        }
    }

    

    onUserSystemMailList(response:SystemMailListResponse){
        console.log("onUserSystemMailList", response);
        this._fEmailView.updateData(response.data);
    }

    async onSearchFriendResult(response: UserFriendData) {
        this._fAddView.updateSearchData(response);
    }
    initEvent() {
        CCUtil.onBtnClick(this.closeBtn, this.onCloseView.bind(this));
    }
    initData() {
        FdServer.reqUserFriendList();
        FdServer.reqUserFriendApplyList();
        FdServer.reqUserSystemMailLis();
    }

    async onFriendTalk(){
        let node = await ViewsManager.instance.showPopup(PrefabType.FriendTalkDialogView);
        let talk_script = node.getComponent(FriendTalkDialogView)
        talk_script.init(this._friend_list);
    }

    /**更新朋友列表 */
    onUpdateFriendList(friendDatas: DataFriendListResponse) {
        this._friend_list = friendDatas.data;
        this._fListView.updateData(friendDatas.data);
    }

    /**更新推荐朋友列表 */
    // onShowRecommendList(friendDatas: FriendUnitInfo[]) {
    //     this._fAddView.updateData(friendDatas);
    // }

    onUserFriendApplyModify(data:any){
        FdServer.reqUserFriendApplyList();
    }

    /**更新申请好友列表 */
    onUpdateApplyFriendList(response: DataFriendApplyListResponse) {
        this._fMsgView.updateData(response.data);
    }
    onUserDelFriendMessage(response: any){
        FdServer.reqUserFriendList();
    }
    onCloseView() {
        this.closePop();
    }
    // onApplyFriendTo(res: FriendResponseData) {
    //     // ViewsManager.instance.showTip(res.Msg);
    // }

    onHouseClick() {
        ViewsManager.instance.showTip(TextConfig.Function_Tip2);
    }
    /**点击收取奖励 */
    onReciveAwardClick() {
        // if (!this._selectMsg) return;
        // if (this._selectMsg.RecFlag != 0) return; //未领过的才能领取
        // ServiceMgr.friendService.sysMsgRecAwards(this._selectMsg.Id);
    }

    // onReciveAward(res: FriendResponseData) {
    //     ViewsManager.instance.showTip(res.Msg);

    // }

    // onDeleteFriend(res: FriendResponseData) {
    //     ViewsManager.instance.showTip(res.Msg);
    // }

    // onApplyFriendStatus(res: FriendResponseData) {
    //     ViewsManager.instance.showTip(res.Msg);
    //     this.scheduleOnce(() => {
    //         // ServiceMgr.friendService.friendList();
    //         // ServiceMgr.friendService.friendApplyList();
    //     }, 1);
    // }

    // //收到邮件列表事件
    // onSysMsgList(emailDatas: EmailDataInfo[]) {
    //     this._fEmailView.updateData(emailDatas);
    // }

    /**点击邮件列表项 */
    // onEmailClck(data: EmailItemClickInfo) {
        // if (!data) {
        //     return;
        // }
        // if (!data.info || !data.node) {
        //     return;
        // }
        // if (this._selectMsgItem == data.node) {
        //     return;
        // }

        // if (this._selectMsgItem) { //原来的选中项设为非选中状态
        //     this._selectMsgItem.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[1];
        // }
        // let dataEmail: EmailDataInfo = data.info;
        // let dataNode: Node = data.node;
        // this.fromTxt.string = dataEmail.FromName;
        // this.msgTxt.string = dataEmail.Content;
        // this.timeTxt.string = dataEmail.createtime;
        // //处理奖品
        // this.awardList.content.removeAllChildren();
        // let awardsData = JSON.parse(dataEmail.Awards);
        // if (awardsData && Array.isArray(awardsData)) {
        //     let awardInfo = null;
        //     let propData: ItemData = null;
        //     for (let i = 0; i < awardsData.length; i++) {
        //         awardInfo = awardsData[i];
        //         propData = new ItemData();
        //         propData.id = awardInfo.id;
        //         propData.num = awardInfo.num;
        //         let item = instantiate(this.preRewardItem);
        //         item.scale = v3(0.7, 0.7, 1);
        //         this.awardList.content.addChild(item);
        //         item.getComponent(RewardItem).init(propData);
        //     }
        // }
        // this.reciveBtn.getComponent(Sprite).grayscale = (dataEmail.RecFlag != 1);
        // if (dataEmail.RecFlag == 1) { //已经领取过了
        //     this.reciveBtn.getComponent(Sprite).grayscale = true;
        //     this.reciveTxt.string = "已领取";
        //     this.reciveBtn.getComponent(Button).enabled = false;
        //     //CCUtil.offTouch(this.reciveBtn, this.onReceiveAward, this);
        // } else {
        //     this.reciveBtn.getComponent(Sprite).grayscale = false;
        //     this.reciveTxt.string = "领取";
        //     this.reciveBtn.getComponent(Button).enabled = true;
        // }

        // this._selectMsg = dataEmail;
        // this._selectMsgItem = dataNode;
        // //选中项背景设为高亮
        // this._selectMsgItem.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[0];

        // //角色的详细信息面板伸出来
        // Tween.stopAllByTarget(this.infoBox);
        // this.roleInfoBox.active = false;
        // this.msgInfoBox.active = true;
        // let posInfoBox: Vec3 = this.infoBox.getPosition();
        // this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0));
        // tween(this.infoBox)
        //     .to(0.4, { position: v3(FriendsDialogView.INFOBOX_X_SHOW, posInfoBox.y, 0) })
        //     .call(() => {
        //         this._isShowInfo = true;
        //     })
        //     .start();

    // }
}


