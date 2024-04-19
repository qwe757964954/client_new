import { c2sAccountInit } from "../models/NetModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetManager } from "../net/NetManager";
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
    accountInit(memberToken: string) {
        let para: c2sAccountInit = new c2sAccountInit();
        para.MemberToken = memberToken;
        NetManager.instance().sendMsg(para);
    }
    onAccountInit(data: any) {
        console.log("AccountService onAccountInit", data);
    }
}