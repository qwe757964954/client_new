import GlobalConfig from "../GlobalConfig";
import { NetConfig } from "../config/NetConfig";
import { c2sAccountLogin, c2sCheckNotice, c2sMobileLogin, c2sReqSms, c2sSmsLogin, c2sTokenLogin, c2sWechatLogin } from "../models/NetModel";
import HttpUtil from "../util/HttpUtil";

// http管理类
export class HttpManager {
    // 公告检测
    static reqCheckNotice(successFunc:Function, failedFunc:Function){
        let para:c2sCheckNotice;
        para.channel_id = 0;
        para.client_version = GlobalConfig.APP_VERSION;
        HttpUtil.post(NetConfig.checkNotice, JSON.stringify(para)).then(
            (s:string)=>{
                let obj = JSON.parse(s);
                successFunc?.(obj);
            },
            ()=>{
                failedFunc?.();
            }
        );
    }
    // token登录
    static reqTokenLogin(token:string, successFunc:Function, failedFunc:Function){
        let para:c2sTokenLogin;
        para.LoginToken = token;
        HttpUtil.post(NetConfig.tokenLogin, JSON.stringify(para)).then(
            (s:string)=>{
                let obj = JSON.parse(s);
                successFunc?.(obj);
            },
            ()=>{
                failedFunc?.();
            }
        );
    }
    // moble登录
    static reqMobileLogin(mobile:string, unionid:string, successFunc:Function, failedFunc:Function){
        let para:c2sMobileLogin;
        para.Mobile = mobile;
        para.UnionId = unionid;
        HttpUtil.post(NetConfig.mobileLogin, JSON.stringify(para)).then(
            (s:string)=>{
                let obj = JSON.parse(s);
                successFunc?.(obj);
            },
            ()=>{
                failedFunc?.();
            }
        );
    }
    // 请求验证码
    static reqSms(mobile:string, successFunc:Function, failedFunc:Function){
        let para:c2sReqSms;
        para.Mobile = mobile;
        HttpUtil.post(NetConfig.reqSms, JSON.stringify(para)).then(
            (s:string)=>{
                let obj = JSON.parse(s);
                successFunc?.(obj);
            },
            ()=>{
                failedFunc?.();
            }
        );
    }
    // 短信登录
    static reqSmsLogin(mobile:string, randomcode:string, unionid:string, successFunc:Function, failedFunc:Function){
        let para:c2sSmsLogin;
        para.Mobile = mobile;
        para.RandomCode = randomcode;
        para.UnionId = unionid;
        HttpUtil.post(NetConfig.smsLogin, JSON.stringify(para)).then(
            (s:string)=>{
                let obj = JSON.parse(s);
                successFunc?.(obj);
            },
            ()=>{
                failedFunc?.();
            }
        );
    }
    // 微信登录
    static reqWechatLogin(code:string, successFunc:Function, failedFunc:Function){
        let para:c2sWechatLogin;
        para.Code = code;
        HttpUtil.post(NetConfig.wechatLogin, JSON.stringify(para)).then(
            (s:string)=>{
                let obj = JSON.parse(s);
                successFunc?.(obj);
            },
            ()=>{
                failedFunc?.();
            }
        );
    }
    // 账号密码登录
    static reqAccountLogin(accountname:string, loginpwd:string, systype:number, successFunc:Function, failedFunc:Function){
        let para:c2sAccountLogin;
        para.AccountName = accountname;
        para.LoginPwd = loginpwd;
        para.SysType = systype;
        HttpUtil.post(NetConfig.accountLogin, JSON.stringify(para)).then(
            (s:string)=>{
                let obj = JSON.parse(s);
                successFunc?.(obj);
            },
            ()=>{
                failedFunc?.();
            }
        );
    }
}