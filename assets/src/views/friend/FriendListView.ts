import { _decorator, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { PopMgr } from '../../manager/PopupManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import { DataFriendApplyListResponse, DataFriendListResponse, FriendActionType, FriendListItemModel } from '../../models/FriendModel';
import { NetNotify } from '../../net/NetNotify';
import { BasePopRight } from '../../script/BasePopRight';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import { FriendApplyView } from './FriendApplyView';
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
    private contentNd: Node = null;

    @property(Node)
    private leftView: Node = null;

    @property(Node)
    private wechatInvite: Node = null;

    @property(Node)
    private addFriend: Node = null;

    @property(Node)
    private closeIcon: Node = null;

    private _leftTab: FriendLeftTabView = null;
    private _friendList: FriendList = null;
    private _applyList: ApplyList = null;
    private _blacklist: Blacklist = null;
    private _tabSelect: FriendTabType = FriendTabType.List;

    protected async initUI() {
        this.enableClickBlankToClose([this.contentNd]);
        await this.initViews();
        this.setLeftTab();
        this.initData();
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.closeIcon, this.closeClickEvent.bind(this));
        CCUtil.onBtnClick(this.addFriend, this.addFriendClickEvent.bind(this));
        CCUtil.onBtnClick(this.wechatInvite, this.wechatInviteClickEvent.bind(this));
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [NetNotify.Classification_UserFriendList, this.onUpdateFriendList.bind(this)],
            [NetNotify.Classification_UserFriendApplyList, this.onUpdateApplyFriendList.bind(this)],
            [NetNotify.Classification_UserFriendApplyModify, this.onUserFriendApplyModify.bind(this)],
            [NetNotify.Classification_UserDelFriendMessage, this.onUserDelFriendMessage.bind(this)],
            [EventType.Friend_Talk_Event, this.onFriendTalk.bind(this)],
        ]);
    }

    private async initViews() {
        const viewComponents = [
            {
                prefabType: PrefabType.FriendLeftTabView,
                initCallback: (node: Node) => this._leftTab = node.getComponent(FriendLeftTabView),
                alignOptions: { isAlignTop: true, isAlignHorizontalCenter: true, top: 116.002, horizontalCenter: 0 },
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
            }
        ];

        await Promise.all(viewComponents.map(({ prefabType, initCallback, alignOptions, parentNode }) =>
            this.initViewComponent(prefabType, initCallback, alignOptions, parentNode)
        ));
    }

    private initData() {
        // Initialize data if needed
    }

    private setLeftTab() {
        this._leftTab.setTabClickListener(this.onClickTab.bind(this));
        this._leftTab.updateTabs();
    }

    private async onClickTab(tabType: FriendTabType) {
        this.hideAllFriendLists();
        this._tabSelect = tabType;

        switch (tabType) {
            case FriendTabType.List:
                FdServer.reqUserFriendList(FriendActionType.List);
                break;
            case FriendTabType.Apply:
                FdServer.reqUserFriendApplyList();
                break;
            case FriendTabType.Blacklist:
                FdServer.reqUserFriendList(FriendActionType.Blacklist);
                break;
        }
    }

    private async onFriendClick(data: FriendListItemModel) {
        const node = await PopMgr.showPopFriend(PrefabType.FriendPlayerInfoView, this.leftView, "content");
        const script = node.getComponent(FriendPlayerInfoView);
        script.updateData(data);
    }

    private async onFriendTalk(data: FriendListItemModel) {
        const node = await PopMgr.showPopFriend(PrefabType.FriendTalkDialogView, this.leftView, "content");
        const script = node.getComponent(FriendTalkDialogView);
        script.init(data);
    }

    private closeClickEvent() {
        this.closePop();
    }

    private async addFriendClickEvent() {
        await PopMgr.showPopFriend(PrefabType.FriendAddView, this.leftView, "content");
    }

    private wechatInviteClickEvent() {
        ViewsMgr.showTip(TextConfig.Function_Tip2);
    }

    private hideAllFriendLists() {
        this._friendList.node.active = false;
        this._applyList.node.active = false;
        this._blacklist.node.active = false;
    }

    private async onUpdateApplyFriendList(response: DataFriendApplyListResponse) {
        this._applyList.updateData(response.data);
        this.leftView.removeAllChildren();
        const node = await PopMgr.showPopFriend(PrefabType.FriendApplyView, this.leftView, "content");
        const script = node.getComponent(FriendApplyView);
        script.updateData(response.data);
    }

    private onUpdateFriendList(friendDatas: DataFriendListResponse) {
        if (this._tabSelect === FriendTabType.List) {
            this._friendList.updateData(friendDatas.data);
        } else if (this._tabSelect === FriendTabType.Blacklist) {
            this._blacklist.updateData(friendDatas.data);
        }
    }

    private onUserDelFriendMessage(response: any) {
        if (this._tabSelect === FriendTabType.List) {
            FdServer.reqUserFriendList(FriendActionType.List);
        } else if (this._tabSelect === FriendTabType.Blacklist) {
            FdServer.reqUserFriendList(FriendActionType.Blacklist);
        }
    }

    private onUserFriendApplyModify(data: any) {
        FdServer.reqUserFriendApplyList();
    }
}
