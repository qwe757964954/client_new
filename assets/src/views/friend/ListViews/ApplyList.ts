import { _decorator, Component, isValid, Node } from 'cc';
import { UserApplyModel } from '../../../models/FriendModel';
import List from '../../../util/list/List';
import { ApplyListItem } from './ApplyListItem';
const { ccclass, property } = _decorator;

@ccclass('ApplyList')
export class ApplyList extends Component {
    @property({ type: List, tooltip: "好友滚动列表" })
    public ListView: List = null;
    private _DataList: UserApplyModel[] = []; //我的好友列表
    protected start(): void {
    }
    onLoadFriendVertical(item:Node, idx:number){
        let item_script = item.getComponent(ApplyListItem);
        let friendData: UserApplyModel = this._DataList[idx];
        item_script.initData(friendData);
    }

    updateData(friendDatas: UserApplyModel[]){
        console.log("updateData  ApplyList....",friendDatas);
        this._DataList = friendDatas;
        this.node.active = true;
        this.ListView.numItems = friendDatas.length;
    }
    onFriendVerticalSelected(item:  any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabLeftVerticalSelected",selectedId);
        // let data:FriendListItemModel = this._friendDataList[selectedId];
        // this._clickListener?.(data);
    }
}

