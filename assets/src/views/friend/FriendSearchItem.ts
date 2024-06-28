import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { FriendListItemModel } from '../../models/FriendModel';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('FriendSearchItem')
export class FriendSearchItem extends Component {
    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Label, tooltip: "朋友名字标签" })
    lblRealName: Label = null;

    @property({ type: Label, tooltip: "ID标签" })
    lblID: Label = null;

    @property({ type: Label, tooltip: "状态标签" })
    lblState: Label = null;

    @property({ type: Node, tooltip: "添加朋友按钮" })
    btnAddFriend: Node = null;

    _data: FriendListItemModel = null;

    protected onLoad(): void {
        //console.log("FriendListItem onLoad");
        this.addEvent();
    }

    addEvent() {
        CCUtil.onTouch(this.btnAddFriend, this.onAddClick, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.btnAddFriend, this.onAddClick, this);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    onAddClick() {

    }

    async initData(data: FriendListItemModel) {
        this._data = data;
        let headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 }
        let avatar: number = headIdMap[data.avatar];
        let avatarPath: string = "friend/head_" + avatar + "/spriteFrame";
        await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite)).then(() => { },
            (error) => {
                // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
            });
        this.lblRealName.string = data.nick_name;
        this.lblState.string = data.online === 1 ? "在线" : "离线";
        this.lblID.string = "" + data.user_id;
    }
}


