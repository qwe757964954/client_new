import { _decorator, Label, Node } from "cc";
import { ConfirmParam } from "../../../config/ClassConfig";
import { SceneMgr } from "../../../manager/SceneMgr";
import { ViewsMgr } from "../../../manager/ViewsManager";
import { FriendListItemModel, FriendOperationType } from "../../../models/FriendModel";
import { FdServer } from "../../../service/FriendService";
import CCUtil from "../../../util/CCUtil";
import { HeadIdMap } from "../FriendInfo";
import { BaseFriendListItem } from "./BaseFriendListItem";

const { ccclass, property } = _decorator;

// BlackListItem Class
@ccclass('BlackListItem')
export class BlackListItem extends BaseFriendListItem {
    @property({ type: Node })
    kingdomBtn: Node = null;

    @property({ type: Node })
    exitBtn: Node = null;

    @property({ type: Label })
    friendship: Label = null;

    private _data: FriendListItemModel = null;

    protected start(): void {
        this.initEvent();
    }

    private initEvent() {
        CCUtil.onBtnClick(this.kingdomBtn, this.kingdomBtnClick.bind(this));
        CCUtil.onBtnClick(this.exitBtn, this.exitBtnClick.bind(this));
    }

    async initData(data: FriendListItemModel) {
        this._data = data;
        const avatar = HeadIdMap[data.avatar];
        await this.setAvatar(avatar);
        this.lblRealName.string = data.user_name;
        this.levelTxt.string = `${data.level}`;
        await this.setBackground(data.online === 1);
    }

    private async kingdomBtnClick() {
        SceneMgr.loadMainScene(this._data.friend_id);
    }

    private async exitBtnClick() {
        const contentStr = `<color=#000000>是否把<color=#ff0000>${this._data.nick_name}</color><color=#000000>移出黑名单</color>`;
        ViewsMgr.showConfirm(new ConfirmParam("", "",contentStr), () => {
            FdServer.reqUserDelFriendMessage(this._data.friend_id, FriendOperationType.Restore);
        });
    }
}