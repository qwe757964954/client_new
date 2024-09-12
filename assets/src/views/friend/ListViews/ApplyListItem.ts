import { _decorator, Node } from 'cc';
import { ApplicationStatus, ApplyModifyModel, UserApplyModel } from '../../../models/FriendModel';
import { FdServer } from '../../../service/FriendService';
import CCUtil from '../../../util/CCUtil';
import { HeadIdMap } from '../FriendInfo';
import { BaseFriendListItem } from './BaseFriendListItem';
const { ccclass, property } = _decorator;
// ApplyListItem Class

@ccclass('ApplyListItem')
export class ApplyListItem extends BaseFriendListItem {
    @property(Node)
    public agreeBtn: Node = null;

    @property(Node)
    public rejectBtn: Node = null;

    private _data: UserApplyModel = null;

    protected start(): void {
        this.initEvent();
    }

    private initEvent() {
        CCUtil.onBtnClick(this.agreeBtn, this.agreeBtnClick.bind(this));
        CCUtil.onBtnClick(this.rejectBtn, this.rejectBtnClick.bind(this));
    }

    async initData(data: UserApplyModel) {
        this._data = data;
        const avatar = HeadIdMap[data.avatar];
        await this.setAvatar(avatar);
        this.lblRealName.string = data.user_name;
    }

    private async agreeBtnClick() {
        await this.modifyApplicationStatus(ApplicationStatus.Approved);
    }

    private async rejectBtnClick() {
        await this.modifyApplicationStatus(ApplicationStatus.Rejected);
    }

    private async modifyApplicationStatus(status: ApplicationStatus) {
        const param: ApplyModifyModel = {
            friend_id: this._data.user_id,
            status
        };
        try {
            await FdServer.reqUserFriendApplyModify(param);
        } catch (error) {
            console.error(`Failed to modify application status: ${error.message}`);
        }
    }
}

