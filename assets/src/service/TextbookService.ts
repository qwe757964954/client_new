import { BookItemData, BookListItemData, MyTextbookListStatus, MyTextbookStatus, ReqPlanData, SchoolBookGradeItemData, SchoolBookItemData, SchoolBookListGradeItemData, SchoolBookListItemData, UnitItemStatus, UnitListItemStatus, c2sAddBookStatus, c2sAddPlanStatus, c2sBookStatus, c2sDelBookStatus, c2sModifyPlanStatus, c2sSchoolBook, c2sSchoolBookGrade, c2sSearchBookList, c2sUnitListStatus } from "../models/TextbookModel";
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
        this.addModelListener(InterfacePath.Classification_BookAdd,this.onBookAdd);
        this.addModelListener(InterfacePath.Classification_List,this.onBookList);
        this.addModelListener(InterfacePath.Classification_SchoolBook,this.onSchoolBook);
        this.addModelListener(InterfacePath.Classification_SchoolGrade,this.onSchoolBookGrade);
        this.addModelListener(InterfacePath.Classification_UnitListStatus,this.onUnitListStatus);
        this.addModelListener(InterfacePath.Classification_PlanAdd,this.onPlanAdd);
        this.addModelListener(InterfacePath.Classification_PlanModify,this.onModifyPlan);
	}
    reqBookStatus(){
        let para: c2sBookStatus = new c2sBookStatus();
        NetMgr.sendMsg(para);
    }
    onBookStatus(data: any){
        console.log(data);
        if(data.Code !== 200){
            console.log(data.Msg);
            return
        }
        let myTextbookList:MyTextbookListStatus = {
            Code:data.Code,
            Msg:data.MSg,
            data:[],
        }
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let obj:MyTextbookStatus = {
                book_name:element.book_name,
                grade:element.grade,
                score:element.score,
                study_word_num:element.study_word_num,
                total_score:element.total_score,
                total_word_num:element.total_word_num,
                type_name:element.type_name,
                unit:element.unit,
                user_id:element.user_id,
            }
            myTextbookList.data.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_BookStatus,myTextbookList.data);
    }
    reqBookDel(data: MyTextbookStatus){
        let param:c2sDelBookStatus = new c2sDelBookStatus();
        param.book_name = data.book_name;
        param.grade = data.grade;
        param.type_name = data.type_name;
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
    reqBookAdd(BookName: string,Grade: string,TypeName: string){
        let param:c2sAddBookStatus = new c2sAddBookStatus();
        param.book_name = BookName;
        param.grade = Grade;
        param.type_name = TypeName;
        NetMgr.sendMsg(param);
    }
    onBookAdd(data: any){
        console.log("onBookAdd",data);
        if(data.Code !== 200){
            console.log(data.Msg);
            return
        }
        EventMgr.dispatch(NetNotify.Classification_BookAdd,data);
    }

    reqPlanAdd(data:ReqPlanData){
        let param:c2sAddPlanStatus = new c2sAddPlanStatus();
        param.book_name = data.book_name;
        param.grade = data.grade;
        param.type_name = data.type_name;
        param.rank_num = data.rank_num;
        param.num = data.num;
        NetMgr.sendMsg(param);
    }

    onPlanAdd(data: any){
        console.log("onPlanAdd",data);
        if(data.Code !== 200){
            console.log(data.Msg);
            return
        }
        EventMgr.dispatch(NetNotify.Classification_PlanAdd,data);
    }

    reqModifyPlan(data:ReqPlanData){
        let param:c2sModifyPlanStatus = new c2sModifyPlanStatus();
        param.book_name = data.book_name;
        param.grade = data.grade;
        param.type_name = data.type_name;
        param.rank_num = data.rank_num;
        param.num = data.num;
        NetMgr.sendMsg(param);
    }

    onModifyPlan(data:any){
        console.log("onModifyPlan",data);
        if(data.Code !== 200){
            console.log(data.Msg);
            return
        }
        EventMgr.dispatch(NetNotify.Classification_PlanModify,data);
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
        let bookLiskData:BookListItemData = {
            Code:data.Code,
            Msg:data.Msg,
            dataArr:[]
        };
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let obj:BookItemData = {
                name:element.name,
                num:element.num,
                sort_no:element.sort_no,
                type_name:element.type_name
            }
            bookLiskData.dataArr.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_List,bookLiskData);
    }
    reqSchoolBook(TypeName:string){
        let param:c2sSchoolBook = new c2sSchoolBook();
        param.type_name = TypeName;
        NetMgr.sendMsg(param);
    }
    onSchoolBook(data:any){
        console.log("onSchoolBook",data);
        if(data.Code!== 200){
            console.log(data.Msg);
            return;
        }
        let schoolBookList:SchoolBookListItemData = {
            Code:data.Code,
            Msg:data.Msg,
            data:[]
        }
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let obj:SchoolBookItemData = {
                book_name:element.book_name,
                num:element.num,
            }
            schoolBookList.data.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_SchoolBook,schoolBookList);
    }
    reqSchoolBookGrade(TypeName:string,BookName:string){
        let param:c2sSchoolBookGrade = new c2sSchoolBookGrade();
        param.type_name = TypeName;
        param.book_name = BookName;
        NetMgr.sendMsg(param);
    }
    onSchoolBookGrade(data:any){
        if(data.Code!== 200){
            console.log(data.Msg);
            return;
        }
        let schoolGradeList:SchoolBookListGradeItemData = {
            Code:data.Code,
            Msg:data.Msg,
            data:[]
        }
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let obj:SchoolBookGradeItemData = {
                grade:element.grade,
                num:element.num
            }
            schoolGradeList.data.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_SchoolGrade,schoolGradeList);
    }
    reqUnitListStatus(TypeName:string,BookName:string,Grade:string){
        let param:c2sUnitListStatus = new c2sUnitListStatus();
        param.type_name = TypeName;
        param.book_name = BookName;
        param.grade = Grade;
        NetMgr.sendMsg(param);
    }
    onUnitListStatus(data:any){
        console.log("onUnitListStatus",data);
        if(data.Code !== 200){
            console.log(data.Msg);
            return;
        }
        let unitListStatus:UnitListItemStatus = {
            Code:data.Code,
            Msg:data.Msg,
            data:[]
        }
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let obj:UnitItemStatus = {
                num:element.num,
                unit:element.unit,
            }
            unitListStatus.data.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_UnitListStatus,unitListStatus);
    }
};

export const TBServer = _TextbookService.getInstance();
