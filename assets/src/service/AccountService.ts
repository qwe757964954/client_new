import { c2sAccountInit } from "../models/NetModel";
import { User } from "../models/User";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import EventManager from "../util/EventManager";

//用户信息服务
export default class AccountService {
    constructor() {
        this.addServerEvent();
    }

    addServerEvent() {
        EventManager.on(InterfacePath.Account_Init, this.onAccountInit.bind(this));
    }

    //账号初始化
    accountInit() {
        let para: c2sAccountInit = new c2sAccountInit();
        para.MemberToken = User.memberToken;
        NetMgr.sendMsg(para);
    }
    onAccountInit(data: any) {
        console.log("AccountService onAccountInit", data);
    }
}