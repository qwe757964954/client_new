import { _decorator, Label, Node, Sprite } from 'cc';
import { LoadManager } from '../../../manager/LoadManager';
import { FriendListItemModel } from '../../../models/FriendModel';
import ListItem from '../../../util/list/ListItem';
const { ccclass, property } = _decorator;


@ccclass('FriendListItem')
export class FriendListItem extends ListItem {
    @property({ type: Sprite, tooltip: "底层背景" })
    imgBg: Sprite = null;

    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Label, tooltip: "朋友名字标签" })
    lblRealName: Label = null;

    @property({ type: Node, tooltip: "状态标签" })
    state_icon: Node = null;

    @property({ type: Node})
    kingdom_btn: Node = null;

    @property({ type: Node})
    chat_btn: Node = null;

    @property({ type: Node})
    ndRedPoint: Node = null;

    @property({ type: Node})
    blacklist: Node = null;

    @property({ type: Label })
    friendship: Label = null;

    @property({ type: Label })
    levelTxt: Label = null;

    _data: FriendListItemModel = null;
    async initData(data: FriendListItemModel) {
        this._data = data;
        let headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 }
        let avatar: number = headIdMap[data.avatar];
        let avatarPath: string = `friend/head_${avatar}/spriteFrame`;
        await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite));
        this.lblRealName.string = data.user_name;
        this.ndRedPoint.active = data.unread_count > 0;
        this.state_icon.getComponent(Sprite).grayscale = data.online !== 1;
        this.levelTxt.string = `${data.level}`;
        const bg_str = data.online === 1 ? "img_normalbg":"img_graybg";
        const bg_url = `friend/${bg_str}/spriteFrame`;
        await LoadManager.loadSprite(bg_url, this.imgBg.getComponent(Sprite));
        // this.lblRedTip.string = data.unread_count + "";
    }
}


