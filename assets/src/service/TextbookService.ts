import { MyTextbookStatus, c2sBookStatus, c2sDelBookStatus } from "../models/TextbookModel";
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
        this.addModelListener(InterfacePath.Classification_BookDel,this.onBookDel);
	}
    reqBookStatus(){
        let para: c2sBookStatus = new c2sBookStatus();
        NetMgr.sendMsg(para);
    }
    onBookStatus(data: any){
        console.log(data);
        let dataArr:MyTextbookStatus[] = []
        if(data.Code !== 200){
            console.log(data.Msg);
            return
        }
        for (let index = 0; index < data.Data.length; index++) {
            const element = data.Data[index];
            let obj:MyTextbookStatus = {
                AccountId:element.AccountId,
                BookName:element.BookName,
                Grade:element.Grade,
                Score:element.Score,
                StudyWordNum:element.StudyWordNum,
                TotalScore:element.TotalScore,
                TotalWordNum:element.TotalWordNum,
                TypeName:element.TypeName,
                createtime:element.createtime,
                id:element.id,
            }
            dataArr.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_BookStatus,dataArr);
    }
    reqBookDel(data: MyTextbookStatus){
        let param:c2sDelBookStatus = new c2sDelBookStatus();
        param.BookName = data.BookName;
        param.Grade = data.Grade;
        param.TypeName = data.TypeName;
        NetMgr.sendMsg(param);
    }
    onBookDel(data: any){
        console.log(data);
        if(data.Code !== 200){
            console.log(data.Msg);
            return
        }
        EventMgr.dispatch(NetNotify.Classification_BookDel,data);
    }  
};

export const TBServer = _TextbookService.getInstance();
