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

    @property({ type: Label, tooltip: "未读标签" })
    lblUnRead: Label = null;

    @property({ type: Node, tooltip: "未读红点结点" })
    unRead: Node = null;

    private _data: FriendListItemModel = null;

    async initData(data: FriendListItemModel) {
        this._data = data;
        await this.updateAvatar(data.avatar);
        this.updateName(data.user_name);
        this.updateUnreadStatus(data.unread_count);
    }

    private async updateAvatar(avatarId: string) {
        const headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 };
        const avatar = headIdMap[avatarId] || 101; // Default to 101 if not found
        const avatarPath = `friend/head_${avatar}/spriteFrame`;
        try {
            await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite));
        } catch (error) {
            console.error(`Failed to load avatar sprite: ${avatarPath}`, error);
        }
    }

    private updateName(userName: string) {
        this.lblRealName.string = userName || 'Unknown';
    }

    private updateUnreadStatus(unreadCount: number) {
        const hasUnread = unreadCount > 0;
        this.unRead.active = hasUnread;
        this.lblUnRead.string = hasUnread ? `未读 ${unreadCount}` : "0";
    }
}
