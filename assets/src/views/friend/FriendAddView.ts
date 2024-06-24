import { _decorator, Component, isValid, Node } from 'cc';
import { FriendUnitInfo } from '../../models/FriendModel';
import List from '../../util/list/List';
import { FriendSearchItem } from './FriendSearchItem';
const { ccclass, property } = _decorator;

@ccclass('FriendAddView')
export class FriendAddView extends Component {
    @property({ type: Node, tooltip: "查找好友结果结点" }) //imgHead
    public resultBox: Node = null;
    @property({ type: List, tooltip: "推荐好友滚动列表" })
    public recommendList: List = null;
    private _recommendFriendDataList: FriendUnitInfo[] = []; //我的推荐好友列表
    start() {

    }

    updateData(friendDatas: FriendUnitInfo[]){
        this._recommendFriendDataList = friendDatas;
        this.recommendList.numItems = this._recommendFriendDataList.length;
    }

    onLoadFriendVertical(item:Node, idx:number){
        let item_script = item.getComponent(FriendSearchItem);
        let friendData: FriendUnitInfo = this._recommendFriendDataList[idx];
        item_script.initData(friendData);
    }

    onFriendVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabLeftVerticalSelected",selectedId);
        // this._clickListener?.(selectedId);
    }

}


