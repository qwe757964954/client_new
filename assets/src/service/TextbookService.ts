import { BookListItemData, MyTextbookStatus, SchoolBookGradeItemData, SchoolBookListItemData, c2sBookStatus, c2sDelBookStatus, c2sSchoolBook, c2sSchoolBookGrade, c2sSearchBookList } from "../models/TextbookModel";
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
        this.addModelListener(InterfacePath.Classification_List,this.onBookList);
        this.addModelListener(InterfacePath.Classification_SchoolBook,this.onSchoolBook);
        this.addModelListener(InterfacePath.Classification_SchoolGrade,this.onSchoolBookGrade);
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
    reqBookList(){
        let param:c2sSearchBookList = new c2sSearchBookList();
        NetMgr.sendMsg(param);
    }
    onBookList(data:any){
        console.log("onBookList",data);
        if(data.Code!== 200){
            console.log(data.Msg);
            return
        }
        let dataArr:BookListItemData[] = [];
        for (let index = 0; index < data.Data.length; index++) {
            const element = data.Data[index];
            let obj:BookListItemData = {
                Name:element.Name,
                Num:element.Num,
                SortNo:element.SortNo,
                TypeName:element.TypeName
            }
            dataArr.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_List,dataArr);
    }
    reqSchoolBook(TypeName:string){
        let param:c2sSchoolBook = new c2sSchoolBook();
        param.TypeName = TypeName;
        NetMgr.sendMsg(param);
    }
    onSchoolBook(data:any){
        if(data.Code!== 200){
            console.log(data.Msg);
            return;
        }
        let dataArr:SchoolBookListItemData[] = [];
        for (let index = 0; index < data.Data.length; index++) {
            const element = data.Data[index];
            let obj:SchoolBookListItemData = {
                Name:element.Name,
                Num:element.Num,
                SortNo:element.SortNo,
                TypeName:element.TypeName
            }
            dataArr.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_SchoolBook,dataArr);
    }

    reqSchoolBookGrade(TypeName:string,BookName:string){
        let param:c2sSchoolBookGrade = new c2sSchoolBookGrade();
        param.TypeName = TypeName;
        param.BookName = BookName;
        NetMgr.sendMsg(param);
    }
    onSchoolBookGrade(data:any){
        if(data.Code!== 200){
            console.log(data.Msg);
            return;
        }
        let dataArr:SchoolBookGradeItemData[] = [];
        for (let index = 0; index < data.Data.length; index++) {
            const element = data.Data[index];
            let obj:SchoolBookGradeItemData = {
                Name:element.Name,
                Num:element.Num
            }
            dataArr.push(obj);
        }
        console.log(dataArr);
        EventMgr.dispatch(NetNotify.Classification_SchoolGrade,dataArr);
    }
};

export const TBServer = _TextbookService.getInstance();
