import { EventType } from "../config/EventType";
import { TextConfig } from "../config/TextConfig";
import { ViewsManager } from "../manager/ViewsManager";
import { c2sAccountEditRealName, c2sAccountInit, c2sAccountStudyWord, c2sPropMyList } from "../models/NetModel";
import EventManager from "../util/EventManager";
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

        this._socket = new Socket();
        this._socket.openFun = this.onConnect.bind(this);
        this._socket.recvFun = this.onRecvMsg.bind(this);
        this._socket.errorFun = this.onError.bind(this);
        this._socket.closeFun = this.onClose.bind(this);
        this._socket.connect("wss://" + this._serverUrl + ":" + this._serverPort);
    }
    //发送消息
    public sendMsg(pbobj?: any) {
        if (this._socket) {
            console.log("sendMsg", pbobj.Path);
            let buffer = pbobj ? JSON.stringify(pbobj) : pbobj;//pb对象转数据
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
        this._reconnceTime = 0;
        EventManager.emit(EventType.Socket_Connect);
        ServiceMgr.accountService.accountInit();
    }
    //socket接收消息
    public onRecvMsg(data: string) {
        let obj = JSON.parse(data);
        console.log("onRecvMsg", obj.Path);
        EventManager.emit(obj.Path, obj);
    }
    //socket错误回调
    public onError() {
        console.log("onError");
        this.reConnect();
    }
    //socket关闭回调
    public onClose() {
        console.log("onClose");
        if (this._socket) {
            this.reConnect();
        }
    }
    // 弹出重连提示
    public showReconnectTips() {
        ViewsManager.showAlert(TextConfig.Net_Error, () => {
            this._reconnceTime = 0;
            this.connectNet();
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

    /********************************消息接口start**************************************/
    //请求初始数据
    public reqInitData() {
        let para: c2sAccountInit = new c2sAccountInit;
        // para.MemberToken = 
        this.sendMsg(para);
    }

    // 请求我的道具列表
    public reqMyListData(moduleId: number) {
        let para: c2sPropMyList = new c2sPropMyList;
        para.ModuleId = moduleId;
        this.sendMsg(para);
    }

    // 请求修改名称
    public reqChangeRealNameData(realName: string) {
        let para: c2sAccountEditRealName = new c2sAccountEditRealName;
        para.RealName = realName;
        this.sendMsg(para);
    }

    // 请求学生通关单词
    public reqStudyWordData() {
        let para: c2sAccountStudyWord = new c2sAccountStudyWord;
        this.sendMsg(para);
    }

    /********************************消息接口end****************************************/
}
/**NetManager单例 */
export const NetMgr = NetManager.instance();