
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

            this.openFun = null;
            this.recvFun = null;
            this.closeFun = null;
            this.errorFun = null;
        }
    }

    //ip like ws://192.168.2.31:8083
    public connect(ip: string) {
        this.ip = ip;
        this.noRecvMsgTimes = 0;

        this.closeSocket();
        this._socket = new WebSocket(this.ip);
        this._socket.binaryType = "arraybuffer";
        // this._socket.binaryType = "blob";
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
            return true;
        }
        return false;
    }

    private onOpen() {
        if (this.openFun) {
            this.openFun();
        }
    }
    private arrayBufferToString(buffer: ArrayBuffer): string {
        // let start = performance.now();
        // let decoder = new TextDecoder('utf-8');//android转换失败
        // let data = decoder.decode(buffer);
        let byteArray = new Uint8Array(buffer);
        let chunkSize = 65535; // 分块大小，可以根据需要调整
        let data = '';
        for (let i = 0; i < byteArray.length; i += chunkSize) {
            let chunk = byteArray.slice(i, i + chunkSize);
            data += String.fromCharCode.apply(null, chunk);
        }
        // let end = performance.now();
        // console.log("arrayBufferToString", end - start);
        return data;
    }
    private onMessage(msg) {
        // console.log("onMessage", msg);
        this.noRecvMsgTimes = 0;
        let buffer: any = msg.data;
        if (!buffer) { return; }
        if (buffer instanceof ArrayBuffer) {
            let data = this.arrayBufferToString(buffer);
            if (this.recvFun) {
                this.recvFun(data);
            }
        } else if (buffer instanceof Blob) {
            // console.log("onMessage data Blob");
            buffer.text().then((data) => {
                if (this.recvFun) {
                    this.recvFun(data);
                }
            });
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
