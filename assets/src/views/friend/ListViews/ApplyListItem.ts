import { _decorator, Node } from 'cc';
import { EventType } from '../../../config/EventType';
import { ApplicationStatus, ApplyModifyModel, UserApplyModel } from '../../../models/FriendModel';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';
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

    private agreeBtnClick() {
         this.modifyApplicationStatus(ApplicationStatus.Approved);
    }

    private rejectBtnClick() {
         this.modifyApplicationStatus(ApplicationStatus.Rejected);
    }

    private modifyApplicationStatus(status: ApplicationStatus) {

        const param: ApplyModifyModel = {
            friend_id: this._data.user_id,
            nick_name: this._data.nick_name,
            status
        };
        EventMgr.dispatch(EventType.Req_Apply_Modify,param);
    }
}

