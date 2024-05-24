import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { FriendItemClickInfo, FriendUnitInfo } from '../../models/FriendModel';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('ChatListItem')
export class ChatListItem extends Component {
    @property({ type: Sprite, tooltip: "底层背景" })
    imgBg: Sprite = null;

    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Node, tooltip: "按钮处理" })
    btnItem: Node = null;

    @property({ type: Label, tooltip: "名字标签" })
    lblRealName: Label = null;

    @property({ type: Label, tooltip: "状态标签" })
    lblState: Label = null;

    @property({ type: Label, tooltip: "关卡标签" })
    lblUnRead: Label = null;

    @property({ type: Node, tooltip: "未读红结点" })
    unRead: Node = null;

    @property({ type: [SpriteFrame], tooltip: "背景页的图片数组" }) // 0:选中 1: 未选中
    public sprBgAry: SpriteFrame[] = [];

    _data: FriendUnitInfo = null;

    protected onLoad(): void {
        //console.log("FriendListItem onLoad");
        this.addEvent();
    }

    addEvent() {
        CCUtil.onTouch(this.btnItem, this.onItemClick, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.btnItem, this.onItemClick, this);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    async initData(data: FriendUnitInfo, selectFriend: FriendUnitInfo) {
        this._data = data;
        let headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 }
        let avatar: number = headIdMap[data.ModelId];
        let avatarPath: string = "friend/head_" + avatar + "/spriteFrame";
        await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite)).then(() => { },
            (error) => {
                // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
            });
        this.lblRealName.string = data.RealName;
        this.lblState.string = data.Ltmsg;
        //设置背景
        let bSelect: boolean = false; //本单位是否选中
        if (!selectFriend) {
            bSelect = false;
        }
        else if (data.FriendId == selectFriend.FriendId) {
            bSelect = true;
        }
        this.imgBg.spriteFrame = bSelect ? this.sprBgAry[0] : this.sprBgAry[1];

        let bNoReadVisible: boolean = data.UnReadNum > 0 && data.FriendId != selectFriend.FriendId;
        this.unRead.active = bNoReadVisible;
        if (data.UnReadNum > 0) {
            this.lblUnRead.string = "" + data.UnReadNum;
        }
        else {
            this.lblUnRead.string = "0";
        }
    }

    onItemClick() {
        this.unRead.active = false;
        let data: FriendItemClickInfo = {
            info: this._data,
            node: this.node,
        }
        EventManager.emit(EventType.Friend_ClickChatFriendList, data);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


