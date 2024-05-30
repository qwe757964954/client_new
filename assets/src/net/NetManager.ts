import GlobalConfig from "../GlobalConfig";
import { EventType } from "../config/EventType";
import { NetConfig } from "../config/NetConfig";
import { TextConfig } from "../config/TextConfig";
import { ViewsMgr } from "../manager/ViewsManager";
import { BaseDataPacket } from "../models/NetModel";
import { LoginType, User } from "../models/User";
import { EventMgr } from "../util/EventManager";
import { InterfacePath } from "./InterfacePath";
import { ServiceMgr } from "./ServiceManager";
import { Socket } from "./Socket";
/**失败消息信息 */
class FailedMsgInfo {
    public data: string;//数据
    public times: number;//失败次数
    public command_id: string;//命令id
}
//消息服务管理类
class NetManager {
    private _serverUrl: string;//服务器地址
    private _serverPort: number;//服务器端口
    private _webPort: number;//web服务器端口
    // public memberToken: string;//用户token

    private _socket: Socket = null;
    private _reconnceTime: number;//重连次数
    private _reconnceTimeMax: number = 3;//最大重连次数
    private _sendFailedMsg: FailedMsgInfo[] = [];//发送失败的消息
    private _specialFailedMsg: FailedMsgInfo = null;//特殊发送失败的消息

    private static s_NetManager: NetManager = null;
    public static instance() {
        if (!this.s_NetManager) {
            this.s_NetManager = new NetManager();
        }
        return this.s_NetManager;
    }
    private constructor() {
        this._reconnceTime = 0;
        this.setServer(NetConfig.server, NetConfig.port);
    }
    //设置服务器信息
    public setServer(serverUrl: string, serverPort: number, webPort: number = 8080) {
        this._serverUrl = serverUrl;
        this._serverPort = serverPort;
        this._webPort = webPort;
    }
    //连接服务器
    public connectNet() {
        if (this._socket) {
            this._socket.closeSocket();
            this._socket = null;
        }
        console.log("connectNet", this._serverUrl, this._serverPort);
        this._socket = new Socket();
        this._socket.openFun = this.onConnect.bind(this);
        this._socket.recvFun = this.onRecvMsg.bind(this);
        this._socket.errorFun = this.onError.bind(this);
        this._socket.closeFun = this.onClose.bind(this);
        if (GlobalConfig.OLD_SERVER) {
            this._socket.connect("wss://" + this._serverUrl + ":" + this._serverPort);
            return;
        }
        this._socket.connect("ws://" + this._serverUrl + ":" + this._serverPort);
    }
    //发送消息
    public sendMsg(pbobj?: any) {
        if (this._socket) {
            if (GlobalConfig.OLD_SERVER) {
                console.log("sendMsg", pbobj.Path);
                let buffer = pbobj ? JSON.stringify(pbobj) : pbobj;
                this._socket.sendMsg(buffer);
                return;
            }
            let command_id = pbobj.command_id;
            let obj = new BaseDataPacket();
            if (Array.isArray(pbobj)) {
                pbobj.forEach(item => {
                    command_id = item.command_id;
                    item.command_id = undefined;
                });
            } else {
                pbobj.command_id = undefined;
            }
            console.log("sendMsg", command_id);
            obj.command_id = Number(command_id);
            obj.data = pbobj;
            let buffer = JSON.stringify(obj);
            // console.log("sendMsg msg2:", buffer);
            if (!this._socket.sendMsg(buffer)) {
                this.cacheFailedMsg(buffer, command_id);
            }
        }
    }
    //关闭服务器
    public closeNet() {
        if (this._socket) {
            this._socket.closeSocket();
            this._socket = null;
        }
    }
    //连接成功
    public onConnect() {
        console.log("onConnect");
        // this._reconnceTime = 0;//让登录结果来重置，防止假连接
        EventMgr.emit(EventType.Socket_Connect);
        if (GlobalConfig.OLD_SERVER) {
            ServiceMgr.accountService.accountInit();
            return;
        }
        if (!this.sendSpecialFailedMsg()) {
            if (User.memberToken && "" != User.memberToken) {
                ServiceMgr.accountService.tokenLogin();
            } else if (LoginType.account == User.loginType) {
                ServiceMgr.accountService.accountLogin();
            } else if (LoginType.phoneCode == User.loginType) {
                ServiceMgr.accountService.phoneCodeLogin();
            } else if (LoginType.phone == User.loginType) {
                ServiceMgr.accountService.phoneQuickLogin();
            } else if (LoginType.wechat == User.loginType) {
                ServiceMgr.accountService.wxLogin();
            }
        }
        this.sendFailedMsg();
    }
    //socket接收消息
    public onRecvMsg(data: string) {
        let obj = JSON.parse(data);
        if (GlobalConfig.OLD_SERVER) {
            if (obj.Path) {
                console.log("onRecvMsg id", obj.Path);
                EventMgr.emit(obj.Path, obj);
            } else {
                console.log("onRecvMsg no path", obj);
            }
            return;
        }
        if (obj.command_id) {
            console.log("onRecvMsg id", obj.command_id, obj);

            let outData = obj.data;
            if (outData) {
                if (Array.isArray(outData)) {
                    EventMgr.emit(obj.command_id, obj);
                } else {
                    outData.code = obj.code;
                    outData.msg = obj.msg;
                    EventMgr.emit(obj.command_id, outData);
                }
            } else {
                EventMgr.emit(obj.command_id, obj);
            }
        } else {
            console.log("onRecvMsg no path", obj);
        }
    }
    //socket错误回调
    public onError() {
        console.log("onError");
        EventMgr.emit(EventType.Socket_Dis);
        this.reConnect();
    }
    //socket关闭回调
    public onClose() {
        console.log("onClose");
        EventMgr.emit(EventType.Socket_Close);
        if (this._socket) {
            this.reConnect();
        }
    }
    // 弹出重连提示
    public showReconnectTips() {
        EventMgr.emit(EventType.Socket_ReconnectFail);
        ViewsMgr.closeAlertView();
        ViewsMgr.showAlert(TextConfig.Net_Error, () => {
            // if (User.isLogin) {
            this.resetReconnceTime();
            this.connectNet();
            // }
        });
    }
    //重连
    public reConnect() {
        this._reconnceTime++;
        if (this._reconnceTime > this._reconnceTimeMax) {
            this.showReconnectTips();
            return;
        }
        this.connectNet();
    }
    /**重置重连次数 */
    public resetReconnceTime() {
        this._reconnceTime = 0;
    }
    /**发送特殊失败消息 */
    public sendSpecialFailedMsg() {
        if (!this._specialFailedMsg) return false;
        if (!this._socket.sendMsg(this._specialFailedMsg.data)) {
            this._specialFailedMsg.times++;
        } else {
            this._specialFailedMsg = null;
        }
        return true;
    }
    /**失败消息再次发送 */
    public sendFailedMsg() {
        let tmp = this._sendFailedMsg;
        this._sendFailedMsg = [];
        tmp.forEach(info => {
            if (!this._socket.sendMsg(info.data)) {
                info.times++;
                if (info.times >= 3) return;
                this._sendFailedMsg.push(info);
            }
        });
    }
    /**失败消息缓存 */
    public cacheFailedMsg(data: string, command_id: string) {
        if (this.cacheSpecialFailedMsg(data, command_id)) {
            return;
        }
        if (this._sendFailedMsg.length > 50) {
            console.log("cacheFailedMsg too many");
            this._sendFailedMsg = [];
        }
        let info = new FailedMsgInfo();
        info.data = data;
        info.times = 1;
        info.command_id = command_id;
        this._sendFailedMsg.push(info);
    }
    /**特殊失败消息（登录） */
    public cacheSpecialFailedMsg(data: string, command_id: string) {
        if (InterfacePath.c2sAccountLogin != command_id && InterfacePath.c2sTokenLogin != command_id) {
            return false;
        }
        if (!this._specialFailedMsg) {
            this._specialFailedMsg = new FailedMsgInfo();
        }
        this._specialFailedMsg.command_id = command_id;
        this._specialFailedMsg.data = data;
        this._specialFailedMsg.times = 1;
        return true;
    }
}
/**NetManager单例 */
export const NetMgr = NetManager.instance();