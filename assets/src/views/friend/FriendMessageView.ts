import { _decorator, Component, isValid, Node } from 'cc';
import { FriendUnitInfo } from '../../models/FriendModel';
import List from '../../util/list/List';
import { MsgListItem } from './MsgListItem';
const { ccclass, property } = _decorator;

@ccclass('FriendMessageView')
export class FriendMessageView extends Component {

    @property(List)
    public msgList: List = null;

    private _applyFriendDataList:FriendUnitInfo[] = [];
    updateData(data:FriendUnitInfo[]){
        this._applyFriendDataList = data;
        this.msgList.numItems = this._applyFriendDataList.length;
        this.msgList.update();
    }

    onLoadMessageVertical(item:Node, idx:number){
        let item_script = item.getComponent(MsgListItem);
        let friendData: FriendUnitInfo = this._applyFriendDataList[idx];
        item_script.initData(friendData);
    }

    onMessageVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabLeftVerticalSelected",selectedId);
        // this._clickListener?.(selectedId);
    }

}


