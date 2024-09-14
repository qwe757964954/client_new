import { _decorator, EventTouch, isValid, Label, Node, NodeEventType, UITransform } from 'cc';
import { ChatDataItem, ChatMessageResponse, FriendListItemModel, SendMessageModel } from '../../models/FriendModel';
import { NetNotify } from '../../net/NetNotify';
import { BasePopFriend } from '../../script/BasePopFriend';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ChatContentItem } from './ChatContentItem';
import { ChatEmoteItem } from './ChatEmoteItem';
import { ChatTalkItem } from './ChatTalkItem';
import { FriendConfig } from './FriendConfig';

const { ccclass, property } = _decorator;

@ccclass('FriendTalkDialogView')
export class FriendTalkDialogView extends BasePopFriend {
    @property({ type: Node, tooltip: "关闭按钮" })
    closeBtn: Node = null;

    @property({ type: Node, tooltip: "内容根结点" })
    contentNd: Node = null;

    @property({ type: Node, tooltip: "发送表情按钮" })
    bqBtn: Node = null;

    @property({ type: Node, tooltip: "发送消息按钮" })
    sendBtn: Node = null;

    @property({ type: Node, tooltip: "聊天按钮" })
    chatBtn: Node = null;

    @property({ type: Node, tooltip: "表情选择区域" })
    bqSelectBox: Node = null;

    @property({ type: List, tooltip: "表情选择列表" })
    bqSelectList: List = null;

    @property({ type: Node, tooltip: "快捷语选择区域" })
    talkSelectBox: Node = null;

    @property({ type: List, tooltip: "快捷语选择列表" })
    talkSelectList: List = null;

    @property({ type: List, tooltip: "聊天列表" })
    talkList: List = null;

    @property({ type: Node, tooltip: "表情区域" })
    bqContent: Node = null;

    @property(Label)
    nameLab: Label = null;

    private _bqList: number[] = [];
    private _magicList: number[] = [];
    private _selectFriend: FriendListItemModel = null;
    private _chatDatas: ChatDataItem[] = [];

    init(friend: FriendListItemModel): void {
        this._selectFriend = friend;
        this.nameLab.string = this._selectFriend.nick_name;
        this.requestFriendData();
    }

    protected initUI(): void {
        this.enableClickBlankToClose([this.contentNd]);
        this.setMagicData();
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [NetNotify.Classification_UserFriendMessageList, this.onUserFriendMessageList],
            [NetNotify.Classification_UserSendMessageFriend, this.onUserSendMessageFriend],
            [NetNotify.Classification_UserMessageStatusUpdate, this.onUserMessageStatusUpdate],
        ]);
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.closeBtn, this.onCloseView.bind(this));
        CCUtil.onBtnClick(this.bqBtn, this.onBqBtnClick.bind(this));
        CCUtil.onBtnClick(this.chatBtn, this.onChatBtnClick.bind(this));
    }

    private requestFriendData(): void {
        FdServer.reqUserFriendMessageList(this._selectFriend.friend_id);
        FdServer.reqUserMessageStatusUpdate(this._selectFriend.friend_id);
    }

    private async onUserFriendMessageList(response: ChatMessageResponse): Promise<void> {
        this._chatDatas = response.data;
        this.talkList.numItems = this._chatDatas.length;
        this.talkList.update();
        this.talkList.scrollTo(this._chatDatas.length - 1);
    }

    private async setMagicData(): Promise<void> {
        this._bqList = [
            ...Array.from({ length: 39 }, (_, i) => i + 1).filter(i => ![2, 3, 9, 12, 14].includes(i)), 
            ...Array.from({ length: 27 }, (_, i) => i + 100)
        ];
    }

    private onUserMessageStatusUpdate(response: any): void {
        console.log("User message status updated:", response);
        this.talkList.updateAll();
    }

    private onUserSendMessageFriend(): void {
        this.bqContent.active = false;
        this.requestFriendData();
    }

    private onLoadMagicFaceVertical(item: Node, idx: number): void {
        const itemScript = item.getComponent(ChatEmoteItem);
        if (itemScript) itemScript.initData(this._magicList[idx]);
    }

    private onMagicFaceVerticalSelected(item: Node, selectedId: number): void {
        if (isValid(selectedId) && selectedId >= 0) {
            this.sendMessage(this._magicList[selectedId]);
        }
    }

    private onLoadChatVertical(item: Node, idx: number): void {
        const itemScript = item.getComponent(ChatTalkItem);
        if (itemScript) itemScript.initData(FriendConfig.shortcutInfo[idx]);
    }

    private onChatVerticalSelected(item: Node, selectedId: number): void {
        if (isValid(selectedId) && selectedId >= 0) {
            const shortcut = FriendConfig.shortcutInfo[selectedId];
            this.sendMessage(shortcut.id);
        }
    }

    private onLoadChatContentListVertical(item: Node, idx: number): void {
        const itemScript = item.getComponent(ChatContentItem);
        if (itemScript) itemScript.initData(this._chatDatas[idx], this._selectFriend);
    }

    private async onBqBtnClick(): Promise<void> {
        this.bqContent.active = true;
        this.bqSelectBox.active = true;
        this.talkSelectBox.active = false;
        this.setupClickToClose(this.bqSelectBox, this.bqContent);
        this._magicList = this._bqList.filter(num => num < 100);
        this.bqSelectList.numItems = this._magicList.length;
    }

    private async onChatBtnClick(): Promise<void> {
        this.bqContent.active = true;
        this.bqSelectBox.active = false;
        this.talkSelectBox.active = true;
        this.setupClickToClose(this.talkSelectBox, this.bqContent);
        console.log('Shortcut info:', FriendConfig.shortcutInfo);
        this.talkSelectList.numItems = FriendConfig.shortcutInfo.length;
    }

    private setupClickToClose(target: Node, content: Node): void {
        const touchEndHandler = (evt: EventTouch) => {
            const startPos = evt.getUIStartLocation();
            const endPos = evt.getUILocation();
            const subPos = endPos.subtract(startPos);
            if (Math.abs(subPos.x) < 15 && Math.abs(subPos.y) < 15) {
                const uiTransform = target.getComponent(UITransform);
                if (uiTransform && !uiTransform.getBoundingBoxToWorld().contains(startPos)) {
                    content.off(NodeEventType.TOUCH_END, touchEndHandler, this);
                    content.active = false;
                }
            }
        };
        content.on(NodeEventType.TOUCH_END, touchEndHandler, this);
    }

    private sendMessage(message: number | string): void {
        const param: SendMessageModel = {
            friend_id: this._selectFriend.friend_id,
            message: `${message}`
        };
        FdServer.reqUserSendMessageFriend(param);
    }

    private onCloseView(): void {
        this.closePop();
    }
}
