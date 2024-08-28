import { _decorator, Node } from 'cc';
import { UserApplyModel } from '../../models/FriendModel';
import { BasePopFriend } from '../../script/BasePopFriend';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { FriendApplyItem } from './FriendApplyItem';
const { ccclass, property } = _decorator;

@ccclass('FriendApplyView')
export class FriendApplyView extends BasePopFriend {
    @property(List)
    public applyList: List = null;

    @property(Node)
    public closeBtn: Node = null;

    private _userDatas:UserApplyModel[] = [];

    updateData(userDatas:UserApplyModel[]){
        this._userDatas = userDatas;
        this.applyList.numItems = userDatas.length;
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.closeBtn,this.onCloseClick.bind(this));
    }

    onLoadApplyVertical(item:Node, idx:number){
        let item_script = item.getComponent(FriendApplyItem);
        let friendData: UserApplyModel = this._userDatas[idx];
        item_script.initData(friendData);
    }

    onCloseClick(){
        this.closePop();
    }
}

