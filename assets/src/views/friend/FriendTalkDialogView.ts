import { _decorator, EventTouch, isValid, Node, NodeEventType, UITransform } from 'cc';
import { ChatDataItem, ChatMessageResponse, DataFriendListResponse, FriendListItemModel, SendMessageModel } from '../../models/FriendModel';
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
    @property({ type: Node, tooltip: "表情区域" })
    bq_content: Node = null;

    private _bqList: number[] = [];
    private _magicList: number[] = [];
    private _selectFriend: FriendListItemModel = null;
    private _friendDataList: FriendListItemModel[] = [];
    private _chatDatas:ChatDataItem[] = [];
    private _currentFriendSelected: number = 0;
    init(friend:FriendListItemModel[]) {
        this._friendDataList = friend;
        this.friendList.numItems = this._friendDataList.length;
        this.friendList.selectedId = this._currentFriendSelected;
    }

    protected initUI(): void {
        this.setMagicData();
        this.enableClickBlankToClose([this.node.getChildByName("content")]).then(()=>{
        });
        
    }

    set currentFriendSelected(selected: number) {
        this._currentFriendSelected = selected;
    }

    protected onInitModuleEvent(){
        this.addModelListeners([
            [NetNotify.Classification_UserFriendMessageList, this.onUserFriendMessageList],
            [NetNotify.Classification_UserSendMessageFriend, this.onUserSendMessageFriend],
            [NetNotify.Classification_UserFriendList, this.onUpdateFriendList],
            [NetNotify.Classification_UserMessageStatusUpdate, this.onUserMessageStatusUpdate],
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
        this.talkList.update();
        this.talkList.scrollTo(this._chatDatas.length - 1);
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

    onUpdateFriendList(friendDatas: DataFriendListResponse){
        this.init(friendDatas.data);
    }

    onloadFriendListVertical(item:Node,idx:number) {
        console.log("onloadFriendListVertical....",this._friendDataList[idx]);
        let item_script = item.getComponent(ChatListItem);
        item_script.initData(this._friendDataList[idx]);
    }

    onUserMessageStatusUpdate(response:any){
        console.log("onUserMessageStatusUpdate....",response);
        this._friendDataList[this._currentFriendSelected].unread_count = 0;
        this.friendList.numItems = this._friendDataList.length;
        this.talkList.updateAll();
    }

    onFriendListVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        this._selectFriend = this._friendDataList[selectedId];
        this._currentFriendSelected = selectedId;
        FdServer.reqUserFriendMessageList(this._selectFriend.friend_id);
        if(this._selectFriend.unread_count > 0){
            FdServer.reqUserMessageStatusUpdate(this._selectFriend.friend_id);
        }
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
        this.bq_content.active = true;
        this.magicClickBlankToClose();
        this._magicList= this._bqList.filter(num => num < 100);
        this.selectList.numItems = this._magicList.length;
    }

    onUserSendMessageFriend(data:any){
        this.bq_content.active = false;
        FdServer.reqUserFriendList();
    }
    async onSendBtnClick() {
        this.bq_content.active = true;
        this.magicClickBlankToClose();
        this._magicList= this._bqList.filter(num => num >= 100);
        this.selectList.numItems = this._magicList.length;
    }
    magicClickBlankToClose() {
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
                    this.bq_content.off(NodeEventType.TOUCH_END, touchEndHandler, this);
                    this.bq_content.active = false;
                }
            }
        };
        this.bq_content.on(NodeEventType.TOUCH_END, touchEndHandler, this);
    }
}


