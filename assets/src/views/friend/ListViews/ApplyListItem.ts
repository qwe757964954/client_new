import { _decorator, Label, Node, Sprite } from 'cc';
import { LoadManager } from '../../../manager/LoadManager';
import { ApplicationStatus, ApplyModifyModel, UserApplyModel } from '../../../models/FriendModel';
import { FdServer } from '../../../service/FriendService';
import CCUtil from '../../../util/CCUtil';
import ListItem from '../../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('ApplyListItem')
export class ApplyListItem extends ListItem {
    @property({ type: Sprite, tooltip: "底层背景" })
    imgBg: Sprite = null;

    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Label, tooltip: "朋友名字标签" })
    lblRealName: Label = null;

    @property({ type: Label, tooltip: "状态标签" })
    lblState: Label = null;

    @property(Node)
    public agreeBtn:Node = null;
    @property(Node)
    public rejectBtn:Node = null;
    _data: UserApplyModel = null;

    protected start(): void {
        this.initEvent();
    }
    initEvent(){
        CCUtil.onBtnClick(this.agreeBtn,this.agreeBtnClick.bind(this));
        CCUtil.onBtnClick(this.rejectBtn,this.rejectBtnClick.bind(this));
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
        this.lblRealName.string = data.user_name;
        // this.lblRedTip.string = data.unread_count + "";
    }
    agreeBtnClick(){
        this.modifyApplicationStatus(ApplicationStatus.Approved);
    }
    rejectBtnClick(){
        this.modifyApplicationStatus(ApplicationStatus.Rejected);
    }

    private modifyApplicationStatus(status: ApplicationStatus): void {
        const param: ApplyModifyModel = {
            friend_id: this._data.user_id,
            status
        };
        FdServer.reqUserFriendApplyModify(param);
    }
}


