import { _decorator, Component, Label, Node, size, Sprite, UITransform, v3, Vec3 } from 'cc';
import { FriendChatInfo, FriendUnitInfo } from '../../models/FriendModel';
import { LoadManager } from '../../manager/LoadManager';
import { User } from '../../models/User';
const { ccclass, property } = _decorator;

@ccclass('ChatContentItem')
export class ChatContentItem extends Component {
    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Node, tooltip: "头像结点" })
    ndHead: Node = null;

    @property({ type: Node, tooltip: "当前时间结点" })
    timeBox: Node = null;

    @property({ type: Label, tooltip: "当前时间" })
    lblTimeTxt: Label = null;

    @property({ type: Sprite, tooltip: "聊天图片精灵" })
    chatImg: Sprite = null;

    static readonly HeadLeftX: number = -273;     // 头像的左边位置，右边位置取反即可
    static readonly ChatIconLeftX: number = -10;  // 聊天内容图标左边位置 

    _data: FriendChatInfo = null;

    async initData(data: FriendChatInfo, selectFriend: FriendUnitInfo) {
        //设置聊天时间
        this.lblTimeTxt.node.active = this.timeBox.active = data.isShow;
        if (data.isShow) {
            let date: Date = new Date(data.CreateTime);
            let nowTime: Date = new Date(); //当前时间
            if (date.getMonth() != nowTime.getMonth() || date.getDate() != nowTime.getDate()) {
                this.timeBox.getComponent(UITransform).width = 120;
                this.lblTimeTxt.string = (date.getMonth() + 1) + "月" + date.getDate() + "日 " + date.getHours() + ":" + date.getMinutes();
            } else {
                this.timeBox.getComponent(UITransform).width = 60;
                this.lblTimeTxt.string = date.getHours() + ":" + date.getMinutes();
            }
        }
        let headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 }
        if (data.AccountId != User.userID) { //当前聊天信息发起者不是我自己
            // 别人的头像应该在左边
            let posHead: Vec3 = this.ndHead.getPosition();
            this.ndHead.setPosition(v3(ChatContentItem.HeadLeftX, posHead.y, 0));
            //别人的聊天表情在左边
            let posBqIcon: Vec3 = this.chatImg.node.position;
            this.chatImg.node.setPosition(v3(ChatContentItem.ChatIconLeftX, posBqIcon.y, 0));
            //设置头像
            let avatar: number = headIdMap[selectFriend.ModelId];
            let avatarPath: string = "friend/head_" + avatar + "/spriteFrame";
            await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite)).then(() => { },
                (error) => {
                    // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
                });
        }
        else {
            // 自己的头像应该在右边
            let posHead: Vec3 = this.ndHead.getPosition();
            this.ndHead.setPosition(v3(-ChatContentItem.HeadLeftX, posHead.y, 0));
            //自己的聊天表情在右边
            let posBqIcon: Vec3 = this.chatImg.node.position;
            this.chatImg.node.setPosition(v3(-ChatContentItem.ChatIconLeftX, posBqIcon.y, 0));
            let avatar: number = headIdMap[User.avatarID];
            let avatarPath: string = "friend/head_" + avatar + "/spriteFrame";
            await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite)).then(() => { },
                (error) => {
                    // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
                });
        }

        //设置聊天内容
        let chatIconPath: string = "friend/" + data.Message + "/spriteFrame";
        await LoadManager.loadSprite(chatIconPath, this.chatImg).then(() => { },
            (error) => {
                // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
            });
        if (data.Message < 100) {
            this.chatImg.node.getComponent(UITransform).setContentSize(size(166, 166));
        }
        else {
            this.chatImg.node.getComponent(UITransform).setContentSize(size(236, 158));
        }

    }

    start() {

    }

    update(deltaTime: number) {

    }
}


