import GlobalConfig from "../GlobalConfig";
import { EventType } from "../config/EventType";
import { TextConfig } from "../config/TextConfig";
import { ViewsManager } from "../manager/ViewsManager";
import { BaseDataPacket } from "../models/NetModel";
import { User } from "../models/User";
import { EventMgr } from "../util/EventManager";
import { ServiceMgr } from "./ServiceManager";
import { Socket } from "./Socket";
//消息服务管理类
class NetManager {
    private _serverUrl: string;//服务器地址
    private _serverPort: number;//服务器端口
    private _webPort: number;//web服务器端口
    // public memberToken: string;//用户token

    private _socket: Socket = null;
    private _reconnceTime: number;//重连次数
    private _reconnceTimeMax: number = 3;//最大重连次数

    private static s_NetManager: NetManager = null;
    public static instance() {
        if (!this.s_NetManager) {
            this.s_NetManager = new NetManager();
        }
        return this.s_NetManager;
    }
    private constructor() {
        this._reconnceTime = 0;
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
            this._socket.sendMsg(buffer);
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
        ServiceMgr.accountService.accountLogin();
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
            let baseData = obj.data;
            if (baseData) {
                let outData = baseData.Data;
                if (outData) {
                    if (Array.isArray(outData)) {
                        baseData.data = outData;
                        EventMgr.emit(obj.command_id, baseData);
                    } else {
                        outData.Code = baseData.Code;
                        outData.Msg = baseData.Msg;
                        EventMgr.emit(obj.command_id, outData);
                    }
                } else {
                    EventMgr.emit(obj.command_id, baseData);
                }
            } else {
                console.log("onRecvMsg no data");
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
        ViewsManager.showAlert(TextConfig.Net_Error, () => {
            if (User.isLogin) {
                this.resetReconnceTime();
                this.connectNet();
            }
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
}
/**NetManager单例 */
export const NetMgr = NetManager.instance();