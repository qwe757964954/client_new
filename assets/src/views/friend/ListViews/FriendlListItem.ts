import { _decorator, Node, Sprite } from "cc";
import { EventType } from "../../../config/EventType";
import { SceneMgr } from "../../../manager/SceneMgr";
import { FriendListItemModel } from "../../../models/FriendModel";
import CCUtil from "../../../util/CCUtil";
import { EventMgr } from "../../../util/EventManager";
import { HeadIdMap } from "../FriendInfo";
import { BaseFriendListItem } from "./BaseFriendListItem";

const { ccclass, property } = _decorator;

// FriendListItem Class
@ccclass('FriendListItem')
export class FriendListItem extends BaseFriendListItem {
    @property({ type: Node, tooltip: "聊天按钮" })
    chatBtn: Node = null;

    @property({ type: Node })
    kingdomBtn: Node = null;

    @property({ type: Node, tooltip: "红点提示" })
    ndRedPoint: Node = null;

    @property({ type: Node, tooltip: "黑名单按钮" })
    blacklist: Node = null;

    private _data: FriendListItemModel = null;

    protected start(): void {
        this.initEvent();
    }

    private initEvent() {
        CCUtil.onBtnClick(this.chatBtn, this.chatClickEvent.bind(this));
        CCUtil.onBtnClick(this.kingdomBtn, this.kingdomBtnClick.bind(this));
    }

    async initData(data: FriendListItemModel) {
        this._data = data;
        const avatar = HeadIdMap[data.avatar];
        await this.setAvatar(avatar);
        this.lblRealName.string = data.user_name;
        this.ndRedPoint.active = data.unread_count > 0;
        this.stateIcon.getComponent(Sprite).grayscale = data.online !== 1;
        this.levelTxt.string = `${data.level}`;
        await this.setBackground(data.online === 1);
    }

    private chatClickEvent() {
        EventMgr.dispatch(EventType.Friend_Talk_Event, this._data);
    }

    private async kingdomBtnClick() {
        SceneMgr.loadMainScene(this._data.friend_id);
    }
}