import { _decorator, Component, Label, Node, size, Sprite, UITransform, v3, Vec3 } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { ChatDataItem, FriendListItemModel } from '../../models/FriendModel';
import { User } from '../../models/User';
import { ObjectUtil } from '../../util/ObjectUtil';
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

    async initData(data: ChatDataItem,friendInfo:FriendListItemModel) {
        
        //设置聊天时间
        this.lblTimeTxt.string = ObjectUtil.formatDateTime(data.create_time);
        let headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 }
        if (data.user_id != User.userID) { //当前聊天信息发起者不是我自己
            // 别人的头像应该在左边
            let posHead: Vec3 = this.ndHead.getPosition();
            this.ndHead.setPosition(v3(ChatContentItem.HeadLeftX, posHead.y, 0));
            //别人的聊天表情在左边
            let posBqIcon: Vec3 = this.chatImg.node.position;
            this.chatImg.node.setPosition(v3(ChatContentItem.ChatIconLeftX, posBqIcon.y, 0));
            //设置头像
            let avatar: number = headIdMap[friendInfo.avatar];
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
        let chatIconPath: string = "friend/" + data.message + "/spriteFrame";
        await LoadManager.loadSprite(chatIconPath, this.chatImg).then(() => { },
            (error) => {
                // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
            });
        if (parseInt(data.message) < 100) {
            this.chatImg.node.getComponent(UITransform).setContentSize(size(166, 166));
        }
        else {
            this.chatImg.node.getComponent(UITransform).setContentSize(size(236, 158));
        }
    }
}


