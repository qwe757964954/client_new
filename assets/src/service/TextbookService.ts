import { c2sBookStatus } from "../models/TextbookModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { NetNotify } from "../net/NetNotify";
import { BaseControll } from "../script/BaseControll";
import { EventMgr } from "../util/EventManager";

//用户信息服务
export default class _TextbookService extends BaseControll{
    private static _instance: _TextbookService;
	public static getInstance(): _TextbookService {
		if (!this._instance || this._instance == null) {
			this._instance = new _TextbookService("_TextbookService");
		}
		return this._instance;
	}
    constructor(name: string) {
        super(name);
    }
    /** 初始化模块事件 */
	protected onInitModuleEvent() {
		this.addModelListener(InterfacePath.Classification_BookStatus,this.onBookStatus);
	}
    reqBookStatus(){
        let para: c2sBookStatus = new c2sBookStatus();
        NetMgr.sendMsg(para);
    }
    onBookStatus(data: any){
        console.log(data);
        EventMgr.dispatch(NetNotify.Classification_BookStatus,data);
    }    
};

export const TBServer = _TextbookService.getInstance();
