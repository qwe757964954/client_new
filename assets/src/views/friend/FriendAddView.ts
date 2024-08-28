import { _decorator, EditBox, isValid, Node } from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { DataFriendListResponse, FriendListItemModel, UserFriendData } from '../../models/FriendModel';
import { NetNotify } from '../../net/NetNotify';
import { BasePopFriend } from '../../script/BasePopFriend';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ObjectUtil } from '../../util/ObjectUtil';
import { FriendSearchItem } from './FriendSearchItem';
const { ccclass, property } = _decorator;

@ccclass('FriendAddView')
export class FriendAddView extends BasePopFriend {
    @property({ type: FriendSearchItem}) //imgHead
    public resultBox: FriendSearchItem = null;
    @property({ type: List, tooltip: "推荐好友滚动列表" })
    public recommendList: List = null;

    @property({ type: Node, tooltip: "查找好友按钮" })
    public searchBtn: Node = null;

    @property({ type: Node, tooltip: "添加好友按钮" })
    public addBtn: Node = null;

    @property(Node)
    public closeBtn:Node = null;

    @property({ type: EditBox, tooltip: "查找好友编辑框" })
    public searchEdt: EditBox = null;

    private _recommendFriendDataList: FriendListItemModel[] = []; //我的推荐好友列表

    private _searchData:UserFriendData = null;

    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("content")]);
        FdServer.reqUserRecommendFriendList();
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.searchBtn,this.gotoSearch.bind(this));
        // CCUtil.onBtnClick(this.addBtn,this.addFriend.bind(this));
        CCUtil.onBtnClick(this.closeBtn,this.onCloseClickEvent.bind(this));
    }
    protected onInitModuleEvent(): void {
        this.addModelListeners([
            // [NetNotify.Classification_UserFriendList, this.onUpdateFriendList],
            // [NetNotify.Classification_UserFriendApplyList, this.onUpdateApplyFriendList],
            [NetNotify.Classification_UserFriendSearch, this.onSearchFriendResult],
            // [NetNotify.Classification_UserFriendApplyModify, this.onUserFriendApplyModify],
            // [NetNotify.Classification_UserDelFriendMessage, this.onUserDelFriendMessage],
            // [NetNotify.Classification_UserSystemMailList, this.onUserSystemMailList],
            // [NetNotify.Classification_UserSystemMailDetail, this.onUserSystemMailDetail],
            // [NetNotify.Classification_UserSystemAwardGet, this.onUserSystemAwardGet],
            [NetNotify.Classification_UserRecommendFriendList, this.onShowRecommendList],
            // [EventType.Friend_Talk_Event, this.onFriendTalk],
        ]);
    }
    gotoSearch(){
        console.log('gotoSearch');
        let search_id = this.searchEdt.string;
        if(search_id.length === 0){
            ViewsManager.showTip("搜索id长度不能为0");
            return;
        }
        if(!ObjectUtil.isNumericString(search_id)){
            ViewsManager.showTip("搜索id必须是数字");
            return;
        }
        FdServer.reqUserFriendSearch(search_id);
    }

    addFriend(){
        if(!isValid(this._searchData)){
            return
        }
        FdServer.reqUserFriendAdd(this._searchData.user_id);
    }

    onCloseClickEvent(){
        console.log("onCloseClickEvent................................")
        this.closePop();
    }

    updateSearchData(friendData: UserFriendData){
        this._searchData = friendData;
        this.resultBox.node.active = true;
        let item_script = this.resultBox.getComponent(FriendSearchItem);
        item_script.initData(this._searchData);
    }
    async onSearchFriendResult(response: UserFriendData) {
        this.updateSearchData(response);
    }
    /**更新推荐朋友列表 */
    onShowRecommendList(friendDatas: DataFriendListResponse) {
        console.log("onShowRecommendList",friendDatas);
        this.resultBox.node.active = false;
        this._recommendFriendDataList = friendDatas.data;
        this.recommendList.numItems = this._recommendFriendDataList.length;
    }
    onLoadFriendVertical(item:Node, idx:number){
        let item_script = item.getComponent(FriendSearchItem);
        let friendData: any = this._recommendFriendDataList[idx];
        item_script.initData(friendData);
    }

    onFriendVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabLeftVerticalSelected",selectedId);
        // this._clickListener?.(selectedId);
    }

}


