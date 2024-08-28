import { _decorator, Label, Node, Sprite } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { ApplicationStatus, ApplyModifyModel, UserApplyModel } from '../../models/FriendModel';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import ListItem from '../../util/list/ListItem';
import { HeadIdMap } from './FriendInfo';
const { ccclass, property } = _decorator;

@ccclass('FriendApplyItem')
export class FriendApplyItem extends ListItem {
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
    async initData(data: UserApplyModel){
        this._data = data;
        let avatar: number = HeadIdMap[data.avatar];
        let avatarPath: string = "friend/head_" + avatar + "/spriteFrame";
        await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite)).then(() => { },
            (error) => {
            });
        this.lblRealName.string = data.user_name;
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

