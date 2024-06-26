import { _decorator, instantiate, Label, Layers, Node, Prefab, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType, PrefabTypeEntry } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ViewsManager } from '../../manager/ViewsManager';
import { DataFriendApplyListResponse, DataFriendListResponse, EmailDataInfo, EmailItemClickInfo, FriendItemClickInfo, FriendResponseData, FriendUnitInfo, NetSearchFriendInfo, UserFriendData } from '../../models/FriendModel';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { NetNotify } from '../../net/NetNotify';
import { BasePopup } from '../../script/BasePopup';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { NodeUtil } from '../../util/NodeUtil';
import { FriendAddView } from './FriendAddView';
import { FriendEmailView } from './FriendEmailView';
import { FriendTabType } from './FriendInfo';
import { FriendLeftTabView } from './FriendLeftTabView';
import { FriendListView } from './FriendListView';
import { FriendListItem } from './FriendlListItem';
import { FriendMessageView } from './FriendMessageView';
import { FriendPlayerInfoView } from './FriendPlayerInfoView';
import { FriendTalkDialogView } from './FriendTalkDialogView';
const { ccclass, property } = _decorator;

@ccclass('FriendsDialogView')
export class FriendsDialogView extends BasePopup {
    @property({ type: Node, tooltip: "关闭按钮" })
    public closeBtn: Node = null;

    @property({ type: Node, tooltip: "所有内容根结点" })
    public contentNd: Node = null;

    @property({ type: Label, tooltip: "标题" }) // 
    public titleTxt: Label = null;
    /*
    @property({ type: Node, tooltip: "好友详情结点" })
    public infoBox: Node = null;
    
    @property({ type: Node, tooltip: "好友列表结点" })
    public listBox: Node = null;

    @property({ type: Node, tooltip: "添加好友结点" })
    public addBox: Node = null;

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

    @property({ type: ScrollView, tooltip: "加好友消息滚动列表" })
    public msgList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "邮件滚动列表" })
    public emailList: ScrollView = null;
    */

    @property({ type: Prefab, tooltip: "邮件列表中的奖励预制体" })
    public preRewardItem: Prefab = null;//
    /*
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
    */
    @property({ type: Prefab, tooltip: "角色动画预制体" })
    public roleModel: Prefab = null;//角色动画

    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;

    @property(Node)
    public innerNode: Node = null;

    static INFOBOX_X_SHOW: number = 673; //infoBox伸展出来的X位置
    static INFOBOX_X_HIDE: number = 358; //infoBox隐藏时的X位置

    private _isClose: boolean = false; //是否正在关闭中
    private _isShowInfo: boolean = false; //当前是否在显示个人信息栏infoBox
    private _searchResult = null;
    private _allApplyBtnList: Node[] = [];
    private _allIngoreBtnList: Node[] = []; //emailItemList
    private _friendItemList: Node[] = [];
    private _emailItemList: Node[] = [];
    private _selectFriend: FriendUnitInfo = null;
    private _selectItem: Node = null; //朋友列表中选中的那一项
    private _talkDialog = null;
    private _inHouse: boolean = false;
    private _selectMsg: EmailDataInfo = null; //新选中的邮件
    private _selectMsgItem: Node = null;

    private _addBtnList: Node[] = null;
    private _role: Node = null; //朋友角色的骨骼动画结点
    private _canClose: boolean = false;

    private _leftTab:FriendLeftTabView = null;
    private _rightPlayerInfo:FriendPlayerInfoView = null;
    private _fListView:FriendListView = null;
    private _fAddView:FriendAddView = null;
    private _fMsgView:FriendMessageView = null;
    private _fEmailView:FriendEmailView = null;
    async initUI() {
        this.enableClickBlankToClose([this.node.getChildByName("content")]).then(()=>{
        });

        /*
        this._isClose = false;
        this._isShowInfo = false;
        this._canClose = false;
        this._searchResult = null;
        this._allApplyBtnList = [];
        this._allIngoreBtnList = [];
        this._friendItemList = [];
        this._emailItemList = [];
        this._selectFriend = null;
        this._talkDialog = null;
        this._selectMsg = null;
        this._inHouse = false;//inHouse;
        this._selectMsg = null;
        this._selectMsgItem = null;
        this._selectItem = null;
        this._addBtnList = [];

        let posInfoBox: Vec3 = this.infoBox.getPosition();
        this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0));
        */
        //this.listBox.active = true;
        await this.initViews();
        this.initData();
        this.node.getChildByName("content").setSiblingIndex(99);
        this.setLeftTab();
    }

    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.FriendLeftTabView, (node) => this._leftTab = node.getComponent(FriendLeftTabView), {
                isAlignTop: true,
                isAlignLeft: true,
                top: 229,
                left: 37
            }),
            this.initViewComponent(PrefabType.FriendPlayerInfoView, (node) => this._rightPlayerInfo = node.getComponent(FriendPlayerInfoView), {
                isAlignVerticalCenter: true,
                isAlignRight: true,
                verticalCenter: 0,
                right: 0
            }),
            this.initViewComponent(PrefabType.FriendListView, (node) => this._fListView = node.getComponent(FriendListView), {
                isAlignLeft: true,
                isAlignRight: true,
                isAlignBottom: true,
                isAlignTop: true,
                left: 43.8995,
                right: 43.8995,
                bottom: 20.0795,
                top: 20.0795
            },this.innerNode),
            this.initViewComponent(PrefabType.FriendAddView, (node) => this._fAddView = node.getComponent(FriendAddView), {
                isAlignLeft: true,
                isAlignRight: true,
                isAlignBottom: true,
                isAlignTop: true,
                left: 43.8995,
                right: 43.8995,
                bottom: 20.0795,
                top: 20.0795
            },this.innerNode),
            this.initViewComponent(PrefabType.FriendMessageView, (node) => this._fMsgView = node.getComponent(FriendMessageView), {
                isAlignLeft: true,
                isAlignRight: true,
                isAlignBottom: true,
                isAlignTop: true,
                left: 43.8995,
                right: 43.8995,
                bottom: 20.0795,
                top: 20.0795
            },this.innerNode),
            this.initViewComponent(PrefabType.FriendEmailView, (node) => this._fEmailView = node.getComponent(FriendEmailView), {
                isAlignLeft: true,
                isAlignRight: true,
                isAlignBottom: true,
                isAlignTop: true,
                left: 43.8995,
                right: 43.8995,
                bottom: 20.0795,
                top: 20.0795
            },this.innerNode),
        ]);
        // this.node.getComponent(Widget).top
    }

    private setLeftTab(){
        this._leftTab.setTabClickListener(this.onClickTab.bind(this));
        this._leftTab.updateTabList();
    }

    private async initViewComponent(prefabType: PrefabTypeEntry, onComponentInit: (node: Node) => void, alignOptions?: object,defaultParent:Node = this.node) {
        let node = await this.loadAndInitPrefab(prefabType, defaultParent, alignOptions);
        onComponentInit(node);
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
        // EventManager.emit(EventType.Friend_MyList, friendDatas);

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

    hidenAllFriendView(){
        this._fListView.node.active = false;
        this._fAddView.node.active = false;
        this._fMsgView.node.active = false;
        this._fEmailView.node.active = false;
    }

    onClickTab(click:FriendTabType) {
        this.hidenAllFriendView();
        switch (click) {
            case FriendTabType.List:// 好友列表
                this.titleTxt.string = TextConfig.Friend_List; //"好友列表";
                this._fListView.node.active = true;
                this._rightPlayerInfo.node.active = true;
                // this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, this.infoBox.position.y, 0)); //490
                // this.listBox.active = true;
                // this.addBox.active = false;
                // this.msgBox.active = false;
                // this.infoBox.active = true;
                // this.roleInfoBox.active = true;
                // this.msgInfoBox.active = false;
                // this.emailBox.active = false;
                //PbServiceManager.friendService.friendList(); //请求朋友列表
                //this.reqFriendList();
                // ServiceMgr.friendService.friendList();
                FdServer.reqUserFriendList();
                break;
            case FriendTabType.Add: //添加好友
                this.titleTxt.string = TextConfig.Friend_Add; //"添加好友";
                this._fAddView.node.active = true;
                this._rightPlayerInfo.node.active = false;
                // this.resultBox.active = false;
                /* 
                //请求推荐好友列表
                PbServiceManager.friendService.RecommendList((data) => {
                    if (this._isClose) return;
                    this.showRecommendList(data);
                })
                */
                //this.reqRecommendList();
                // ServiceMgr.friendService.recommendList();
                break;
            case FriendTabType.Apply: //好友申请列表
                this.titleTxt.string = TextConfig.Friend_Apply; //"好友申请";
                this._fMsgView.node.active = true;
                this._rightPlayerInfo.node.active = false;
                break;
            case FriendTabType.Message: // 好友消息通知
                this.titleTxt.string = TextConfig.Friend_Notify; // "好友通知";
                this._fEmailView.node.active = true;
                this._rightPlayerInfo.node.active = false;
                // let posInfoBox: Vec3 = this.infoBox.getPosition();
                // this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0)); //490
                // this.infoBox.active = true;
                // this.roleInfoBox.active = false;
                // this.msgInfoBox.active = true;
                //this.emailList.node.active = false;
                // ServiceMgr.friendService.sysMsgList(); //请求好友消息列表
                break;
        }
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [NetNotify.Classification_UserFriendList, this.onUpdateFriendList],
            [NetNotify.Classification_UserFriendApplyList, this.onUpdateApplyFriendList],
            [NetNotify.Classification_UserFriendSearch, this.onSearchFriendResult],
        ]);
        // this.addModelListener(NetNotify.Classification_UserFriendList, this.onUpdateFriendList);
        // this.addModelListener(EventType.Friend_RecommendList, this.onShowRecommendList);
        // this.addModelListener(EventType.Friend_ApplyList, this.onUpdateApplyFriendList);
        // this.addModelListener(EventType.Friend_ClickFriendList, this.onFriendItemClck);
        // this.addModelListener(EventType.Friend_SearchFriend, this.onSearchFriendResult);
        // this.addModelListener(EventType.Friend_AddFriend, this.onApplyFriendTo);
        // this.addModelListener(EventType.Friend_ApplyStatus, this.onApplyFriendStatus);
        // this.addModelListener(EventType.Friend_SysMsg_List, this.onSysMsgList);
        // this.addModelListener(EventType.Friend_ClickEmailList, this.onEmailClck);
        // this.addModelListener(EventType.Friend_RecvAward, this.onReciveAward);
        // this.addModelListener(EventType.Friend_DelFriend, this.onDeleteFriend);
    }

    initEvent() {
        CCUtil.onBtnClick(this.closeBtn, this.onCloseView.bind(this));
        // CCUtil.onBtnClick(this.backBtn, this.onHideFriendInfo.bind(this));
        // CCUtil.onBtnClick(this.searchBtn, this.onSearch.bind(this));
        // CCUtil.onBtnClick(this.addBtn, this.onAddFriend.bind(this));
        // CCUtil.onBtnClick(this.deleteBtn, this.onDeleteFriendClick.bind(this));
        // CCUtil.onBtnClick(this.houseBtn, this.onHouseClick.bind(this));
        // CCUtil.onBtnClick(this.talkBtn, this.onTalkClick.bind(this));
        // CCUtil.onBtnClick(this.reciveBtn, this.onReciveAwardClick.bind(this));

    }

    removeEvent() {

    }

    initData() {
        FdServer.reqUserFriendList();
        FdServer.reqUserFriendApplyList();
        // ServiceMgr.friendService.friendList();
        // ServiceMgr.friendService.friendApplyList();
        // ServiceMgr.friendService.sysMsgList();
    }
    /**更新朋友列表 */
    onUpdateFriendList(friendDatas: DataFriendListResponse) {
        console.log("onUpdateFriendList");
        this._fListView.updateData(friendDatas.data);
    }

    /**更新推荐朋友列表 */
    onShowRecommendList(friendDatas: FriendUnitInfo[]) {
        this._fAddView.updateData(friendDatas);
    }

    /**更新申请好友列表 */
    onUpdateApplyFriendList(response: DataFriendApplyListResponse) {
        console.log("onUpdateApplyFriendList",response);
        this._fMsgView.updateData(response.data);
    }

    /** 设置所有的好友列表背景为未选中  */
    setAllFriendListUnSelect() {
        let ndFriendItem: Node = null;
        let scriptFriendItem: FriendListItem = null;
        // for (let i = 0; i < this.friendList.content.children.length; i++) {
        //     ndFriendItem = this.friendList.content.children[i];
        //     ndFriendItem.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[1];
        // }
    }

    /**点击朋友列表中的一项 */
    onFriendItemClck(data: FriendItemClickInfo) {
        // if (!data) {
        //     return;
        // }
        // if (!data.info || !data.node) {
        //     return;
        // }
        // if (this._selectItem == data.node) {
        //     return;
        // }
        // this.roleInfoBox.active = true;
        // this.msgInfoBox.active = false;

        // /*if (this._selectItem) { //原来的选中项设为非选中状态
        //     this._selectItem.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[1];
        // }*/
        // this.setAllFriendListUnSelect();
        // let dataFriend: FriendUnitInfo = data.info;
        // let dataNode: Node = data.node;
        // this.fname.string = dataFriend.RealName;
        // this.fstate.string = dataFriend.Ltmsg;
        // this._selectFriend = dataFriend;
        // this._selectItem = dataNode;
        // //选中项背景设为高亮
        // this._selectItem.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[0];

        // //显示角色动画
        // this.showRoleDress(this._selectFriend);

        // //角色的详细信息面板伸出来
        // Tween.stopAllByTarget(this.infoBox);
        // this.roleInfoBox.active = true;
        // this.msgInfoBox.active = false;
        // let posInfoBox: Vec3 = this.infoBox.getPosition();
        // this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0));
        // tween(this.infoBox)
        //     .to(0.4, { position: v3(FriendsDialogView.INFOBOX_X_SHOW, posInfoBox.y, 0) })
        //     .call(() => {
        //         this._isShowInfo = true;
        //     })
        //     .start();
    }



    /**显示角色的骨骼动画 */
    private showRoleDress(friendInfo: FriendUnitInfo) {
        this.roleContainer.removeAllChildren();
        this._role = null;
        this._role = instantiate(this.roleModel);
        this._role.setScale(v3(1.5, 1.5, 1));
        this.roleContainer.addChild(this._role);
        NodeUtil.setLayerRecursively(this._role, Layers.Enum.UI_2D);
        let roleModel = this._role.getComponent(RoleBaseModel);
        let modelId: number = Number(friendInfo.ModelId);
        roleModel.init(modelId, 1, [9500, 9700, 9701, 9702, 9703]);
        roleModel.show(true);
    }

    onCloseView() {
        //ViewsManager.instance.closeView(PrefabType.FriendsDialogView);
        // if (!this._canClose) return;
        this._canClose = false;
        this.closePop();
    }

    /**隐藏个人信息栏 */
    onHideFriendInfo() {
        // if (this._isShowInfo === false) {
        //     return;
        // }
        // //角色的详细信息面板伸出来
        // Tween.stopAllByTarget(this.infoBox);
        // this.roleInfoBox.active = true;
        // this.msgInfoBox.active = false;
        // let posInfoBox: Vec3 = this.infoBox.getPosition();
        // //this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0));
        // tween(this.infoBox)
        //     .to(0.4, { position: v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0) })
        //     .call(() => {
        //         this._isShowInfo = false;
        //     })
        //     .start();
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
        // this.resultBox.active = false;
        // let userId: string = this.searchEdt.string.trim();
        // if (!userId || userId == "") {
        //     ViewsManager.instance.showTip(TextConfig.Friend_InputEmptyTip);
        //     return;
        // }

        // this.reqSearchFriend(userId);
    }

    /**添加好友 */
    onAddFriend() {
        // let userId: number = Number(this.searchEdt.string);
        // if (userId == User.roleID) {
        //     //Tool.tip("不能添加自己");
        //     ViewsManager.instance.showTip(TextConfig.Friend_CannotAddSelfTip);
        //     return;
        // }

        // //this.reqAddFriend(userId);
        // ServiceMgr.friendService.applyFriendTo(userId);
    }

    async onSearchFriendResult(response: UserFriendData) {
        this._fAddView.updateSearchData(response);
        // else {
        //     let data: FriendUnitInfo = res.UserInfo;
        //     let headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 }
        //     let avatar: number = headIdMap[data.ModelId];
        //     let avatarPath: string = "friend/head_" + avatar + "/spriteFrame";
        //     await LoadManager.loadSprite(avatarPath, this.imgResultHead.getComponent(Sprite)).then(() => { },
        //         (error) => {
        //             // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
        //         });
        //     this.lblRealNameResult.string = data.RealName;
        //     //this.lblState.string = data.Ltmsg;
        //     this.lblIDResult.string = "" + data.FriendId;
        //     // this.resultBox.active = true;
        // }
    }

    onApplyFriendTo(res: FriendResponseData) {
        // ViewsManager.instance.showTip(res.Msg);
    }

    onHouseClick() {
        ViewsManager.instance.showTip(TextConfig.Function_Tip2);
    }

    onDeleteFriendClick() {
        if (this._selectFriend != null) {
            // ServiceMgr.friendService.friendDel(this._selectFriend.FriendId);
        }
    }

    onTalkClick() {
        //ViewsManager.instance.showTip("和别人聊天");
        let ndFriendItem: Node = null;
        let scriptFriendItem: FriendListItem = null;
        let dataFriend: FriendUnitInfo = null;
        // for (let i = 0; i < this.friendList.content.children.length; i++) {
        //     ndFriendItem = this.friendList.content.children[i];
        //     scriptFriendItem = ndFriendItem.getComponent(FriendListItem);
        //     dataFriend = scriptFriendItem._data;
        //     if (dataFriend.FriendId == this._selectFriend.FriendId) {
        //         ndFriendItem.getChildByName("newMsgBox").active = false;
        //         break;
        //     }
        // }
        ViewsManager.instance.showView(PrefabType.FriendTalkDialogView, (node: Node) => {
            node.getComponent(FriendTalkDialogView).init(this._selectFriend);
        });
    }

    /**点击收取奖励 */
    onReciveAwardClick() {
        if (!this._selectMsg) return;
        if (this._selectMsg.RecFlag != 0) return; //未领过的才能领取
        // ServiceMgr.friendService.sysMsgRecAwards(this._selectMsg.Id);
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
            // ServiceMgr.friendService.friendList();
            // ServiceMgr.friendService.friendApplyList();
        }, 1);
    }

    //收到邮件列表事件
    onSysMsgList(emailDatas: EmailDataInfo[]) {
        this._fEmailView.updateData(emailDatas);
    }

    /**点击邮件列表项 */
    onEmailClck(data: EmailItemClickInfo) {
        // if (!data) {
        //     return;
        // }
        // if (!data.info || !data.node) {
        //     return;
        // }
        // if (this._selectMsgItem == data.node) {
        //     return;
        // }

        // if (this._selectMsgItem) { //原来的选中项设为非选中状态
        //     this._selectMsgItem.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[1];
        // }
        // let dataEmail: EmailDataInfo = data.info;
        // let dataNode: Node = data.node;
        // this.fromTxt.string = dataEmail.FromName;
        // this.msgTxt.string = dataEmail.Content;
        // this.timeTxt.string = dataEmail.createtime;
        // //处理奖品
        // this.awardList.content.removeAllChildren();
        // let awardsData = JSON.parse(dataEmail.Awards);
        // if (awardsData && Array.isArray(awardsData)) {
        //     let awardInfo = null;
        //     let propData: ItemData = null;
        //     for (let i = 0; i < awardsData.length; i++) {
        //         awardInfo = awardsData[i];
        //         propData = new ItemData();
        //         propData.id = awardInfo.id;
        //         propData.num = awardInfo.num;
        //         let item = instantiate(this.preRewardItem);
        //         item.scale = v3(0.7, 0.7, 1);
        //         this.awardList.content.addChild(item);
        //         item.getComponent(RewardItem).init(propData);
        //     }
        // }
        // this.reciveBtn.getComponent(Sprite).grayscale = (dataEmail.RecFlag != 1);
        // if (dataEmail.RecFlag == 1) { //已经领取过了
        //     this.reciveBtn.getComponent(Sprite).grayscale = true;
        //     this.reciveTxt.string = "已领取";
        //     this.reciveBtn.getComponent(Button).enabled = false;
        //     //CCUtil.offTouch(this.reciveBtn, this.onReceiveAward, this);
        // } else {
        //     this.reciveBtn.getComponent(Sprite).grayscale = false;
        //     this.reciveTxt.string = "领取";
        //     this.reciveBtn.getComponent(Button).enabled = true;
        // }

        // this._selectMsg = dataEmail;
        // this._selectMsgItem = dataNode;
        // //选中项背景设为高亮
        // this._selectMsgItem.getChildByName("bgImg").getComponent(Sprite).spriteFrame = this.sprfriendItemBgAry[0];

        // //角色的详细信息面板伸出来
        // Tween.stopAllByTarget(this.infoBox);
        // this.roleInfoBox.active = false;
        // this.msgInfoBox.active = true;
        // let posInfoBox: Vec3 = this.infoBox.getPosition();
        // this.infoBox.setPosition(v3(FriendsDialogView.INFOBOX_X_HIDE, posInfoBox.y, 0));
        // tween(this.infoBox)
        //     .to(0.4, { position: v3(FriendsDialogView.INFOBOX_X_SHOW, posInfoBox.y, 0) })
        //     .call(() => {
        //         this._isShowInfo = true;
        //     })
        //     .start();

    }
}


