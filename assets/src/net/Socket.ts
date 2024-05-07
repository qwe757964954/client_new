import GlobalConfig from "../GlobalConfig";

export class Socket {

    private ip: string;
    private timer;
    private noRecvMsgTimes: number = 0;

    private _socket: WebSocket;
    public closeFun: ((this: Socket) => any) | null;
    public errorFun: ((this: Socket) => any) | null;
    public recvFun: ((this: Socket, data: string) => any) | null;
    public openFun: ((this: Socket) => any) | null;

    public isConnected() {
        if (this._socket && this._socket.readyState == WebSocket.CONNECTING) {
            return true;
        }
        return false;
    }

    private clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    private sendHeartMsg() {

    }

    public closeSocket() {
        if (this._socket) {
            this._socket.close();
            this._socket = null;
        }
    }

    //ip like ws://192.168.2.31:8083
    public connect(ip: string) {
        this.ip = ip;
        this.noRecvMsgTimes = 0;

        this.closeSocket();
        this._socket = new WebSocket(this.ip);
        this._socket.binaryType = "arraybuffer";
        this._socket.onopen = this.onOpen.bind(this);
        this._socket.onmessage = this.onMessage.bind(this);
        this._socket.onerror = this.onError.bind(this);
        this._socket.onclose = this.onClose.bind(this);

        this.clearTimer();
        // TODO 每10秒发送一次心跳 服务器后端增加后放开
        // this.timer = setInterval(() => {
        //     if (this.isConnected()) {
        //         this.sendHeartMsg();
        //     }
        //     this.noRecvMsgTimes = this.noRecvMsgTimes + 1;
        //     if (this.noRecvMsgTimes > 2) {
        //         // net time out
        //         this.closeSocket();
        //         this.clearTimer();
        //         this.onError();
        //     }
        // }, 10000);
    }

    public sendMsg(msg?: string) {
        if (this._socket && this._socket.readyState === WebSocket.OPEN) {
            this._socket.send(msg);
        }
    }

    private onOpen() {
        if (this.openFun) {
            this.openFun();
        }
    }
    private onMessage(msg) {
        this.noRecvMsgTimes = 0;
        if (GlobalConfig.OLD_SERVER) {
            let buffer: string = msg.data;
            if (!buffer) { return; }
            if (this.recvFun) {
                this.recvFun(buffer);
            }
            return;
        }
        let buffer: ArrayBuffer = msg.data;
        if (!buffer) { return; }
        let data = String.fromCharCode.apply(null, new Uint8Array(buffer));
        if (this.recvFun) {
            this.recvFun(data);
        }
    }
    private onError() {
        if (this.errorFun) {
            this.errorFun();
        }
    }
    private onClose() {
        if (this.closeFun) {
            this.closeFun();
        }
    }
}
