import { _decorator, Label, Node, Prefab } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ViewsMgr } from '../../manager/ViewsManager';
import { FriendListItemModel, SystemMailItem, SystemMailListResponse, UserFriendData, UserSystemAwardResponse } from '../../models/FriendModel';
import { NetNotify } from '../../net/NetNotify';
import { BasePopRight } from '../../script/BasePopRight';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import { ObjectUtil } from '../../util/ObjectUtil';
import { FriendAddView } from './FriendAddView';
import { FriendEmailView } from './FriendEmailView';
import { FriendLeftTabView } from './FriendLeftTabView';
import { FriendListView } from './FriendListView';
import { FriendMessageView } from './FriendMessageView';
import { FriendPlayerInfoView } from './FriendPlayerInfoView';
const { ccclass, property } = _decorator;

export enum FriendRightStatus {
    Friend = 1,
    Email = 2
}


@ccclass('FriendsDialogView')
export class FriendsDialogView extends BasePopRight {
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
        await this.initViews();
        this.initData();
        this.setFriendListSelect();
        this.setEmailListSelect();
        this.enableClickBlankToClose([this.contentNd,this._rightPlayerInfo.node,this._leftTab.node]).then(()=>{
            
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
        const viewComponents = [
            {
                prefabType: PrefabType.FriendLeftTabView,
                initCallback: (node: Node) => this._leftTab = node.getComponent(FriendLeftTabView),
                alignOptions: { isAlignTop: true, isAlignLeft: true, top: 129, left: -207 },
                parentNode: this.contentNd
            },
            {
                prefabType: PrefabType.FriendPlayerInfoView,
                initCallback: (node: Node) => {
                    node.setSiblingIndex(0);
                    this._rightPlayerInfo = node.getComponent(FriendPlayerInfoView);
                    this._rightPlayerInfo.showPos = this._rightPlayerInfo.node.position;
                },
                alignOptions: { isAlignVerticalCenter: true, isAlignRight: true, verticalCenter: 0, right: -25.394 },
                parentNode: this.contentNd
            },
            {
                prefabType: PrefabType.FriendListView,
                initCallback: (node: Node) => this._fListView = node.getComponent(FriendListView),
                alignOptions: { isAlignLeft: true, isAlignRight: true, isAlignBottom: true, isAlignTop: true, left: 43.8995, right: 43.8995, bottom: 20.0795, top: 20.0795 },
                parentNode: this.innerNode
            },
            {
                prefabType: PrefabType.FriendAddView,
                initCallback: (node: Node) => this._fAddView = node.getComponent(FriendAddView),
                alignOptions: { isAlignLeft: true, isAlignRight: true, isAlignBottom: true, isAlignTop: true, left: 43.8995, right: 43.8995, bottom: 20.0795, top: 20.0795 },
                parentNode: this.innerNode
            },
            {
                prefabType: PrefabType.FriendMessageView,
                initCallback: (node: Node) => this._fMsgView = node.getComponent(FriendMessageView),
                alignOptions: { isAlignLeft: true, isAlignRight: true, isAlignBottom: true, isAlignTop: true, left: 43.8995, right: 43.8995, bottom: 20.0795, top: 20.0795 },
                parentNode: this.innerNode
            },
            {
                prefabType: PrefabType.FriendEmailView,
                initCallback: (node: Node) => this._fEmailView = node.getComponent(FriendEmailView),
                alignOptions: { isAlignLeft: true, isAlignRight: true, isAlignBottom: true, isAlignTop: true, left: 43.8995, right: 43.8995, bottom: 20.0795, top: 20.0795 },
                parentNode: this.innerNode
            }
        ];
    
        await Promise.all(viewComponents.map(config => 
            this.initViewComponent(config.prefabType, config.initCallback, config.alignOptions, config.parentNode)
        ));
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
        let propsData = ObjectUtil.convertAwardsToItemData(response.awards);
        ViewsMgr.showRewards(propsData);
        FdServer.reqUserSystemMailLis();
    }
    private async onUserSystemMailDetail(data:SystemMailItem){
        console.log("onUserSystemMailDetail...",data);
        this._rightPlayerInfo.updateMessageData(data);
    }
    hidenAllFriendView(){
        this._fListView.node.active = false;
        this._fAddView.node.active = false;
        this._fMsgView.node.active = false;
        this._fEmailView.node.active = false;
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

    

    

    
    onUserDelFriendMessage(response: any){
        FdServer.reqUserFriendList();
    }
    onCloseView() {
        this.closePop();
    }

    onHouseClick() {
        ViewsMgr.showTip(TextConfig.Function_Tip2);
    }
}


