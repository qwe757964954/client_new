import { _decorator, Component, Label, Node, size, Sprite, UITransform, v3 } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { ChatDataItem, FriendListItemModel } from '../../models/FriendModel';
import { User } from '../../models/User';
import { ObjectUtil } from '../../util/ObjectUtil';
import { FriendConfig } from './FriendConfig';
import { HeadIdMap } from './FriendInfo';
const { ccclass, property } = _decorator;

@ccclass('ChatContentItem')
export class ChatContentItem extends Component {
    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Node, tooltip: "头像结点" })
    ndHead: Node = null;

    @property({ type: Node, tooltip: "聊天背景结点" })
    bg: Node = null;

    @property({ type: Node, tooltip: "当前时间结点" })
    timeBox: Node = null;

    @property({ type: Label, tooltip: "当前时间" })
    lblTimeTxt: Label = null;

    @property({ type: Sprite, tooltip: "聊天图片精灵" })
    chatImg: Sprite = null;

    @property(Node)
    public shortCut: Node = null;

    static readonly HeadLeftX: number = -273;
    static readonly ChatIconLeftX: number = -10;

    async initData(data: ChatDataItem, friendInfo: FriendListItemModel) {
        this.lblTimeTxt.string = ObjectUtil.formatDateTime(data.create_time);

        const isSelf = data.user_id === User.userID;
        this.updatePosition(isSelf);

        const avatarId = isSelf ? User.avatarID : friendInfo.avatar;
        await this.loadAvatar(avatarId);

        if (parseInt(data.message) < 100) {
            await this.loadChatIcon(data.message);
            this.chatImg.node.active = true;
            this.shortCut.active = false;
        } else {
            this.chatImg.node.active = false;
            this.shortCut.active = true;
            this.updateShortCut(data.message);
        }
    }

    private updatePosition(isSelf: boolean) {
        const xHead = isSelf ? -ChatContentItem.HeadLeftX : ChatContentItem.HeadLeftX;
        const xChatIcon = isSelf ? -ChatContentItem.ChatIconLeftX : ChatContentItem.ChatIconLeftX;

        this.ndHead.setPosition(v3(xHead, this.ndHead.position.y, 0));
        this.chatImg.node.setPosition(v3(xChatIcon, this.chatImg.node.position.y, 0));
    }

    private async loadAvatar(avatarId: string | number) {
        const avatar = HeadIdMap[avatarId] || 101;
        const avatarPath = `friend/head_${avatar}/spriteFrame`;

        try {
            await LoadManager.loadSprite(avatarPath, this.imgHead);
        } catch (error) {
            console.error(`Failed to load avatar sprite: ${avatarPath}`, error);
        }
    }

    private async loadChatIcon(message: string) {
        const chatIconPath = `friend/face/${message}/spriteFrame`;

        try {
            await LoadManager.loadSprite(chatIconPath, this.chatImg);
            this.setChatIconSize(message);
        } catch (error) {
            console.error(`Failed to load chat icon sprite: ${chatIconPath}`, error);
        }
    }

    private setChatIconSize(message: string) {
        const newSize = parseInt(message) < 100 ? size(166, 166) : size(236, 158);
        this.chatImg.node.getComponent(UITransform).setContentSize(newSize);
    }

    private updateShortCut(message: string) {
        const shortCut = FriendConfig.shortcutInfo.find(info => info.id === parseInt(message));
        if (shortCut) {
            const { enText, cnText } = shortCut;
            this.shortCut.getChildByName("enText").getComponent(Label).string = enText;
            this.shortCut.getChildByName("cnText").getComponent(Label).string = cnText;
        } else {
            console.warn(`Shortcut info not found for message ID: ${message}`);
        }
    }
}
