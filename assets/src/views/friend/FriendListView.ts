import { _decorator, Component, isValid, Node } from 'cc';
import { FriendListItemModel } from '../../models/FriendModel';
import List from '../../util/list/List';
import { FriendListItem } from './FriendlListItem';
const { ccclass, property } = _decorator;

@ccclass('FriendListView')
export class FriendListView extends Component {
    @property({ type: List, tooltip: "好友滚动列表" })
    public friendList: List = null;
    private _friendDataList: FriendListItemModel[] = []; //我的好友列表

    private _clickListener:(data:FriendListItemModel) => void = null;
    updateData(friendDatas: FriendListItemModel[]){
        this._friendDataList = friendDatas;
        this.friendList.numItems = friendDatas.length;
        this.friendList.selectedId = 0;
    }

    setFriendSelectListener(clickListener: (data:FriendListItemModel) => void) {
        this._clickListener = clickListener;
    }

    onLoadFriendVertical(item:Node, idx:number){
        let item_script = item.getComponent(FriendListItem);
        let friendData: FriendListItemModel = this._friendDataList[idx];
        item_script.initData(friendData);
    }

    onFriendVerticalSelected(item:  any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabLeftVerticalSelected",selectedId);
        let data:FriendListItemModel = this._friendDataList[selectedId];
        this._clickListener?.(data);
    }

}


