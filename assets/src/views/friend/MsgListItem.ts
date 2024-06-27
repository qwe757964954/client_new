import { _decorator, Label, Node, Sprite } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { ApplicationStatus, ApplyModifyModel, UserApplyModel } from '../../models/FriendModel';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('MsgListItem')
export class MsgListItem extends ListItem {
    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Label, tooltip: "名字标签" })
    lblRealName: Label = null;

    @property({ type: Label, tooltip: "ID标签" })
    lblID: Label = null;

    @property({ type: Node, tooltip: "忽略按钮" })
    btnIgnore: Node = null;

    @property({ type: Node, tooltip: "同意按钮" })
    btnAccept: Node = null;

    _data: UserApplyModel = null;

    onLoad(): void {
        //console.log("FriendListItem onLoad");
        this.addEvent();
    }

    addEvent() {
        CCUtil.onTouch(this.btnAccept, this.onAcceptClick, this);
        CCUtil.onTouch(this.btnIgnore, this.onIngoreClick, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.btnAccept, this.onAcceptClick, this);
        CCUtil.offTouch(this.btnIgnore, this.onIngoreClick, this);
    }

    onDestroy(): void {
        this.removeEvent();
    }

    async initData(data: UserApplyModel) {
        this._data = data;
        let headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 }
        let avatar: number = headIdMap[data.avatar];
        let avatarPath: string = "friend/head_" + avatar + "/spriteFrame";
        await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite)).then(() => { },
            (error) => {
                // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
            });
        this.lblRealName.string = data.nick_name;
        this.lblID.string = "" + data.user_id;
    }

    private onIngoreClick() {
        let param:ApplyModifyModel = {
            friend_id:this._data.user_id,
            status:ApplicationStatus.Rejected
        }
        FdServer.reqUserFriendApplyModify(param);
    }

    private onAcceptClick() {
        let param:ApplyModifyModel = {
            friend_id:this._data.user_id,
            status:ApplicationStatus.Rejected
        }
        FdServer.reqUserFriendApplyModify(param);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


