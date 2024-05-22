import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { FriendUnitInfo } from '../../models/FriendModel';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import { ServiceMgr } from '../../net/ServiceManager';
const { ccclass, property } = _decorator;

@ccclass('MsgListItem')
export class MsgListItem extends Component {
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

    _data: FriendUnitInfo = null;

    protected onLoad(): void {
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

    protected onDestroy(): void {
        this.removeEvent();
    }

    async initData(data: FriendUnitInfo) {
        this._data = data;
        let headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 }
        let avatar: number = headIdMap[data.ModelId];
        let avatarPath: string = "friend/head_" + avatar + "/spriteFrame";
        await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite)).then(() => { },
            (error) => {
                // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
            });
        this.lblRealName.string = data.RealName;
        this.lblID.string = "" + data.FriendId;
    }

    private onIngoreClick() {
        ServiceMgr.friendService.friendApplyStatus(this._data.FriendId, 2);
    }

    private onAcceptClick() {
        ServiceMgr.friendService.friendApplyStatus(this._data.FriendId, 1);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


