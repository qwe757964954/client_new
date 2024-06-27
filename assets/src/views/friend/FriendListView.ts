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
    updateData(friendDatas: FriendListItemModel[]){
        this._friendDataList = friendDatas;
        this.friendList.numItems = friendDatas.length;
    }

    onLoadLeftTabVertical(item:Node, idx:number){
        let item_script = item.getComponent(FriendListItem);
        let friendData: FriendListItemModel = this._friendDataList[idx];
        item_script.initData(friendData);
    }

    onTabLeftVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabLeftVerticalSelected",selectedId);
        // this._clickListener?.(selectedId);
    }

}


