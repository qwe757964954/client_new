import { _decorator, Label, Node, Sprite } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { FriendListItemModel } from '../../models/FriendModel';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('ChatListItem')
export class ChatListItem extends ListItem {
    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Label, tooltip: "名字标签" })
    lblRealName: Label = null;

    @property({ type: Label, tooltip: "状态标签" })
    lblState: Label = null;

    @property({ type: Label, tooltip: "关卡标签" })
    lblUnRead: Label = null;

    @property({ type: Node, tooltip: "未读红结点" })
    unRead: Node = null;
    private _data: FriendListItemModel = null;

    async initData(data: FriendListItemModel) {
        this._data = data;
        let headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 }
        let avatar: number = headIdMap[data.avatar];
        let avatarPath: string = "friend/head_" + avatar + "/spriteFrame";
        await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite)).then(() => { },
            (error) => {
                // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
            });
        this.lblRealName.string = data.user_name;

        let bNoReadVisible: boolean = data.unread_count > 0
        this.unRead.active = bNoReadVisible;
        if (data.unread_count > 0) {
            this.lblUnRead.string = "未读" + data.unread_count;
        }
        else {
            this.lblUnRead.string = "0";
        }
    }
}


