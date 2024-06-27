import { _decorator, isValid, Node, Prefab, SpriteFrame } from 'cc';
import { ChatDataItem, ChatMessageResponse, FriendListItemModel, SendMessageModel } from '../../models/FriendModel';
import { NetNotify } from '../../net/NetNotify';
import { BasePopup } from '../../script/BasePopup';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ChatContentItem } from './ChatContentItem';
import { ChatEmoteItem } from './ChatEmoteItem';
import { ChatListItem } from './ChatListItem';
const { ccclass, property } = _decorator;

@ccclass('FriendTalkDialogView')
export class FriendTalkDialogView extends BasePopup {
    @property({ type: Node, tooltip: "关闭按钮" })
    closeBtn: Node = null;

    @property({ type: Node, tooltip: "内容根结点" })
    public contentNd: Node = null;

    @property({ type: Node, tooltip: "发送表情按钮" })
    bqBtn: Node = null;

    @property({ type: Node, tooltip: "发送表情按钮2" })
    sendBtn: Node = null;

    @property({ type: Node, tooltip: "热点区域" })
    hotAreaBox: Node = null;

    @property({ type: Node, tooltip: "表情选择区域" })
    bqSelectBox: Node = null;

    @property({ type: List, tooltip: "表情选择列表" }) // 
    selectList: List = null;

    @property({ type: List, tooltip: "好友列表" }) // friendList
    friendList: List = null;

    @property({ type: List, tooltip: "聊天列表" }) // friendList
    talkList: List = null;

    @property({ type: Prefab, tooltip: "表情选择预制体" })
    preEmoteItem: Prefab = null;

    @property({ type: Prefab, tooltip: "朋友列表中的一项预制体" })
    preFriendItem: Prefab = null;

    @property({ type: Prefab, tooltip: "聊天的一项预制体" })
    preTalkItem: Prefab = null;

    @property({ type: [SpriteFrame], tooltip: "朋友列表里一项背景页的图片数组" }) // 0:选中 1: 未选中
    public sprfriendItemBgAry: SpriteFrame[] = [];

    private _bqList: number[] = [];
    private _magicList: number[] = [];
    private _selectFriend: FriendListItemModel = null;
    private _friendDataList: FriendListItemModel[] = [];
    private _chatDatas:ChatDataItem[] = [];
    init(friend:FriendListItemModel[]) {
        this._friendDataList = friend;
        this.friendList.numItems = this._friendDataList.length;
        this.friendList.selectedId = 0;
    }

    protected initUI(): void {
        this.setMagicData();
    }

    protected onInitModuleEvent(){
        this.addModelListeners([
            [NetNotify.Classification_UserFriendMessageList, this.onUserFriendMessageList],
            [NetNotify.Classification_UserSendMessageFriend, this.onUserSendMessageFriend],
        ]);
    }
    protected initEvent(): void {
        CCUtil.onBtnClick(this.closeBtn,this.onCloseView.bind(this));
        CCUtil.onBtnClick(this.bqBtn,this.onBqBtnClick.bind(this));
        CCUtil.onBtnClick(this.sendBtn,this.onSendBtnClick.bind(this));
    }

    onUserFriendMessageList(response:ChatMessageResponse){
        this._chatDatas = response.data;
        this.talkList.numItems = this._chatDatas.length;
    }

    async setMagicData() {
        this._bqList = [];
        for (let i = 1; i <= 40; i++) {
            if (i == 2 || i == 3 || i == 9 || i == 12 || i == 14) continue;
            this._bqList.push(i);
        }
        for (let i = 100; i < 127; i++) {
            this._bqList.push(i);
        }
    }



    onloadFriendListVertical(item:Node,idx:number) {
        let item_script = item.getComponent(ChatListItem);
        item_script.initData(this._friendDataList[idx]);
    }

    onFriendListVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        this._selectFriend = this._friendDataList[selectedId];
        FdServer.reqUserFriendMessageList(this._selectFriend.friend_id);
    }


    onloadMagicFaceVertical(item:Node,idx:number) {
        let item_script = item.getComponent(ChatEmoteItem);
        item_script.initData(this._magicList[idx]);
    }

    onMagicFaceVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        let param:SendMessageModel = {
            friend_id:this._selectFriend.friend_id,
            message:`${this._magicList[selectedId]}` 
        }
        FdServer.reqUserSendMessageFriend(param);
    }
    onCloseView() {
        this.closePop();
    }

    onloadChatContentListVertical(item:Node,idx:number) {
        let item_script = item.getComponent(ChatContentItem);
        item_script.initData(this._chatDatas[idx],this._selectFriend);
    }
    //点击发送表情
    async onBqBtnClick() {
        this.bqSelectBox.active = true;
        this._magicList= this._bqList.filter(num => num < 100);
        this.selectList.numItems = this._magicList.length;
    }

    onUserSendMessageFriend(data:any){
        this.bqSelectBox.active = false;
    }
    async onSendBtnClick() {
        this.bqSelectBox.active = true;
        this._magicList= this._bqList.filter(num => num >= 100);
        this.selectList.numItems = this._magicList.length;
    }
}


