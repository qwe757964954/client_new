import { AwardListItem, BookAwardListModel, BookItemData, BookListItemData, BookPlanDetail, MyTextbookListStatus, MyTextbookStatus, ReqPlanData, ReqUnitStatusParam, SchoolBookGradeItemData, SchoolBookItemData, SchoolBookListGradeItemData, SchoolBookListItemData, UnitItemStatus, UnitListItemStatus, UnitStatusData, UnitWordModel, c2sAddBookStatus, c2sAddPlanBookStatus, c2sAddPlanStatus, c2sBookAwardList, c2sBookPlanDetail, c2sBookStatus, c2sDelBookStatus, c2sModifyPlanStatus, c2sSchoolBook, c2sSchoolBookGrade, c2sSearchBookList, c2sUnitListStatus, c2sUnitStatus } from "../models/TextbookModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { NetNotify } from "../net/NetNotify";
import { BaseControll } from "../script/BaseControll";
import { EventMgr } from "../util/EventManager";
import { BookUnitModel } from "../views/Challenge/TextbookChallengeView";

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
        this.addModelListener(InterfacePath.Classification_AddPlanBook,this.onAddPlanBook);
        this.addModelListener(InterfacePath.Classification_BookPlanDetail,this.onBookPlanDetail);
        this.addModelListener(InterfacePath.Classification_UnitStatus,this.onUnitStatus);
        this.addModelListener(InterfacePath.Classification_BookAwardList,this.onBookAddAwardList);
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
    reqUnitListStatus(bookData:BookUnitModel){
        let param:c2sUnitListStatus = new c2sUnitListStatus();
        param.type_name = bookData.type_name;
        param.book_name = bookData.book_name;
        param.grade = bookData.grade;
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

    reqAddPlanBook(data:ReqPlanData){
        let params:c2sAddPlanBookStatus = new c2sAddPlanBookStatus();
        params.type_name = data.type_name;
        params.book_name = data.book_name;
        params.grade = data.grade;
        params.rank_num = data.rank_num;
        params.num = data.num;
        NetMgr.sendMsg(params);
    }

    onAddPlanBook(data:any){
        console.log("onAddPlanBook",data);
        if(data.Code !== 200){
            console.log(data.Msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_AddPlanBook,data);
    }
    reqBookPlanDetail(bookData:BookUnitModel){
        let params:c2sBookPlanDetail = new c2sBookPlanDetail();
        params.type_name = bookData.type_name;
        params.book_name = bookData.book_name;;
        params.grade = bookData.grade;
        NetMgr.sendMsg(params);
    }

    onBookPlanDetail(data:any){
        console.log("onBookPlanDetail",data);
        if(data.Code !== 200){
            console.log(data.Msg);
            return;
        }
        let planData:BookPlanDetail = {
            Code:data.Code,
            Msg:data.Msg,
            book_name:data.book_name,
            grade:data.grade,
            id:data.id,
            num:data.num,
            rank_num:data.rank_num,
            type_name:data.type_name,
            user_id:data.user_id
        }
        EventMgr.dispatch(NetNotify.Classification_BookPlanDetail,planData);
    }

    /*
export interface ReqUnitStatusParam{
    type_name:string;
    book_name:string;
    grade:string;
    unit:string;
    game_mode:number;
}

//我的单词--词书年级单元学习情况列表接口
export class c2sUnitStatus {
    command_id: string = InterfacePath.Classification_UnitStatus;
    type_name:string;
    book_name:string;
    grade:string;
    unit:string;
    game_mode:number;
}
*/
    reqUnitStatus(param:ReqUnitStatusParam){
        let params:c2sUnitStatus = new c2sUnitStatus();
        params.type_name = param.type_name;
        params.book_name = param.book_name;
        params.grade = param.grade;
        params.unit = param.unit;
        params.game_mode = param.game_mode;
        NetMgr.sendMsg(params);
    }
    onUnitStatus(data:any){
        console.log("onUnitStatus",data);
        if(data.Code!== 200){
            console.log(data.Msg);
            return;
        }
        let unitStatus:UnitStatusData = {
            Code:data.Code,
            Msg:data.Msg,
            flag:data.flag,
            game_mode:data.game_mode,
            grade:data.grade,
            study_num:data.study_num,
            type_name:data.type_name,
            unit:data.unit,
            user_id:data.user_id,
            data:[]
        }
        for (let index = 0; index < data.data.length; index++) {
            const element = data.data[index];
            let obj:UnitWordModel = {
                cn:element.cn,
                phonic:element.phonic,
                syllable:element.syllable,
                symbol:element.symbol,
                symbolus:element.symbolus,
                word:element.word
            }
            unitStatus.data.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_UnitStatus,unitStatus);
    }
    reqBookAwardList(type_name:string,book_name:string){
        let params:c2sBookAwardList = new c2sBookAwardList();
        params.type_name = type_name;
        params.book_name = book_name;
        NetMgr.sendMsg(params);
    }
    onBookAddAwardList(data:any){
        console.log("onBookAddAwardList",data);
        if(data.Code!== 200){
            console.log(data.Msg);
            return;
        }
        let bookAwardData:BookAwardListModel = {
            Code:data.Code,
            Msg:data.Msg,
            study_num:data.study_num,
            study_word_num:data.study_word_num,
            total_num:data.total_num,
            total_word_num:data.total_word_num,
            awards_list:[]
        }
        for (let index = 0; index < data.awards_list.length; index++) {
            let element = data.awards_list[index];
            let obj:AwardListItem = {
                num:element.num,
                rec_flag:element.rec_flag,
                awards:{
                    coin:element.awards.coin,
                    diamond:element.awards.diamond,
                    random_props:element.awards.random_props
                }
            }
            bookAwardData.awards_list.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_BookAwardList,bookAwardData);
    }
};

export const TBServer = _TextbookService.getInstance();
