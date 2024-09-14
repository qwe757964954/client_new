import { _decorator, Component, isValid, Node } from 'cc';
import { FriendListItemModel } from '../../../models/FriendModel';
import List from '../../../util/list/List';
import { BlackListItem } from './BlackListItem';
const { ccclass, property } = _decorator;

@ccclass('Blacklist')
export class Blacklist extends Component {
    @property({ type: List, tooltip: "好友滚动列表" })
    public ListView: List = null;
    private _DataList: FriendListItemModel[] = []; //我的好友列表
    protected start(): void {
        
    }
    onLoadFriendVertical(item:Node, idx:number){
        let item_script = item.getComponent(BlackListItem);
        let friendData: FriendListItemModel = this._DataList[idx];
        item_script.initData(friendData);
    }

    updateData(friendDatas?: FriendListItemModel[]){
        console.log("updateData  ApplyList....",friendDatas);
        this._DataList = friendDatas;
        this.node.active = true;
        this.ListView.numItems = this._DataList.length;
    }
    onFriendVerticalSelected(item:  any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabLeftVerticalSelected",selectedId);
        // let data:FriendListItemModel = this._friendDataList[selectedId];
        // this._clickListener?.(data);
    }
}

