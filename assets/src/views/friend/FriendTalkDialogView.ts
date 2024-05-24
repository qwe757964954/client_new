import { _decorator, Button, Component, instantiate, Node, Prefab, ScrollView, Sprite, SpriteFrame } from 'cc';
import { FriendChatInfo, FriendChatNetResponse, FriendItemClickInfo, FriendUnitInfo } from '../../models/FriendModel';
import { ServiceMgr } from '../../net/ServiceManager';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabConfig, PrefabType } from '../../config/PrefabType';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import { ChatListItem } from './ChatListItem';
import { User } from '../../models/User';
import { ChatContentItem } from './ChatContentItem';
import { ChatEmoteItem } from './ChatEmoteItem';
import { EffectUtil } from '../../util/EffectUtil';
const { ccclass, property } = _decorator;

@ccclass('FriendTalkDialogView')
export class FriendTalkDialogView extends Component {
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

    @property({ type: ScrollView, tooltip: "表情选择列表" }) // 
    selectList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "好友列表" }) // friendList
    friendList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "聊天列表" }) // friendList
    talkList: ScrollView = null;

    @property({ type: Prefab, tooltip: "表情选择预制体" })
    preEmoteItem: Prefab = null;

    @property({ type: Prefab, tooltip: "朋友列表中的一项预制体" })
    preFriendItem: Prefab = null;

    @property({ type: Prefab, tooltip: "聊天的一项预制体" })
    preTalkItem: Prefab = null;

    @property({ type: [SpriteFrame], tooltip: "朋友列表里一项背景页的图片数组" }) // 0:选中 1: 未选中
    public sprfriendItemBgAry: SpriteFrame[] = [];

    private _friendItemList: Node[] = [];
    private _bqItemList: Node[] = [];
    private _canClick: boolean = true;
    private _showBq: boolean = true;
    private _bqList: number[] = [];
    private _wordBqList: number[] = [];
    private _selectFriend: FriendUnitInfo = null;

    private _friendDataList: FriendUnitInfo[] = [];

    private _getMyFriendListEveId: string = ""; //获取我的好友列表
    private _clickMyFriendListEveId: string = ""; //点击我的好友列表中的一项
    private _getFriendMsgListEveId: string = ""; //获取好友的消息列表
    private _clickEmotionEveId: string = "";     //点击选择一个表情
    private _sendFriendMsgEveId: string = "";     //向好友发送一个消息
    private _recvFriendMsgEveId: string = "";     //收到好友的消息

    private _canClose: boolean = false; //是否可关闭

    protected onLoad(): void {
        this._canClick = false;
        this._friendItemList = [];
        this._bqItemList = [];
        this._canClick = true;
        this._showBq = true;
        this._bqList = [];
        this._wordBqList = [];
        this._friendDataList = [];
    }

    init(friend: FriendUnitInfo) {
        this._selectFriend = friend;
        this.addEvent();
        this.initData();

        this.show();
    }

    /**弹出式窗口 */
    private show() {
        EffectUtil.centerPopup(this.contentNd);
        setTimeout(() => {
            this._canClose = true;
        })
    }

    async initData() {
        let userId: number = User.userID;
        //console.log("account:", userId);
        ServiceMgr.friendService.friendList();
        this._bqList = [];
        for (let i = 1; i <= 40; i++) {
            if (i == 2 || i == 3 || i == 9 || i == 12 || i == 14) continue;
            this._bqList.push(i);
        }
        this._wordBqList = [];
        for (let i = 100; i < 127; i++) {
            this._wordBqList.push(i);
        }

        this.setSelectList(this._bqList);
    }

    async setSelectList(bqList: number[]) {
        //设置selectList
        this.selectList.content.removeAllChildren();
        for (let i = 0; i < bqList.length; i++) {
            let ndEmote: Node = instantiate(this.preEmoteItem);
            this.selectList.content.addChild(ndEmote);
            /* let emotePath: string = "friend/" + bqList[i] + "/spriteFrame";
             await LoadManager.loadSprite(emotePath, ndEmote.getChildByName("bqIcon").getComponent(Sprite)).then(() => { },
                 (error) => {
                     // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
                 });*/
            ndEmote.getComponent(ChatEmoteItem).initData(bqList[i]);
        }
        this.selectList.scrollToTop();
    }

    addEvent() {
        CCUtil.onTouch(this.closeBtn, this.onCloseView, this);
        CCUtil.onTouch(this.bqBtn, this.onBqBtnClick, this); //onHideSelect
        CCUtil.onTouch(this.sendBtn, this.onSendBtnClick, this);
        CCUtil.onTouch(this.hotAreaBox, this.onHideSelect, this);

        this._getMyFriendListEveId = EventManager.on(EventType.Friend_MyList, this.onMsgNumList.bind(this)); //
        this._clickMyFriendListEveId = EventManager.on(EventType.Friend_ClickChatFriendList, this.onFriendItemClck.bind(this));
        this._getFriendMsgListEveId = EventManager.on(EventType.Friend_MsgList, this.onMsgList.bind(this));
        this._clickEmotionEveId = EventManager.on(EventType.Friend_SelectEmotion, this.onBqItemSelect.bind(this));
        this._sendFriendMsgEveId = EventManager.on(EventType.Friend_MsgSend, this.onMsgSend.bind(this));
        this._recvFriendMsgEveId = EventManager.on(EventType.Friend_RecMessage, this.onRecMsg.bind(this));
    }

    removeEvent() {
        CCUtil.offTouch(this.closeBtn, this.onCloseView, this);
        CCUtil.offTouch(this.bqBtn, this.onBqBtnClick, this);
        CCUtil.offTouch(this.sendBtn, this.onSendBtnClick, this);
        CCUtil.offTouch(this.hotAreaBox, this.onHideSelect, this);
        EventManager.off(EventType.Friend_MyList, this._getMyFriendListEveId);
        EventManager.off(EventType.Friend_ClickChatFriendList, this._clickMyFriendListEveId);
        EventManager.off(EventType.Friend_MsgList, this._getFriendMsgListEveId);
        EventManager.off(EventType.Friend_SelectEmotion, this._clickEmotionEveId);
        EventManager.off(EventType.Friend_MsgSend, this._sendFriendMsgEveId);
        EventManager.off(EventType.Friend_RecMessage, this._recvFriendMsgEveId);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    onCloseView() {
        // ViewsManager.instance.closeView(PrefabType.FriendTalkDialogView);
        if (!this._canClose) return;
        this._canClose = false;
        EffectUtil.centerClose(this.contentNd, () => {
            //if (this._callBack) this._callBack();
            this.dispose();
        });
    }

    //销毁
    dispose() {
        //this.removeEvent();
        this.node.destroy();
    }

    /**更新朋友列表 */
    onMsgNumList(friendDatas: FriendUnitInfo[]) {
        this._friendDataList = friendDatas;
        if (this._selectFriend) {
            ServiceMgr.friendService.friendMsgList(this._selectFriend.FriendId);
        } else {
            if (friendDatas.length > 0) {
                this._selectFriend = friendDatas[0];
                ServiceMgr.friendService.friendMsgList(this._selectFriend.FriendId);
            }
        }

        this.friendList.content.removeAllChildren();
        for (let i = 0; i < friendDatas.length; i++) {
            let friendData: FriendUnitInfo = friendDatas[i];
            this.addFriendListItem(friendData);
        }
        this.friendList.scrollToTop();
    }

    addFriendListItem(friendData: FriendUnitInfo) {
        let friendUnit: Node = instantiate(this.preFriendItem);
        friendUnit.getComponent(ChatListItem).initData(friendData, this._selectFriend);
        this.friendList.content.addChild(friendUnit);
    }

    /** 设置所有的好友列表背景为未选中  */
    setAllFriendListUnSelect() {
        let ndFriendItem: Node = null;
        for (let i = 0; i < this.friendList.content.children.length; i++) {
            ndFriendItem = this.friendList.content.children[i];
            ndFriendItem.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[1];
        }
    }

    onFriendItemClck(data: FriendItemClickInfo) {
        if (!this._canClick) return;
        if (!data) {
            return;
        }
        if (!data.info || !data.node) {
            return;
        }
        this.setAllFriendListUnSelect();
        this._selectFriend = data.info;
        data.node.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[0];
        this._canClick = false;
        ServiceMgr.friendService.friendMsgList(this._selectFriend.FriendId);
    }

    /**收到好友发来的消息 */
    onMsgList(data: FriendChatNetResponse) {
        this._canClick = true;
        let list = data.Data;
        let currentTime = 0;
        for (let i = 0; i < list.length; i++) {
            let time = new Date(list[i].CreateTime).getTime();
            if (time - currentTime > 5 * 1000 * 60) {
                list[i].isShow = true;
                currentTime = time;
            }
        }
        this.talkList.content.removeAllChildren();
        for (let i = 0; i < list.length; i++) {
            let talkData: FriendChatInfo = list[i];
            this.addTalkItem(talkData);
        }
        this.talkList.scrollToBottom();
    }

    addTalkItem(talkData: FriendChatInfo) {
        let ndTalkItem: Node = instantiate(this.preTalkItem);
        this.talkList.content.addChild(ndTalkItem);
        ndTalkItem.getComponent(ChatContentItem).initData(talkData, this._selectFriend);
    }

    //点击发送表情
    async onBqBtnClick() {
        if (this._showBq) {
            this.bqSelectBox.active = !this.bqSelectBox.active;
        }
        else {
            await this.setSelectList(this._bqList);
            this.bqSelectBox.active = true;
            this._showBq = true;
        }
    }

    onBqItemSelect(bqId: number) {
        ServiceMgr.friendService.friendMsgSend(this._selectFriend.FriendId, bqId);
    }

    /**发送给好友消息 */
    onMsgSend(data) {
        ServiceMgr.friendService.friendMsgList(this._selectFriend.FriendId);
        this.bqSelectBox.active = false;
    }

    /**收到好友一个消息 */
    onRecMsg(data) {
        if (!this._selectFriend) return;
        ServiceMgr.friendService.friendMsgList(this._selectFriend.FriendId);
        ServiceMgr.friendService.friendList();
    }

    async onSendBtnClick() {
        if (!this._showBq)
            this.bqSelectBox.active = !this.bqSelectBox.active;
        else {
            //this.clearBqItem();
            await this.setSelectList(this._wordBqList);
            this.bqSelectBox.active = true;
            this._showBq = false
        }
    }

    onHideSelect() {
        this.bqSelectBox.active = false;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


