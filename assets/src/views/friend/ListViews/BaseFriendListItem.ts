import { _decorator, Label, Node, Sprite } from 'cc';
import { LoadManager } from '../../../manager/LoadManager';
import ListItem from '../../../util/list/ListItem';
const { ccclass, property } = _decorator;

// Base class for common functionality
@ccclass('BaseFriendListItem')
export class BaseFriendListItem extends ListItem {
    @property({ type: Sprite, tooltip: "底层背景" })
    imgBg: Sprite = null;

    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Label, tooltip: "朋友名字标签" })
    lblRealName: Label = null;

    @property({ type: Label, tooltip: "等级标签" })
    levelTxt: Label = null;

    @property({ type: Node, tooltip: "状态图标" })
    stateIcon: Node = null;

    async setAvatar(avatarId: number) {
        const avatarPath = `friend/head_${avatarId}/spriteFrame`;
        try {
            await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite));
        } catch (error) {
            console.error(`Failed to load avatar: ${error.message}`);
        }
    }

    async setBackground(online: boolean) {
        const bgStr = online ? "img_normalbg" : "img_graybg";
        const bgUrl = `friend/${bgStr}/spriteFrame`;
        try {
            await LoadManager.loadSprite(bgUrl, this.imgBg.getComponent(Sprite));
        } catch (error) {
            console.error(`Failed to load background: ${error.message}`);
        }
    }
}