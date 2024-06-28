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
        
        await this.initViews();
        this.initData();
        this.node.getChildByName("content").setSiblingIndex(99);
        this.setLeftTab();
        this.setFriendListSelect();
        this.setEmailListSelect();
        this.enableClickBlankToClose([this.node.getChildByName("content"),this._rightPlayerInfo.node,this._leftTab.node]).then(()=>{
        });
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
            [NetNotify.Classification_UserSystemAwardGet, this.onUserSystemAwardGet],
            
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
    private onUserSystemAwardGet(data:any){
        console.log("onUserSystemAwardGet...",data);
        FdServer.reqUserSystemMailLis();
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
                this._fEmailView.setEmailListSelected(0);
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
        this._fListView.updateData(this._friend_list);
        this._fListView.setFriendListSelected(0);
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
}


