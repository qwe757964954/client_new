import { _decorator, Label, Node, Sprite } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { ApplicationStatus, ApplyModifyModel, UserApplyModel } from '../../models/FriendModel';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import ListItem from '../../util/list/ListItem';
import { HeadIdMap } from './FriendInfo';
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

    private _data: UserApplyModel = null;

    onLoad(): void {
        this.addEventListeners();
    }

    onDestroy(): void {
        this.removeEventListeners();
    }

    private addEventListeners(): void {
        CCUtil.onTouch(this.btnAccept, this.handleAcceptClick, this);
        CCUtil.onTouch(this.btnIgnore, this.handleIgnoreClick, this);
    }

    private removeEventListeners(): void {
        CCUtil.offTouch(this.btnAccept, this.handleAcceptClick, this);
        CCUtil.offTouch(this.btnIgnore, this.handleIgnoreClick, this);
    }

    async initData(data: UserApplyModel): Promise<void> {
        this._data = data;
        const avatar = HeadIdMap[data.avatar] || 101; // 默认头像
        const avatarPath = `friend/head_${avatar}/spriteFrame`;

        try {
            await LoadManager.loadSprite(avatarPath, this.imgHead);
        } catch (error) {
            console.error(`Failed to load avatar sprite: ${error.message}`);
        }

        this.lblRealName.string = data.nick_name;
        this.lblID.string = `${data.user_id}`;
    }

    private handleIgnoreClick(): void {
        this.modifyApplicationStatus(ApplicationStatus.Rejected);
    }

    private handleAcceptClick(): void {
        this.modifyApplicationStatus(ApplicationStatus.Approved);
    }

    private modifyApplicationStatus(status: ApplicationStatus): void {
        const param: ApplyModifyModel = {
            friend_id: this._data.user_id,
            status
        };
        FdServer.reqUserFriendApplyModify(param);
    }
}
