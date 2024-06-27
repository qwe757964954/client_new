import { InterfacePath } from "../net/InterfacePath";
import { BaseRepPacket } from "./NetModel";

//用户信息详情消息
export class c2sUserPlayerDetail{
    command_id: string = InterfacePath.Classification_UserPlayerDetail;
}

export interface UserPlayerDetail extends BaseRepPacket {
    user_id: number;
    avatar: string;
    enable: number;
    exp: number;
    expire_date: string;
    gender: number;
    level: number;
    nick_name: string;
    phone: string;
    role_id: number;
    user_name: string;
}

export interface UserPlayerModifyModel {
    role_id?: number;
    nick_name?: string;
}

export class s2cUserPlayerModify {
    command_id: string = InterfacePath.Classification_UserPlayerModify;
    role_id?:number;
    nick_name?:string;
}
export interface UserPasswordModifyModel {
    confirm_passwd: string;
    new_passwd: string;
}

export class s2cUserPasswordModify {
    command_id: string = InterfacePath.Classification_UserPasswordModify;
    confirm_passwd:string;
    new_passwd:string;
}