import { _decorator, Component, isValid, Node } from 'cc';
import { FriendListItemModel } from '../../../models/FriendModel';
import List from '../../../util/list/List';
import { FriendListItem } from './FriendlListItem';
const { ccclass, property } = _decorator;

@ccclass('FriendList')
export class FriendList extends Component {
    @property({ type: List, tooltip: "好友滚动列表" })
    public friendList: List = null;
    private _DataList: FriendListItemModel[] = []; //我的好友列表
    private _clickListener:(data:FriendListItemModel) => void = null;
    protected start(): void {
    }
    onLoadFriendVertical(item:Node, idx:number){
        let item_script = item.getComponent(FriendListItem);
        let friendData: FriendListItemModel = this._DataList[idx];
        item_script.initData(friendData);
    }

    setFriendListSelected(index:number){
        this.friendList.selectedId = index;
    }
    setFriendSelectListener(clickListener: (data:FriendListItemModel) => void) {
        this._clickListener = clickListener;
    }
    updateData(friendDatas: FriendListItemModel[]){
        this.node.active = true;
        this._DataList = friendDatas;
        this.friendList.numItems = friendDatas.length;
    }
    onFriendVerticalSelected(item:  any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabLeftVerticalSelected",selectedId);
        let data:FriendListItemModel = this._DataList[selectedId];
        this._clickListener?.(data);
    }
}

