import { _decorator, Label, Node, Prefab } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType, PrefabTypeEntry } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import GlobalConfig from '../../GlobalConfig';
import { ViewsManager } from '../../manager/ViewsManager';
import { DataFriendApplyListResponse, DataFriendListResponse, FriendListItemModel, SystemMailItem, SystemMailListResponse, UserFriendData, UserSystemAwardResponse } from '../../models/FriendModel';
import { NetNotify } from '../../net/NetNotify';
import { BasePopup } from '../../script/BasePopup';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import { ObjectUtil } from '../../util/ObjectUtil';
import { ToolUtil } from '../../util/ToolUtil';
import { CongratulationsView } from '../task/CongratulationsView';
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
    private _selectedFriend:FriendListItemModel = null;
    async initUI() {
        let scale = ToolUtil.getValue(GlobalConfig.WIN_DESIGN_RATE, 0.1, 1.0);
        CCUtil.setNodeScale(this.contentNd, scale);
        GlobalConfig.initResolutionRules();
        await this.initViews();
        this.initData();
        this._rightPlayerInfo.node.setSiblingIndex(0);
        this.setLeftTab();
        this.setFriendListSelect();
        this.setEmailListSelect();
        this.enableClickBlankToClose([this.node.getChildByName("content"),this._rightPlayerInfo.node,this._leftTab.node]).then(()=>{
            GlobalConfig.initRessolutionHeight();
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
            [NetNotify.Classification_UserRecommendFriendList, this.onShowRecommendList],
            [EventType.Friend_Talk_Event, this.onFriendTalk],
        ]);
    }
    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.FriendLeftTabView, (node) => this._leftTab = node.getComponent(FriendLeftTabView), {
                isAlignTop: true,
                isAlignLeft: true,
                top: 129,
                left: -207
            },this.contentNd),
            this.initViewComponent(PrefabType.FriendPlayerInfoView, (node) => {
                this._rightPlayerInfo = node.getComponent(FriendPlayerInfoView)
                this._rightPlayerInfo.showPos = this._rightPlayerInfo.node.position;
            }, {
                isAlignVerticalCenter: true,
                isAlignRight: true,
                verticalCenter: 0,
                right: -25.394
            },this.contentNd),
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
        this._selectedFriend = data;
        this._rightPlayerInfo.showPlayerInfo(true);
        this._rightPlayerInfo.updateData(data);
    }

    private onSelectEmail(data:SystemMailItem){
        this._rightPlayerInfo.showPlayerInfo(true);
        FdServer.reqUserSystemMailDetail(data.sm_id);
    }
    private async onUserSystemAwardGet(response:UserSystemAwardResponse){
        console.log("onUserSystemAwardGet...",response);
        let propsDta = ObjectUtil.convertAwardsToItemData(response.awards);
        let node:Node = await ViewsManager.instance.showPopup(PrefabType.CongratulationsView);
        let nodeScript: CongratulationsView = node.getComponent(CongratulationsView);
        nodeScript.updateRewardScroll(propsDta);
        FdServer.reqUserSystemMailLis();
    }
    private async onUserSystemMailDetail(data:SystemMailItem){
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
                FdServer.reqUserFriendList();
                break;
            case FriendTabType.Add: //添加好友
                this.titleTxt.string = TextConfig.Friend_Add; //"添加好友";
                this._fAddView.node.active = true;
                break;
            case FriendTabType.Apply: //好友申请列表
                this.titleTxt.string = TextConfig.Friend_Apply; //"好友申请";
                this._fMsgView.node.active = true;
                break;
            case FriendTabType.Message: // 好友消息通知
                this.titleTxt.string = TextConfig.Friend_Notify; // "好友通知";
                this._fEmailView.node.active = true;
                // this._fEmailView.setEmailListSelected(0);
                break;
        }
        let isShow = click === FriendTabType.List || click === FriendTabType.Message;
        if(!isShow){
            this._rightPlayerInfo.showPlayerInfo(isShow); 
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
        FdServer.reqUserRecommendFriendList();
    }

    async onFriendTalk(){
        let node = await ViewsManager.instance.showPopup(PrefabType.FriendTalkDialogView);
        let talk_script = node.getComponent(FriendTalkDialogView)
        let selected = this._friend_list.findIndex(friend => friend.friend_id === this._selectedFriend.friend_id);
        talk_script.currentFriendSelected = selected;
        talk_script.init(this._friend_list);
    }

    /**更新朋友列表 */
    onUpdateFriendList(friendDatas: DataFriendListResponse) {
        this._friend_list = friendDatas.data;
        this._fListView.updateData(this._friend_list);
        // this._fListView.setFriendListSelected(0);
    }

    /**更新推荐朋友列表 */
    onShowRecommendList(friendDatas: DataFriendListResponse) {
        console.log("onShowRecommendList",friendDatas);
        this._fAddView.updateData(friendDatas.data);
    }

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
        GlobalConfig.initRessolutionHeight();
    }

    onHouseClick() {
        ViewsManager.instance.showTip(TextConfig.Function_Tip2);
    }
}


