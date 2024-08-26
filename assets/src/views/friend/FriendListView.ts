import { _decorator, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { PopMgr } from '../../manager/PopupManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import { DataFriendApplyListResponse, DataFriendListResponse, FriendListItemModel } from '../../models/FriendModel';
import { NetNotify } from '../../net/NetNotify';
import { BasePopRight } from '../../script/BasePopRight';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import { FriendTabType } from './FriendInfo';
import { FriendLeftTabView } from './FriendLeftTabView';
import { FriendPlayerInfoView } from './FriendPlayerInfoView';
import { FriendTalkDialogView } from './FriendTalkDialogView';
import { ApplyList } from './ListViews/ApplyList';
import { Blacklist } from './ListViews/Blacklist';
import { FriendList } from './ListViews/FriendList';
const { ccclass, property } = _decorator;

@ccclass('FriendListView')
export class FriendListView extends BasePopRight {
    @property(Node)
    public contentNd: Node = null;
    @property(Node)
    public leftView: Node = null;
    @property(Node)
    public wechatInvite: Node = null;

    @property(Node)
    public addFriend: Node = null;

    @property(Node)
    public closeIcon: Node = null;

    private _leftTab:FriendLeftTabView = null;
    private _friendList:FriendList = null;
    private _applyList:ApplyList = null;
    private _blacklist:Blacklist = null;
    protected async initUI() {
        this.enableClickBlankToClose([this.contentNd,this.leftView]);
        await this.initViews();
        this.setLeftTab();
        this.initData();
    }
    protected initEvent(): void {
        CCUtil.onBtnClick(this.closeIcon,this.closeClickEvent.bind(this));
        CCUtil.onBtnClick(this.addFriend,this.addFriendClickEvent.bind(this));
        CCUtil.onBtnClick(this.wechatInvite,this.wechatInviteClickEvent.bind(this));
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [NetNotify.Classification_UserFriendList, this.onUpdateFriendList],
            [NetNotify.Classification_UserFriendApplyList, this.onUpdateApplyFriendList],
            [NetNotify.Classification_UserFriendApplyModify, this.onUserFriendApplyModify],
            [NetNotify.Classification_UserDelFriendMessage, this.onUserDelFriendMessage],
            // [NetNotify.Classification_UserSystemMailList, this.onUserSystemMailList],
            // [NetNotify.Classification_UserSystemMailDetail, this.onUserSystemMailDetail],
            // [NetNotify.Classification_UserSystemAwardGet, this.onUserSystemAwardGet],
            [EventType.Friend_Talk_Event, this.onFriendTalk],
        ]);
    }
    private async initViews() {
        const viewComponents = [
            {
                prefabType: PrefabType.FriendLeftTabView,
                initCallback: (node: Node) => this._leftTab = node.getComponent(FriendLeftTabView),
                alignOptions: { isAlignTop: true,isAlignHorizontalCenter:true, top: 116.002,horizontalCenter:0},
                parentNode: this.contentNd
            },
            {
                prefabType: PrefabType.FriendList,
                initCallback: (node: Node) => {
                    this._friendList = node.getComponent(FriendList);
                    this._friendList.setFriendSelectListener(this.onFriendClick.bind(this));
                },
                parentNode: this.contentNd
            },
            {
                prefabType: PrefabType.ApplyList,
                initCallback: (node: Node) => this._applyList = node.getComponent(ApplyList),
                parentNode: this.contentNd
            },
            {
                prefabType: PrefabType.Blacklist,
                initCallback: (node: Node) => this._blacklist = node.getComponent(Blacklist),
                parentNode: this.contentNd
            },
        ]

        await Promise.all(viewComponents.map(config => 
            this.initViewComponent(config.prefabType, config.initCallback, config.alignOptions, config.parentNode)
        ));
    }
    initData() {
        // FdServer.reqUserSystemMailLis();
        // 
    }
    private setLeftTab(){
        this._leftTab.setTabClickListener(this.onClickTab.bind(this));
        this._leftTab.updateTabList();
    }
    onClickTab(click:FriendTabType) {
        this.hidenAllFrinedList();
        
        switch (click) {
            case FriendTabType.List:// 好友列表
                FdServer.reqUserFriendList();
                break;
            case FriendTabType.Apply: //好友申请列表
                FdServer.reqUserFriendApplyList();
                break;
            case FriendTabType.Blacklist: // 好友消息通知
                this._blacklist.updateData();
                break;
        }
    }

    async onFriendClick(data:FriendListItemModel){
        console.log("onFriendClick.....",data);
        let node = await PopMgr.showPopFriend(PrefabType.FriendPlayerInfoView,this.leftView,"content");
        let script = node.getComponent(FriendPlayerInfoView);
        script.updateData(data);
    }
    async onFriendTalk(data:FriendListItemModel){
        console.log("onFriendTalk",data);
        let node = await PopMgr.showPopFriend(PrefabType.FriendTalkDialogView,this.leftView,"content");
        let script = node.getComponent(FriendTalkDialogView);
        script.init(data);
    }
    closeClickEvent(){
        this.closePop();
    }
    async addFriendClickEvent(){
        await PopMgr.showPopFriend(PrefabType.FriendAddView,this.leftView,"content");
    }
    wechatInviteClickEvent(){
        ViewsMgr.showTip(TextConfig.Function_Tip2);
    }

    hidenAllFrinedList(){
        this._friendList.node.active = false;
        this._applyList.node.active = false;
        this._blacklist.node.active = false;
    }

    /**更新申请好友列表 */
    onUpdateApplyFriendList(response: DataFriendApplyListResponse) {
        console.log("onUpdateApplyFriendList", response);
        this._applyList.updateData(response.data);
    }
    /**更新朋友列表 */
    onUpdateFriendList(friendDatas: DataFriendListResponse) {
        this._friendList.updateData(friendDatas.data);
    }
    
    
    onUserDelFriendMessage(response: any){
        FdServer.reqUserFriendList();
    }
    onUserFriendApplyModify(data:any){
        FdServer.reqUserFriendApplyList();
    }
}


