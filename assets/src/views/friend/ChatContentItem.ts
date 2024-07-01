import { _decorator, Component, Label, Node, size, Sprite, UITransform, v3, Vec3 } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { ChatDataItem, FriendListItemModel } from '../../models/FriendModel';
import { User } from '../../models/User';
import { ObjectUtil } from '../../util/ObjectUtil';
const { ccclass, property } = _decorator;

@ccclass('ChatContentItem')
export class ChatContentItem extends Component {
    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Node, tooltip: "头像结点" })
    ndHead: Node = null;

    @property({ type: Node, tooltip: "当前时间结点" })
    timeBox: Node = null;

    @property({ type: Label, tooltip: "当前时间" })
    lblTimeTxt: Label = null;

    @property({ type: Sprite, tooltip: "聊天图片精灵" })
    chatImg: Sprite = null;

    static readonly HeadLeftX: number = -273;
    static readonly ChatIconLeftX: number = -10;

    async initData(data: ChatDataItem, friendInfo: FriendListItemModel) {
        // 设置聊天时间
        this.lblTimeTxt.string = ObjectUtil.formatDateTime(data.create_time);

        // 设置头像和聊天图标位置
        const isSelf = data.user_id === User.userID;
        this.setHeadPosition(isSelf);
        this.setChatIconPosition(isSelf);

        // 设置头像
        const avatarId = isSelf ? User.avatarID : friendInfo.avatar;
        await this.loadAvatar(avatarId);

        // 设置聊天内容
        await this.loadChatIcon(data.message);
    }

    private setHeadPosition(isSelf: boolean) {
        const posHead: Vec3 = this.ndHead.getPosition();
        const newPosX = isSelf ? -ChatContentItem.HeadLeftX : ChatContentItem.HeadLeftX;
        this.ndHead.setPosition(v3(newPosX, posHead.y, 0));
    }

    private setChatIconPosition(isSelf: boolean) {
        const posBqIcon: Vec3 = this.chatImg.node.position;
        const newPosX = isSelf ? -ChatContentItem.ChatIconLeftX : ChatContentItem.ChatIconLeftX;
        this.chatImg.node.setPosition(v3(newPosX, posBqIcon.y, 0));
    }

    private async loadAvatar(avatarId: string | number) {
        const headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 };
        const avatar = headIdMap[avatarId] || 101; // Default to 101 if not found
        const avatarPath = `friend/head_${avatar}/spriteFrame`;

        try {
            await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite));
        } catch (error) {
            console.error(`Failed to load avatar sprite: ${avatarPath}`, error);
        }
    }

    private async loadChatIcon(message: string) {
        const chatIconPath = `friend/${message}/spriteFrame`;

        try {
            await LoadManager.loadSprite(chatIconPath, this.chatImg);
            this.setChatIconSize(message);
        } catch (error) {
            console.error(`Failed to load chat icon sprite: ${chatIconPath}`, error);
        }
    }

    private setChatIconSize(message: string) {
        const parsedMessage = parseInt(message);
        const newSize = parsedMessage < 100 ? size(166, 166) : size(236, 158);
        this.chatImg.node.getComponent(UITransform).setContentSize(newSize);
    }
}
