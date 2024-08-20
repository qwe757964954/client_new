import { _decorator, Component, isValid, Node } from 'cc';
import { UserApplyModel } from '../../../models/FriendModel';
import List from '../../../util/list/List';
import { BlackListItem } from './BlackListItem';
const { ccclass, property } = _decorator;

@ccclass('Blacklist')
export class Blacklist extends Component {
    @property({ type: List, tooltip: "好友滚动列表" })
    public ListView: List = null;
    private _applyDataList: UserApplyModel[] = []; //我的好友列表
    protected start(): void {
        
    }
    onLoadFriendVertical(item:Node, idx:number){
        let item_script = item.getComponent(BlackListItem);
        // let friendData: UserApplyModel = this._applyDataList[idx];
        // item_script.initData(friendData);
    }

    updateData(friendDatas?: UserApplyModel[]){
        console.log("updateData  ApplyList....",friendDatas);
        this._applyDataList = friendDatas;
        this.node.active = true;
        this.ListView.numItems = 6;
    }
    onFriendVerticalSelected(item:  any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabLeftVerticalSelected",selectedId);
        // let data:FriendListItemModel = this._friendDataList[selectedId];
        // this._clickListener?.(data);
    }
}

