import { _decorator } from 'cc';
import { ApplyModifyModel, c2sUserDelFriendMessage, c2sUserFriendAdd, c2sUserFriendApplyList, c2sUserFriendApplyModify, c2sUserFriendList, c2sUserFriendMessageList, c2sUserFriendSearch, c2sUserMessageStatusUpdate, c2sUserSendMessageFriend, c2sUserSystemAwardGet, c2sUserSystemMailDetail, c2sUserSystemMailList, SendMessageModel } from '../models/FriendModel';
import { InterfacePath } from '../net/InterfacePath';
import { NetMgr } from '../net/NetManager';
import { NetNotify } from '../net/NetNotify';
import { BaseControll } from '../script/BaseControll';
const { ccclass, property } = _decorator;

export class _FriendService extends BaseControll {
    private static _instance: _FriendService = null;
    public static get instance(): _FriendService {
        if (this._instance == null) {
            this._instance = new _FriendService("_FriendService");
        }
        return this._instance;
    }
    constructor(name: string) {
        super(name);
    }
    onInitModuleEvent() {
        this.addModelListeners([
            [InterfacePath.Classification_UserFriendList, this.onUserFriendList],
            [InterfacePath.Classification_UserFriendAdd, this.onUserFriendAdd],
            [InterfacePath.Classification_UserFriendSearch, this.onUserFriendSearch],
            [InterfacePath.Classification_UserFriendApplyList, this.onUserFriendApplyList],
            [InterfacePath.Classification_UserFriendApplyModify, this.onUserFriendApplyModify],

            [InterfacePath.Classification_UserDelFriendMessage, this.onUserDelFriendMessage],
            [InterfacePath.Classification_UserFriendMessageList, this.onUserFriendMessageList],
            [InterfacePath.Classification_UserSendMessageFriend, this.onUserSendMessageFriend],

            [InterfacePath.Classification_UserMessageStatusUpdate, this.onUserMessageStatusUpdate],
            [InterfacePath.Classification_UserSystemMailList, this.onUserSystemMailList],
            [InterfacePath.Classification_UserSystemMailDetail, this.onUserSystemMailDetail],
            

            [InterfacePath.Classification_UserSystemAwardGet, this.onUserSystemAwardGet],
        ]);
    }

    

    reqUserFriendList(){
        let param: c2sUserFriendList = new c2sUserFriendList();
        NetMgr.sendMsg(param);
    }

    reqUserFriendApplyList(){
        let param: c2sUserFriendApplyList = new c2sUserFriendApplyList();
        NetMgr.sendMsg(param);
    }

    reqUserFriendAdd(friend_id:number){
        let param: c2sUserFriendAdd = new c2sUserFriendAdd();
        param.friend_id = friend_id;
        NetMgr.sendMsg(param);
    }
    reqUserFriendSearch(search_id:string){
        let param: c2sUserFriendSearch = new c2sUserFriendSearch();
        param.search_id = search_id;
        NetMgr.sendMsg(param);
    }

    reqUserFriendApplyModify(data:ApplyModifyModel){
        let param: c2sUserFriendApplyModify = new c2sUserFriendApplyModify();
        param.friend_id = data.friend_id;
        param.status = data.status;
        NetMgr.sendMsg(param);
    }

    reqUserDelFriendMessage(friend_id:number){
        let param: c2sUserDelFriendMessage = new c2sUserDelFriendMessage();
        param.friend_id = friend_id;
        NetMgr.sendMsg(param);
    }

    reqUserFriendMessageList (friend_id:number){
        let param: c2sUserFriendMessageList = new c2sUserFriendMessageList();
        param.friend_id = friend_id;
        NetMgr.sendMsg(param);
    }

    reqUserSendMessageFriend(data:SendMessageModel){
        let param: c2sUserSendMessageFriend = new c2sUserSendMessageFriend();
        param.friend_id = data.friend_id;
        param.message = data.message;
        NetMgr.sendMsg(param);
    }   

    reqUserSystemMailLis(){
        let param: c2sUserSystemMailList = new c2sUserSystemMailList();
        NetMgr.sendMsg(param);
    }

    reqUserMessageStatusUpdate(friend_id:number){
        let param: c2sUserMessageStatusUpdate = new c2sUserMessageStatusUpdate();
        param.friend_id = friend_id;
        NetMgr.sendMsg(param);
    }

    reqUserSystemMailDetail(sm_id:string){
        let param: c2sUserSystemMailDetail = new c2sUserSystemMailDetail();
        param.sm_id = sm_id;
        NetMgr.sendMsg(param);
        
    }

    reqUserSystemAwardGet(sm_id:string){
        let param:c2sUserSystemAwardGet = new c2sUserSystemAwardGet();
        param.sm_id = sm_id;
        NetMgr.sendMsg(param);
    }


    onUserSystemAwardGet(data:any){
        this.handleResponse(data, NetNotify.Classification_UserSystemAwardGet);
    }

    onUserSystemMailDetail(data:any){
        this.handleResponse(data, NetNotify.Classification_UserSystemMailDetail);
    }

    onUserSystemMailList(data:any){
        this.handleResponse(data, NetNotify.Classification_UserSystemMailList);
    }

    onUserMessageStatusUpdate(data:any){
        this.handleResponse(data, NetNotify.Classification_UserMessageStatusUpdate);
    }

    onUserSendMessageFriend(data: any){
        this.handleResponse(data, NetNotify.Classification_UserSendMessageFriend);
    }

    onUserFriendMessageList(data: any){
        this.handleResponse(data, NetNotify.Classification_UserFriendMessageList);
    }

    onUserDelFriendMessage(data: any){
        this.handleResponse(data, NetNotify.Classification_UserDelFriendMessage);
    }

    onUserFriendApplyModify(data: any){
        this.handleResponse(data, NetNotify.Classification_UserFriendApplyModify);
    }

    onUserFriendList(data: any){
        this.handleResponse(data, NetNotify.Classification_UserFriendList);
    }
    
    onUserFriendAdd(data: any){
        this.handleResponse(data, NetNotify.Classification_UserFriendAdd);
    }
    
    onUserFriendSearch(data: any){
        this.handleResponse(data, NetNotify.Classification_UserFriendSearch);
    }
    onUserFriendApplyList(data: any){
        this.handleResponse(data, NetNotify.Classification_UserFriendApplyList);
    }
}

export const FdServer = _FriendService.instance;
