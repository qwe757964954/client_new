import { _decorator, EventTouch, isValid, Node, NodeEventType, UITransform } from 'cc';
import { ChatDataItem, ChatMessageResponse, FriendListItemModel, SendMessageModel } from '../../models/FriendModel';
import { NetNotify } from '../../net/NetNotify';
import { BasePopFriend } from '../../script/BasePopFriend';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ChatContentItem } from './ChatContentItem';
import { ChatEmoteItem } from './ChatEmoteItem';

const { ccclass, property } = _decorator;

@ccclass('FriendTalkDialogView')
export class FriendTalkDialogView extends BasePopFriend {
    @property({ type: Node, tooltip: "关闭按钮" })
    closeBtn: Node = null;

    @property({ type: Node, tooltip: "内容根结点" })
    public contentNd: Node = null;

    @property({ type: Node, tooltip: "发送表情按钮" })
    bqBtn: Node = null;

    @property({ type: Node, tooltip: "发送消息按钮" })
    sendBtn: Node = null;

    @property({ type: Node, tooltip: "热点区域" })
    hotAreaBox: Node = null;

    @property({ type: Node, tooltip: "表情选择区域" })
    bqSelectBox: Node = null;

    @property({ type: List, tooltip: "表情选择列表" })
    selectList: List = null;

    @property({ type: List, tooltip: "聊天列表" })
    talkList: List = null;

    @property({ type: Node, tooltip: "表情区域" })
    bqContent: Node = null;

    private _bqList: number[] = [];
    private _magicList: number[] = [];
    private _selectFriend: FriendListItemModel = null;
    private _friendDataList: FriendListItemModel[] = [];
    private _chatDatas: ChatDataItem[] = [];
    private _currentFriendSelected: number = 0;

    init(friend: FriendListItemModel): void {
        this._selectFriend = friend;
        FdServer.reqUserFriendMessageList(this._selectFriend.friend_id);
    }

    protected initUI(): void {
        this.setMagicData();
        // this.enableClickBlankToClose([this.node.getChildByName("content")]);
    }

    set currentFriendSelected(selected: number) {
        this._currentFriendSelected = selected;
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
        CCUtil.onBtnClick(this.sendBtn, this.onSendBtnClick.bind(this));
    }

    private async onUserFriendMessageList(response: ChatMessageResponse): Promise<void> {
        this._chatDatas = response.data;
        this.talkList.numItems = this._chatDatas.length;
        this.talkList.update();
        this.talkList.scrollTo(this._chatDatas.length - 1);
    }

    private async setMagicData(): Promise<void> {
        this._bqList = [];
        for (let i = 1; i <= 40; i++) {
            if ([2, 3, 9, 12, 14].includes(i)) continue;
            this._bqList.push(i);
        }
        for (let i = 100; i < 127; i++) {
            this._bqList.push(i);
        }
    }

    private onUserMessageStatusUpdate(response: any): void {
        console.log("onUserMessageStatusUpdate....", response);
        this._friendDataList[this._currentFriendSelected].unread_count = 0;
        this.talkList.updateAll();
    }
    onUserSendMessageFriend(data:any){
        this.bqContent.active = false;
        FdServer.reqUserFriendMessageList(this._selectFriend.friend_id);
    }
    private onFriendListVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number): void {
        if (!isValid(selectedId) || selectedId < 0 || !isValid(item)) return;
        this._selectFriend = this._friendDataList[selectedId];
        this._currentFriendSelected = selectedId;
        FdServer.reqUserFriendMessageList(this._selectFriend.friend_id);
        if (this._selectFriend.unread_count > 0) {
            FdServer.reqUserMessageStatusUpdate(this._selectFriend.friend_id);
        }
    }

    private onloadMagicFaceVertical(item: Node, idx: number): void {
        const itemScript = item.getComponent(ChatEmoteItem);
        itemScript.initData(this._magicList[idx]);
    }

    private onMagicFaceVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number): void {
        if (!isValid(selectedId) || selectedId < 0 || !isValid(item)) return;
        const param: SendMessageModel = {
            friend_id: this._selectFriend.friend_id,
            message: `${this._magicList[selectedId]}`
        };
        FdServer.reqUserSendMessageFriend(param);
    }

    private onloadChatContentListVertical(item: Node, idx: number): void {
        const itemScript = item.getComponent(ChatContentItem);
        itemScript.initData(this._chatDatas[idx], this._selectFriend);
    }

    private async onBqBtnClick(): Promise<void> {
        this.bqContent.active = true;
        this.magicClickBlankToClose();
        this._magicList = this._bqList.filter(num => num < 100);
        this.selectList.numItems = this._magicList.length;
    }

    private async onSendBtnClick(): Promise<void> {
        this.bqContent.active = true;
        this.magicClickBlankToClose();
        this._magicList = this._bqList.filter(num => num >= 100);
        this.selectList.numItems = this._magicList.length;
    }

    private magicClickBlankToClose(): void {
        const touchEndHandler = (evt: EventTouch) => {
            const startPos = evt.getUIStartLocation();
            const endPos = evt.getUILocation();
            const subPos = endPos.subtract(startPos);
            if (Math.abs(subPos.x) < 15 && Math.abs(subPos.y) < 15) {
                let needClose = true;
                const uiTransform = this.bqSelectBox.getComponent(UITransform);
                if (uiTransform && uiTransform.getBoundingBoxToWorld().contains(startPos)) {
                    needClose = false;
                }
                if (needClose) {
                    this.bqContent.off(NodeEventType.TOUCH_END, touchEndHandler, this);
                    this.bqContent.active = false;
                }
            }
        };
        this.bqContent.on(NodeEventType.TOUCH_END, touchEndHandler, this);
    }

    private onCloseView(): void {
        this.closePop();
    }
}
