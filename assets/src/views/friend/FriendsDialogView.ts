import { _decorator, Button, Component, EditBox, EventTouch, instantiate, Label, Layers, Node, Prefab, ScrollView, Sprite, SpriteFrame, tween, Tween, v3, Vec3 } from 'cc';
import CCUtil from '../../util/CCUtil';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { TextConfig } from '../../config/TextConfig';
import { EmailDataInfo, EmailItemClickInfo, FriendItemClickInfo, FriendResponseData, FriendUnitInfo, NetSearchFriendInfo } from '../../models/FriendModel';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import { FriendListItem } from './FriendlListItem';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { NodeUtil } from '../../util/NodeUtil';
import { FriendSearchItem } from './FriendSearchItem';
import { LoadManager } from '../../manager/LoadManager';
import { DataMgr, PropData } from '../../manager/DataMgr';
import { User } from '../../models/User';
import { ServiceMgr } from '../../net/ServiceManager';
import { MsgListItem } from './MsgListItem';
import { EmailListItem } from './EmailListItem';
import { PropInfo } from '../../config/PropConfig';
import { RewardItem } from '../common/RewardItem';
import { ButtomSelectType } from '../setting/BottomItem';
const { ccclass, property } = _decorator;

@ccclass('FriendsDialogView')
export class FriendsDialogView extends Component {
    @property({ type: Node, tooltip: "关闭按钮" })
    public closeBtn: Node = null;

    @property({ type: Node, tooltip: "tab1切换按钮" })
    public tab1: Node = null;
    @property({ type: Node, tooltip: "tab2切换按钮" })
    public tab2: Node = null;
    @property({ type: Node, tooltip: "tab3切换按钮" }) // 
    public tab3: Node = null;
    @property({ type: Node, tooltip: "tab4切换按钮" })
    public tab4: Node = null;

    @property({ type: Label, tooltip: "标题" }) // 
    public titleTxt: Label = null;

    @property({ type: Node, tooltip: "好友详情结点" })
    public infoBox: Node = null;

    @property({ type: Node, tooltip: "好友列表结点" })
    public listBox: Node = null;

    @property({ type: Node, tooltip: "添加好友结点" })
    public addBox: Node = null;

    @property({ type: Node, tooltip: "查找好友结果结点" }) //imgHead
    public resultBox: Node = null;

    @property({ type: Sprite, tooltip: "查找好友结果头像" }) //
    public imgResultHead: Sprite = null;

    @property({ type: Label, tooltip: "查找好友结果名字" }) //
    public lblRealNameResult: Label = null;

    @property({ type: Label, tooltip: "查找好友结果id" }) //
    public lblIDResult: Label = null;

    @property({ type: Node, tooltip: "好友添加消息列表结点" }) //
    public msgBox: Node = null;

    @property({ type: Node, tooltip: "好友邮件列表结点" })
    public emailBox: Node = null;

    @property({ type: Node, tooltip: "好友角色详细信息结点" }) //
    public roleInfoBox: Node = null;

    @property({ type: Node, tooltip: "邮件详细信息结点" })
    public msgInfoBox: Node = null;

    @property({ type: Label, tooltip: "好友角色详细信息中角色名字" }) // 
    public fname: Label = null;

    @property({ type: Label, tooltip: "好友角色详细信息中角色在线离线状态" }) // 
    public fstate: Label = null;

    @property({ type: Label, tooltip: "邮件详细信息中发件人" }) //
    public fromTxt: Label = null;

    @property({ type: Label, tooltip: "邮件详细信息中邮件信息" }) //
    public msgTxt: Label = null;

    @property({ type: Label, tooltip: "邮件详细信息中邮件信息" }) // awardList
    public timeTxt: Label = null;

    @property({ type: ScrollView, tooltip: "邮件奖励列表" })
    public awardList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "好友滚动列表" })
    public friendList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "加好友消息滚动列表" })
    public msgList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "邮件滚动列表" })
    public emailList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "推荐好友滚动列表" })
    public recommendList: ScrollView = null;

    @property({ type: Prefab, tooltip: "好友列表中的一项预制体" })
    public preFriendListUnit: Prefab = null;//

    @property({ type: Prefab, tooltip: "查找推荐好友列表中的一项预制体" })
    public preSearchFriendUnit: Prefab = null;//

    @property({ type: Prefab, tooltip: "申请好友列表中的一项预制体" }) //
    public preApplyFriendUnit: Prefab = null;//

    @property({ type: Prefab, tooltip: "邮件列表中的一项预制体" })
    public preEmailListUnit: Prefab = null;//

    @property({ type: Prefab, tooltip: "邮件列表中的奖励预制体" })
    public preRewardItem: Prefab = null;//

    @property({ type: Node, tooltip: "查找好友按钮" })
    public searchBtn: Node = null;

    @property({ type: Node, tooltip: "添加好友按钮" })
    public addBtn: Node = null;

    @property({ type: EditBox, tooltip: "查找好友编辑框" })
    public searchEdt: EditBox = null;

    @property({ type: Node, tooltip: "隐藏好友详细信息面板按钮" }) // 
    public backBtn: Node = null;

    @property({ type: Node, tooltip: "和好友聊天按钮" })
    public talkBtn: Node = null;

    @property({ type: Node, tooltip: "删除好友按钮" })
    public deleteBtn: Node = null;

    @property({ type: Node, tooltip: "好友主页按钮" })
    public houseBtn: Node = null;

    @property({ type: Node, tooltip: "收到好友礼物按钮" }) //
    public reciveBtn: Node = null;

    @property({ type: Label, tooltip: "收到好友礼物按钮上的文本" }) //
    public reciveTxt: Label = null;

    @property({ type: Node, tooltip: "是否有新好友申请消息" }) //
    public newMsg: Node = null;

    @property({ type: Node, tooltip: "是否有新邮件" }) //
    public newSysMsg: Node = null;

    @property({ type: Prefab, tooltip: "角色动画预制体" })
    public roleModel: Prefab = null;//角色动画

    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;

    @property({ type: [SpriteFrame], tooltip: "tab页的图片数组" }) // 0:选中 1: 未选中
    public sprTabAry: SpriteFrame[] = [];

    @property({ type: [SpriteFrame], tooltip: "朋友列表里一项背景页的图片数组" }) // 0:选中 1: 未选中
    public sprfriendItemBgAry: SpriteFrame[] = [];

    static INFOBOX_X_SHOW: number = 673; //infoBox伸展出来的X位置
    static INFOBOX_X_HIDE: number = 358; //infoBox隐藏时的X位置

    private _isClose: boolean = false; //是否正在关闭中
    private _isShowInfo: boolean = false; //当前是否在显示个人信息栏infoBox
    private _searchResult = null;
    private _allApplyBtnList: Node[] = [];
    private _allIngoreBtnList: Node[] = []; //emailItemList
    private _friendItemList: Node[] = [];
    private _emailItemList: Node[] = [];
    private _currentTab: string = "1"; //当前tab页
    private _selectFriend: FriendUnitInfo = null;
    private _selectItem: Node = null; //朋友列表中选中的那一项
    private _talkDialog = null;
    private _inHouse: boolean = false;
    private _selectMsg: EmailDataInfo = null; //新选中的邮件
    private _selectMsgItem: Node = null;

    private _addBtnList: Node[] = null;
    private _role: Node = null; //朋友角色的骨骼动画结点

    private _friendDataList: FriendUnitInfo[] = []; //我的好友列表
    private _recommendFriendDataList: FriendUnitInfo[] = []; //我的推荐好友列表
    private _applyFriendDataList: FriendUnitInfo[] = []; //我的申请好友列表
    private _emailDataList: EmailDataInfo[] = [];  //邮件列表数据

    private _getMyFriendListEveId: string = ""; //获取我的好友列表  Friend_SearchFriend
    private _getRecommendFriendListEveId: string = ""; //获取我的好友列表
    private _getApplyFriendListEveId: string = ""; //获取申请好友列表
    private _clickMyFriendListEveId: string = ""; //点击我的好友列表中的一项
    private _searchFriendEveId: string = ""; //查找好友
    private _addFriendEveId: string = "";    //添加好友
    private _applyFriendStatusEveId: string = "";  //同意/拒绝好友申请事件
    private _getEmailListEveId: string = "";  //收到邮件列表事件
    private _clickEmailListEveId: string = ""; //点击我的邮件列表中的一项
    private _recvEmailAwardEveId: string = ""; //获取我的邮件奖励事件  
    private _delFriendEveId: string = ""; //点击我的邮件列表中的一项 Friend_DelFriend

    protected onLoad(): void {
        this._isClose = false;
        this._isShowInfo = false;
        this._searchResult = null;
        this._allApplyBtnList = [];
        this._allIngoreBtnList = [];
        this._friendItemList = [];
        this._emailItemList = [];
        this._currentTab = "1";
        this._selectFriend = null;
        this._talkDialog = null;
        this._selectMsg = null;
        this._inHouse = false;//inHouse;
        this._selectMsg = null;
        this._selectMsgItem = null;
        this._selectItem = null;
        this._addBtnList = [];

        this._friendDataList = [];
        this._recommendFriendDataList = [];
        this._applyFriendDataList = [];
        this._emailDataList = [];

        this.init();
    }

    init() {
        this.initUI();
        this.addEvent();
        this.initData();

    }

    initUI() {
        let posInfoBox: Vec3 = this.infoBox.getPosition();
        this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0));
        this.newMsg.active = false;
        this.newSysMsg.active = false;

        //this.listBox.active = true;

        this.onClickTab();
    }

    onTabClick(e: EventTouch) {
        let tabName = e.target.name;
        if (tabName == this._currentTab) return;
        this._currentTab = tabName;
        this.onClickTab();
    }

    //模拟网络向服务器请求好友列表
    reqFriendList() {
        let data: FriendUnitInfo = {
            FriendId: 101, //朋友ID
            ModelId: "101", //角色ID
            RealName: "小明", //角色名
            Ltmsg: "在线一分钟", //当前在线状态
            BigId: "1", //当前大地图ID
            SmallId: "1", // 当前小地图ID
            Ce: 60000, //角色战力
            UnReadNum: 2, //未读消息数量
            MedalSet: "10101,10104,10302,10502", //奖章列表
        };
        let data2: FriendUnitInfo = {
            FriendId: 102, //朋友ID
            ModelId: "102", //角色ID
            RealName: "小红", //角色名
            Ltmsg: "离线2小时", //当前在线状态
            BigId: "1", //当前大地图ID
            SmallId: "2", // 当前小地图ID
            Ce: 45000, //角色战力
            UnReadNum: 3, //未读消息数量
            MedalSet: "10407,10802,10902,10502", //奖章列表
        };
        let data3: FriendUnitInfo = {
            FriendId: 103, //朋友ID
            ModelId: "103", //角色ID
            RealName: "呆呆", //角色名
            Ltmsg: "在线5小时", //当前在线状态
            BigId: "1", //当前大地图ID
            SmallId: "3", // 当前小地图ID
            Ce: 90000, //角色战力
            UnReadNum: 5, //未读消息数量
            MedalSet: "10102,10202,10303,10406", //奖章列表
        }
        let friendDatas: FriendUnitInfo[] = [data, data2, data3];
        EventManager.emit(EventType.Friend_MyList, friendDatas);

    }

    //模拟网络向服务器请求推荐好友列表
    reqRecommendList() {
        let data: FriendUnitInfo = {
            FriendId: 1003, //朋友ID
            ModelId: "101", //角色ID
            RealName: "小白", //角色名
            Ltmsg: "在线三分钟", //当前在线状态
            BigId: "2", //当前大地图ID
            SmallId: "1", // 当前小地图ID
            Ce: 30000, //角色战力
            UnReadNum: 1, //未读消息数量
            MedalSet: "10102,10104,10303,10501", //奖章列表
        };
        let data2: FriendUnitInfo = {
            FriendId: 1002, //朋友ID
            ModelId: "102", //角色ID
            RealName: "小珊", //角色名
            Ltmsg: "离线一小时", //当前在线状态
            BigId: "1", //当前大地图ID
            SmallId: "2", // 当前小地图ID
            Ce: 45000, //角色战力
            UnReadNum: 3, //未读消息数量
            MedalSet: "10407,10802,10902,10502", //奖章列表
        };
        let data3: FriendUnitInfo = {
            FriendId: 103, //朋友ID
            ModelId: "103", //角色ID
            RealName: "郭亮", //角色名
            Ltmsg: "在线2小时", //当前在线状态
            BigId: "2", //当前大地图ID
            SmallId: "3", // 当前小地图ID
            Ce: 10000, //角色战力
            UnReadNum: 3, //未读消息数量
            MedalSet: "10102,10201,10302,10406", //奖章列表
        }
        let friendDatas: FriendUnitInfo[] = [data, data2, data3];
        EventManager.emit(EventType.Friend_RecommendList, friendDatas);
    }

    onClickTab() {
        let curTabIndex: number = +this._currentTab;
        for (let i = 1; i < 5; i++) {
            if (curTabIndex == i) { //选中
                this["tab" + i].getChildByName("bg").getComponent(Sprite).spriteFrame = this.sprTabAry[0];
            }
            else { //未选中
                this["tab" + i].getChildByName("bg").getComponent(Sprite).spriteFrame = this.sprTabAry[1];
            }
        }

        switch (curTabIndex) {
            case 1:// 好友列表
                this.titleTxt.string = TextConfig.Friend_List; //"好友列表";
                this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, this.infoBox.position.y, 0)); //490
                this.listBox.active = true;
                this.addBox.active = false;
                this.msgBox.active = false;
                this.infoBox.active = true;
                this.roleInfoBox.active = true;
                this.msgInfoBox.active = false;
                this.emailBox.active = false;
                //PbServiceManager.friendService.friendList(); //请求朋友列表
                //this.reqFriendList();
                ServiceMgr.friendService.friendList();
                break;
            case 2: //添加好友
                this.titleTxt.string = TextConfig.Friend_Add; //"添加好友";
                this.listBox.active = false;
                this.addBox.active = true;
                this.msgBox.active = false;
                this.resultBox.active = false;
                this.infoBox.active = false;
                this.emailBox.active = false;
                /* 
                //请求推荐好友列表
                PbServiceManager.friendService.RecommendList((data) => {
                    if (this._isClose) return;
                    this.showRecommendList(data);
                })
                */
                //this.reqRecommendList();
                ServiceMgr.friendService.recommendList();
                break;
            case 3: //好友申请列表
                this.titleTxt.string = TextConfig.Friend_Apply; //"好友申请";
                this.listBox.active = false;
                this.addBox.active = false;
                this.msgBox.active = true;
                this.infoBox.active = false;
                this.emailBox.active = false;
                break;
            case 4: // 好友消息通知
                this.titleTxt.string = TextConfig.Friend_Notify; // "好友通知";
                this.listBox.active = false;
                this.addBox.active = false;
                this.msgBox.active = false;
                this.emailBox.active = true;
                let posInfoBox: Vec3 = this.infoBox.getPosition();
                this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0)); //490
                this.infoBox.active = true;
                this.roleInfoBox.active = false;
                this.msgInfoBox.active = true;
                //this.emailList.node.active = false;
                // PbServiceManager.friendService.sysMsgList(); //请求好友消息列表
                break;
        }
    }

    addEvent() {
        CCUtil.onTouch(this.closeBtn, this.onCloseView, this);
        for (let i = 1; i <= 4; i++) {
            CCUtil.onTouch(this["tab" + i], this.onTabClick, this);
        }
        CCUtil.onTouch(this.backBtn, this.onHideFriendInfo, this); //addBtn
        CCUtil.onTouch(this.searchBtn, this.onSearch, this);  //
        CCUtil.onTouch(this.addBtn, this.onAddFriend, this); //添加好友  
        CCUtil.onTouch(this.deleteBtn, this.onDeleteFriendClick, this); //删除好友  talkBtn
        CCUtil.onTouch(this.houseBtn, this.onHouseClick, this); //点击别人主页
        CCUtil.onTouch(this.talkBtn, this.onTalkClick, this); //和别人聊天
        CCUtil.onTouch(this.reciveBtn, this.onReciveAwardClick, this); //收取奖励

        this._getMyFriendListEveId = EventManager.on(EventType.Friend_MyList, this.onUpdateFriendList.bind(this));
        this._getRecommendFriendListEveId = EventManager.on(EventType.Friend_RecommendList, this.onShowRecommendList.bind(this));
        this._getApplyFriendListEveId = EventManager.on(EventType.Friend_ApplyList, this.onUpdateApplyFriendList.bind(this));
        this._clickMyFriendListEveId = EventManager.on(EventType.Friend_ClickFriendList, this.onFriendItemClck.bind(this));
        this._searchFriendEveId = EventManager.on(EventType.Friend_SearchFriend, this.onSearchFriendResult.bind(this));
        this._addFriendEveId = EventManager.on(EventType.Friend_AddFriend, this.onApplyFriendTo.bind(this));
        this._applyFriendStatusEveId = EventManager.on(EventType.Friend_ApplyStatus, this.onApplyFriendStatus.bind(this));
        this._getEmailListEveId = EventManager.on(EventType.Friend_SysMsg_List, this.onSysMsgList.bind(this));
        this._clickEmailListEveId = EventManager.on(EventType.Friend_ClickEmailList, this.onEmailClck.bind(this));
        this._recvEmailAwardEveId = EventManager.on(EventType.Friend_RecvAward, this.onReciveAward.bind(this));
        this._delFriendEveId = EventManager.on(EventType.Friend_DelFriend, this.onDeleteFriend.bind(this));
    }

    removeEvent() {
        CCUtil.offTouch(this.closeBtn, this.onCloseView, this);
        for (let i = 1; i <= 4; i++) {
            CCUtil.offTouch(this["tab" + i], this.onTabClick, this);
        }
        CCUtil.offTouch(this.backBtn, this.onHideFriendInfo, this);
        CCUtil.offTouch(this.searchBtn, this.onSearch, this);
        CCUtil.offTouch(this.addBtn, this.onAddFriend, this); //添加好友
        CCUtil.offTouch(this.houseBtn, this.onHouseClick, this);
        CCUtil.offTouch(this.deleteBtn, this.onDeleteFriendClick, this); //删除好友
        CCUtil.offTouch(this.reciveBtn, this.onReciveAwardClick, this); //收取奖励
        CCUtil.offTouch(this.talkBtn, this.onTalkClick, this); //和别人聊天
        EventManager.off(EventType.Friend_MyList, this._getMyFriendListEveId);
        EventManager.off(EventType.Friend_RecommendList, this._getRecommendFriendListEveId);
        EventManager.off(EventType.Friend_ApplyList, this._getApplyFriendListEveId);
        EventManager.off(EventType.Friend_ClickFriendList, this._clickMyFriendListEveId);
        EventManager.off(EventType.Friend_SearchFriend, this._searchFriendEveId);
        EventManager.off(EventType.Friend_AddFriend, this._addFriendEveId);
        EventManager.off(EventType.Friend_ApplyStatus, this._applyFriendStatusEveId);
        EventManager.off(EventType.Friend_SysMsg_List, this._getEmailListEveId);
        EventManager.off(EventType.Friend_ClickEmailList, this._clickEmailListEveId);
        EventManager.off(EventType.Friend_RecvAward, this._recvEmailAwardEveId);
        EventManager.off(EventType.Friend_DelFriend, this._delFriendEveId);
    }

    initData() {
        ServiceMgr.friendService.friendList();
        ServiceMgr.friendService.friendApplyList();
        ServiceMgr.friendService.sysMsgList();
    }

    start() {

    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    /**更新朋友列表 */
    onUpdateFriendList(friendDatas: FriendUnitInfo[]) {
        this._friendDataList = friendDatas;
        this.friendList.content.removeAllChildren();
        for (let i = 0; i < friendDatas.length; i++) {
            let friendData: FriendUnitInfo = friendDatas[i];
            this.addFriendListItem(friendData);
        }
        this.friendList.scrollToTop();
    }

    addFriendListItem(friendData: FriendUnitInfo) {
        let friendUnit: Node = instantiate(this.preFriendListUnit);
        friendUnit.getComponent(FriendListItem).initData(friendData, this._selectFriend);
        this.friendList.content.addChild(friendUnit);
    }

    /**更新推荐朋友列表 */
    onShowRecommendList(friendDatas: FriendUnitInfo[]) {
        this._recommendFriendDataList = friendDatas;
        this.recommendList.content.removeAllChildren();
        for (let i = 0; i < friendDatas.length; i++) {
            let friendData: FriendUnitInfo = friendDatas[i];
            this.addRecommendFriendListItem(friendData);
        }
        this.recommendList.scrollToTop();
    }

    addRecommendFriendListItem(friendData: FriendUnitInfo) {
        let friendUnit: Node = instantiate(this.preSearchFriendUnit);
        friendUnit.getComponent(FriendSearchItem).initData(friendData);
        this.recommendList.content.addChild(friendUnit);
    }

    /**更新申请好友列表 */
    onUpdateApplyFriendList(friendDatas: FriendUnitInfo[]) {
        this._applyFriendDataList = friendDatas;
        this.msgList.content.removeAllChildren();
        if (friendDatas.length > 0) {
            this.newMsg.active = true;
        }
        for (let i = 0; i < friendDatas.length; i++) {
            let friendData: FriendUnitInfo = friendDatas[i];
            this.addApplyFriendListItem(friendData);
        }
        this.msgList.scrollToTop();
    }

    addApplyFriendListItem(friendData: FriendUnitInfo) {
        let friendUnit: Node = instantiate(this.preApplyFriendUnit);
        friendUnit.getComponent(MsgListItem).initData(friendData);
        this.msgList.content.addChild(friendUnit);
    }

    /**点击朋友列表中的一项 */
    onFriendItemClck(data: FriendItemClickInfo) {
        if (!data) {
            return;
        }
        if (!data.info || !data.node) {
            return;
        }
        if (this._selectItem == data.node) {
            return;
        }
        this.roleInfoBox.active = true;
        this.msgInfoBox.active = false;

        if (this._selectItem) { //原来的选中项设为非选中状态
            this._selectItem.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[1];
        }
        let dataFriend: FriendUnitInfo = data.info;
        let dataNode: Node = data.node;
        this.fname.string = dataFriend.RealName;
        this.fstate.string = dataFriend.Ltmsg;
        this._selectFriend = dataFriend;
        this._selectItem = dataNode;
        //选中项背景设为高亮
        this._selectItem.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[0];

        //显示角色动画
        this.showRoleDress(this._selectFriend);

        //角色的详细信息面板伸出来
        Tween.stopAllByTarget(this.infoBox);
        this.roleInfoBox.active = true;
        this.msgInfoBox.active = false;
        let posInfoBox: Vec3 = this.infoBox.getPosition();
        this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0));
        tween(this.infoBox)
            .to(0.4, { position: v3(FriendsDialogView.INFOBOX_X_SHOW, posInfoBox.y, 0) })
            .call(() => {
                this._isShowInfo = true;
            })
            .start();
    }



    /**显示角色的骨骼动画 */
    private showRoleDress(friendInfo: FriendUnitInfo) {
        this.roleContainer.removeAllChildren();
        this._role = null;
        this._role = instantiate(this.roleModel);
        this.roleContainer.addChild(this._role);
        NodeUtil.setLayerRecursively(this._role, Layers.Enum.UI_2D);
        let roleModel = this._role.getComponent(RoleBaseModel);
        let modelId: number = Number(friendInfo.ModelId);
        roleModel.init(modelId, 1, [9500, 9700, 9701, 9702, 9703]);
        roleModel.show(true);
    }

    onCloseView() {
        ViewsManager.instance.closeView(PrefabType.FriendsDialogView);
    }

    /**隐藏个人信息栏 */
    onHideFriendInfo() {
        if (this._isShowInfo === false) {
            return;
        }
        //角色的详细信息面板伸出来
        Tween.stopAllByTarget(this.infoBox);
        this.roleInfoBox.active = true;
        this.msgInfoBox.active = false;
        let posInfoBox: Vec3 = this.infoBox.getPosition();
        //this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0));
        tween(this.infoBox)
            .to(0.4, { position: v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0) })
            .call(() => {
                this._isShowInfo = false;
            })
            .start();
    }

    // 请求查找好友
    reqSearchFriend(userId: string) {
        let data: FriendUnitInfo = {
            FriendId: 1005, //朋友ID
            ModelId: "101", //角色ID
            RealName: "球球", //角色名
            Ltmsg: "在线10分钟", //当前在线状态
            BigId: "1", //当前大地图ID
            SmallId: "10", // 当前小地图ID
            Ce: 60000, //角色战力
            UnReadNum: 0, //未读消息数量
            MedalSet: "10101,10103,10302,10501", //奖章列表
        };
        let sockData: NetSearchFriendInfo = {
            Code: 200,
            UserInfo: data,
        }
        EventManager.emit(EventType.Friend_SearchFriend, sockData);
    }

    /**查找好友 */
    onSearch() {
        this.resultBox.active = false;
        let userId: string = this.searchEdt.string.trim();
        if (!userId || userId == "") {
            ViewsManager.instance.showTip(TextConfig.Friend_InputEmptyTip);
            return;
        }

        this.reqSearchFriend(userId);
    }

    /**添加好友 */
    onAddFriend() {
        let userId: number = Number(this.searchEdt.string);
        if (userId == User.roleID) {
            //Tool.tip("不能添加自己");
            ViewsManager.instance.showTip(TextConfig.Friend_CannotAddSelfTip);
            return;
        }

        //this.reqAddFriend(userId);
        ServiceMgr.friendService.applyFriendTo(userId);
    }

    async onSearchFriendResult(res: NetSearchFriendInfo) {
        if (!res.UserInfo || res.Code != 200) {
            ViewsManager.instance.showTip(TextConfig.Friend_NoFindUser);
            return;
        }
        else {
            let data: FriendUnitInfo = res.UserInfo;
            let headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 }
            let avatar: number = headIdMap[data.ModelId];
            let avatarPath: string = "friend/head_" + avatar + "/spriteFrame";
            await LoadManager.loadSprite(avatarPath, this.imgResultHead.getComponent(Sprite)).then(() => { },
                (error) => {
                    // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
                });
            this.lblRealNameResult.string = data.RealName;
            //this.lblState.string = data.Ltmsg;
            this.lblIDResult.string = "" + data.FriendId;
            this.resultBox.active = true;
        }
    }

    onApplyFriendTo(res: FriendResponseData) {
        ViewsManager.instance.showTip(res.Msg);
    }

    onHouseClick() {
        ViewsManager.instance.showTip(TextConfig.Function_Tip2);
    }

    onDeleteFriendClick() {
        if (this._selectFriend != null) {
            ServiceMgr.friendService.friendDel(this._selectFriend.FriendId);
        }
    }

    onTalkClick() {
        ViewsManager.instance.showTip("和别人聊天");
    }

    /**点击收取奖励 */
    onReciveAwardClick() {
        if (!this._selectMsg) return;
        if (this._selectMsg.RecFlag != 0) return; //未领过的才能领取
        ServiceMgr.friendService.sysMsgRecAwards(this._selectMsg.Id);
    }

    onReciveAward(res: FriendResponseData) {
        ViewsManager.instance.showTip(res.Msg);

    }

    onDeleteFriend(res: FriendResponseData) {
        ViewsManager.instance.showTip(res.Msg);
    }

    onApplyFriendStatus(res: FriendResponseData) {
        ViewsManager.instance.showTip(res.Msg);
        this.scheduleOnce(() => {
            ServiceMgr.friendService.friendList();
            ServiceMgr.friendService.friendApplyList();
        }, 1);
    }

    //收到邮件列表事件
    onSysMsgList(emailDatas: EmailDataInfo[]) {
        this._emailDataList = emailDatas;
        this.emailList.content.removeAllChildren();
        for (let i = 0; i < emailDatas.length; i++) {
            let emailData: EmailDataInfo = emailDatas[i];
            if (emailData.RecFlag == 0) {
                this.newSysMsg.active = true;
            }
            this.addEmailListItem(emailData);
        }
        this.emailList.scrollToTop();
    }

    addEmailListItem(emailData: EmailDataInfo) {
        let emailUnit: Node = instantiate(this.preEmailListUnit);
        emailUnit.getComponent(EmailListItem).initData(emailData, this._selectMsg);
        this.emailList.content.addChild(emailUnit);
    }

    /**点击邮件列表项 */
    onEmailClck(data: EmailItemClickInfo) {
        if (!data) {
            return;
        }
        if (!data.info || !data.node) {
            return;
        }
        if (this._selectMsgItem == data.node) {
            return;
        }

        if (this._selectMsgItem) { //原来的选中项设为非选中状态
            this._selectMsgItem.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[1];
        }
        let dataEmail: EmailDataInfo = data.info;
        let dataNode: Node = data.node;
        this.fromTxt.string = dataEmail.FromName;
        this.msgTxt.string = dataEmail.Content;
        this.timeTxt.string = dataEmail.createtime;
        //处理奖品
        this.awardList.content.removeAllChildren();
        let awardsData = JSON.parse(dataEmail.Awards);
        if (awardsData && Array.isArray(awardsData)) {
            let awardInfo = null;
            let propData: PropData = null;
            for (let i = 0; i < awardsData.length; i++) {
                awardInfo = awardsData[i];
                propData = new PropData();
                propData.id = awardInfo.id;
                propData.num = awardInfo.num;
                let item = instantiate(this.preRewardItem);
                item.scale = v3(0.7, 0.7, 1);
                this.awardList.content.addChild(item);
                item.getComponent(RewardItem).init(propData);
            }
        }
        this.reciveBtn.getComponent(Sprite).grayscale = (dataEmail.RecFlag != 1);
        if (dataEmail.RecFlag == 1) { //已经领取过了
            this.reciveBtn.getComponent(Sprite).grayscale = true;
            this.reciveTxt.string = "已领取";
            this.reciveBtn.getComponent(Button).enabled = false;
            //CCUtil.offTouch(this.reciveBtn, this.onReceiveAward, this);
        } else {
            this.reciveBtn.getComponent(Sprite).grayscale = false;
            this.reciveTxt.string = "领取";
            this.reciveBtn.getComponent(Button).enabled = true;
        }

        this._selectMsg = dataEmail;
        this._selectMsgItem = dataNode;
        //选中项背景设为高亮
        this._selectMsgItem.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[0];

        //角色的详细信息面板伸出来
        Tween.stopAllByTarget(this.infoBox);
        this.roleInfoBox.active = false;
        this.msgInfoBox.active = true;
        let posInfoBox: Vec3 = this.infoBox.getPosition();
        this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0));
        tween(this.infoBox)
            .to(0.4, { position: v3(FriendsDialogView.INFOBOX_X_SHOW, posInfoBox.y, 0) })
            .call(() => {
                this._isShowInfo = true;
            })
            .start();

    }

    update(deltaTime: number) {

    }
}


