import { _decorator, EditBox, isValid, Label, Node } from 'cc';
import { ViewsManager } from '../../manager/ViewsManager';
import { UserFriendData } from '../../models/FriendModel';
import { BaseView } from '../../script/BaseView';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ObjectUtil } from '../../util/ObjectUtil';
import { FriendSearchItem } from './FriendSearchItem';
const { ccclass, property } = _decorator;

@ccclass('FriendAddView')
export class FriendAddView extends BaseView {
    @property({ type: Node, tooltip: "查找好友结果结点" }) //imgHead
    public resultBox: Node = null;
    @property({ type: List, tooltip: "推荐好友滚动列表" })
    public recommendList: List = null;

    @property({ type: Node, tooltip: "查找好友按钮" })
    public searchBtn: Node = null;

    @property({ type: Node, tooltip: "添加好友按钮" })
    public addBtn: Node = null;

    @property({ type: EditBox, tooltip: "查找好友编辑框" })
    public searchEdt: EditBox = null;

    private _recommendFriendDataList: any[] = []; //我的推荐好友列表

    private _searchData:UserFriendData = null;

    protected initUI(): void {
        
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.searchBtn,this.gotoSearch.bind(this));
        CCUtil.onBtnClick(this.addBtn,this.addFriend.bind(this));
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

    updateSearchData(friendDatas: UserFriendData){
        this._searchData = friendDatas;
        this.resultBox.active = true;
        let realName = this.resultBox.getChildByName("realName");
        realName.getComponent(Label).string = friendDatas.user_name;
        let idTxt = this.resultBox.getChildByName("idTxt");
        idTxt.getComponent(Label).string = friendDatas.user_id+"";
    }

    updateData(friendDatas: any[]){
        this.resultBox.active = false;
        // this._recommendFriendDataList = friendDatas;
        // this.recommendList.numItems = this._recommendFriendDataList.length;
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


