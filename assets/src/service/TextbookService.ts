import { isValid } from "cc";
import { ViewsManager } from "../manager/ViewsManager";
import { AwardListItem, BookAwardListModel, BookItemData, BookListItemData, BookPlanDetail, CurrentBookStatus, ModifyPlanData, MyTextbookListStatus, MyTextbookStatus, ReportResultModel, ReqPlanData, ReqUnitStatusParam, SchoolBookGradeItemData, SchoolBookItemData, SchoolBookListGradeItemData, SchoolBookListItemData, UnitItemStatus, UnitListItemStatus, UnitStatusData, UnitWordModel, c2sAddBookStatus, c2sAddPlanBookStatus, c2sAddPlanStatus, c2sBookAwardList, c2sBookPlanDetail, c2sBookStatus, c2sCurrentBook, c2sDelBookStatus, c2sModifyPlanStatus, c2sReportResult, c2sSchoolBook, c2sSchoolBookGrade, c2sSearchBookList, c2sUnitListStatus, c2sUnitStatus } from "../models/TextbookModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { NetNotify } from "../net/NetNotify";
import { BaseControll } from "../script/BaseControll";
import { EventMgr } from "../util/EventManager";
import { BookUnitModel } from "../views/Challenge/TextbookChallengeView";

//用户信息服务
export default class _TextbookService extends BaseControll {
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
        this.addModelListener(InterfacePath.Classification_BookStatus, this.onBookStatus);
        this.addModelListener(InterfacePath.Classification_BookDel, this.onBookDel);
        this.addModelListener(InterfacePath.Classification_BookAdd, this.onBookAdd);
        this.addModelListener(InterfacePath.Classification_List, this.onBookList);
        this.addModelListener(InterfacePath.Classification_SchoolBook, this.onSchoolBook);
        this.addModelListener(InterfacePath.Classification_SchoolGrade, this.onSchoolBookGrade);
        this.addModelListener(InterfacePath.Classification_UnitListStatus, this.onUnitListStatus);
        this.addModelListener(InterfacePath.Classification_PlanAdd, this.onPlanAdd);
        this.addModelListener(InterfacePath.Classification_PlanModify, this.onModifyPlan);
        this.addModelListener(InterfacePath.Classification_AddPlanBook, this.onAddPlanBook);
        this.addModelListener(InterfacePath.Classification_BookPlanDetail, this.onBookPlanDetail);
        this.addModelListener(InterfacePath.Classification_UnitStatus, this.onUnitStatus);
        this.addModelListener(InterfacePath.Classification_BookAwardList, this.onBookAddAwardList);
        this.addModelListener(InterfacePath.Classification_CurrentBook, this.onCurrentBook);
        this.addModelListener(InterfacePath.Classification_ReportResult,this.onReportResult)
    }
    reqBookStatus() {
        let para: c2sBookStatus = new c2sBookStatus();
        NetMgr.sendMsg(para);
    }
    onBookStatus(data: any) {
        console.log(data);
        if (data.code !== 200) {
            console.log(data.msg);
            return
        }
        let myTextbookList: MyTextbookListStatus = {
            code: data.code,
            msg: data.msg,
            data: [],
        }
        for (let index = 0; index < data.data.length; index++) {
            const element = data.data[index];
            let obj: MyTextbookStatus = {
                book_name: element.book_name,
                grade: element.grade,
                score: element.score,
                study_word_num: element.study_word_num,
                total_score: element.total_score,
                total_word_num: element.total_word_num,
                type_name: element.type_name,
                unit: element.unit,
                user_id: element.user_id,
            }
            myTextbookList.data.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_BookStatus, myTextbookList.data);
    }
    reqBookDel(data: MyTextbookStatus) {
        let param: c2sDelBookStatus = new c2sDelBookStatus();
        param.book_name = data.book_name;
        param.grade = data.grade;
        param.type_name = data.type_name;
        NetMgr.sendMsg(param);
    }
    onBookDel(data: any) {
        console.log(data);
        if (data.code !== 200) {
            console.log(data.msg);
            return
        }
        EventMgr.dispatch(NetNotify.Classification_BookDel, data);
    }
    reqBookAdd(BookName: string, Grade: string, TypeName: string) {
        let param: c2sAddBookStatus = new c2sAddBookStatus();
        param.book_name = BookName;
        param.grade = Grade;
        param.type_name = TypeName;
        NetMgr.sendMsg(param);
    }
    onBookAdd(data: any) {
        console.log("onBookAdd", data);
        if (data.code !== 200) {
            console.log(data.msg);
            return
        }
        EventMgr.dispatch(NetNotify.Classification_BookAdd, data);
    }

    reqPlanAdd(data: ReqPlanData) {
        let param: c2sAddPlanStatus = new c2sAddPlanStatus();
        param.book_name = data.book_name;
        param.grade = data.grade;
        param.type_name = data.type_name;
        param.rank_num = data.rank_num;
        param.num = data.num;
        NetMgr.sendMsg(param);
    }

    onPlanAdd(data: any) {
        console.log("onPlanAdd", data);
        if (data.code !== 200) {
            console.log(data.msg);
            return
        }
        EventMgr.dispatch(NetNotify.Classification_PlanAdd, data);
    }

    reqModifyPlan(data: ModifyPlanData) {
        let param: c2sModifyPlanStatus = new c2sModifyPlanStatus();
        param.plan_id = data.plan_id;
        param.rank_num = data.rank_num;
        param.num = data.num;
        NetMgr.sendMsg(param);
    }

    onModifyPlan(data: any) {
        console.log("onModifyPlan", data);
        if (data.code !== 200) {
            console.log(data.msg);
            return
        }
        EventMgr.dispatch(NetNotify.Classification_PlanModify, data);
    }

    reqBookList() {
        let param: c2sSearchBookList = new c2sSearchBookList();
        NetMgr.sendMsg(param);
    }
    onBookList(data: any) {
        console.log("onBookList", data);
        if (data.code !== 200) {
            console.log(data.msg);
            return
        }
        let bookLiskData: BookListItemData = {
            code: data.code,
            msg: data.msg,
            dataArr: []
        };
        for (let index = 0; index < data.data.length; index++) {
            const element = data.data[index];
            let obj: BookItemData = {
                name: element.name,
                num: element.num,
                sort_no: element.sort_no,
                type_name: element.type_name
            }
            bookLiskData.dataArr.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_List, bookLiskData);
    }
    reqSchoolBook(TypeName: string) {
        let param: c2sSchoolBook = new c2sSchoolBook();
        param.type_name = TypeName;
        NetMgr.sendMsg(param);
    }
    onSchoolBook(data: any) {
        console.log("onSchoolBook", data);
        if (data.code !== 200) {
            console.log(data.msg);
            return;
        }
        let schoolBookList: SchoolBookListItemData = {
            code: data.code,
            msg: data.msg,
            data: []
        }
        for (let index = 0; index < data.data.length; index++) {
            const element = data.data[index];
            let obj: SchoolBookItemData = {
                book_name: element.book_name,
                num: element.num,
            }
            schoolBookList.data.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_SchoolBook, schoolBookList);
    }
    reqSchoolBookGrade(TypeName: string, BookName: string) {
        let param: c2sSchoolBookGrade = new c2sSchoolBookGrade();
        param.type_name = TypeName;
        param.book_name = BookName;
        NetMgr.sendMsg(param);
    }
    onSchoolBookGrade(data: any) {
        if (data.code !== 200) {
            console.log(data.msg);
            return;
        }
        let schoolGradeList: SchoolBookListGradeItemData = {
            code: data.code,
            msg: data.msg,
            data: []
        }
        for (let index = 0; index < data.data.length; index++) {
            const element = data.data[index];
            let obj: SchoolBookGradeItemData = {
                grade: element.grade,
                num: element.num
            }
            schoolGradeList.data.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_SchoolGrade, schoolGradeList);
    }
    reqUnitListStatus(bookData: BookUnitModel) {
        let param: c2sUnitListStatus = new c2sUnitListStatus();
        param.type_name = bookData.type_name;
        param.book_name = bookData.book_name;
        param.grade = bookData.grade;
        NetMgr.sendMsg(param);
    }
    onUnitListStatus(data: any) {
        console.log("onUnitListStatus", data);
        if (data.code !== 200) {
            console.log(data.msg);
            return;
        }
        let unitListStatus: UnitListItemStatus = {
            code: data.code,
            msg: data.msg,
            data: []
        }
        for (let index = 0; index < data.data.length; index++) {
            const element = data.data[index];
            let obj: UnitItemStatus = {
                num: element.num,
                unit: element.unit,
            }
            unitListStatus.data.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_UnitListStatus, unitListStatus);
    }

    reqAddPlanBook(data: ReqPlanData) {
        let params: c2sAddPlanBookStatus = new c2sAddPlanBookStatus();
        params.type_name = data.type_name;
        params.book_name = data.book_name;
        params.grade = data.grade;
        params.rank_num = data.rank_num;
        params.num = data.num;
        NetMgr.sendMsg(params);
    }

    onAddPlanBook(data: any) {
        console.log("onAddPlanBook", data);
        if (data.code !== 200) {
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_AddPlanBook, data);
    }
    reqBookPlanDetail(bookData: BookUnitModel) {
        let params: c2sBookPlanDetail = new c2sBookPlanDetail();
        params.type_name = bookData.type_name;
        params.book_name = bookData.book_name;;
        params.grade = bookData.grade;
        NetMgr.sendMsg(params);
    }

    onBookPlanDetail(data: any) {
        console.log("onBookPlanDetail", data);
        if (data.code !== 200) {
            console.log(data.msg);
            return;
        }
        let planData: BookPlanDetail = {
            code: data.code,
            msg: data.msg,
            book_name: data.book_name,
            grade: data.grade,
            id: data.id,
            num: data.num,
            rank_num: data.rank_num,
            type_name: data.type_name,
            user_id: data.user_id
        }
        EventMgr.dispatch(NetNotify.Classification_BookPlanDetail, planData);
    }
    reqUnitStatus(param: ReqUnitStatusParam) {
        let params: c2sUnitStatus = new c2sUnitStatus();
        params.type_name = param.type_name;
        params.book_name = param.book_name;
        params.grade = param.grade;
        params.unit = param.unit;
        params.game_mode = param.game_mode;
        NetMgr.sendMsg(params);
    }
    onUnitStatus(data: any) {
        console.log("onUnitStatus", data);
        if (data.code !== 200) {
            console.log(data.msg);
            return;
        }
        let unitStatus: UnitStatusData = {
            code: data.Code,
            msg: data.Msg,
            flag: data.flag,
            game_mode: data.game_mode,
            grade: data.grade,
            study_num: data.study_num,
            type_name: data.type_name,
            unit: data.unit,
            user_id: data.user_id,
            book_name:data.book_name,
            data: []
        }
        for (let index = 0; index < data.data.length; index++) {
            const element = data.data[index];
            let obj: UnitWordModel = {
                cn: element.cn,
                phonic: element.phonic,
                syllable: element.syllable,
                symbol: element.symbol,
                symbolus: element.symbolus,
                word: element.word
            }
            unitStatus.data.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_UnitStatus, unitStatus);
    }
    reqBookAwardList(type_name: string, book_name: string) {
        let params: c2sBookAwardList = new c2sBookAwardList();
        params.type_name = type_name;
        params.book_name = book_name;
        NetMgr.sendMsg(params);
    }
    onBookAddAwardList(data: any) {
        console.log("onBookAddAwardList", data);
        if (data.code !== 200) {
            console.log(data.msg);
            return;
        }
        let bookAwardData: BookAwardListModel = {
            code: data.code,
            msg: data.msg,
            study_num: data.study_num,
            study_word_num: data.study_word_num,
            total_num: data.total_num,
            total_word_num: data.total_word_num,
            awards_list: []
        }
        for (let index = 0; index < data.awards_list.length; index++) {
            let element = data.awards_list[index];
            let obj: AwardListItem = {
                num: element.num,
                rec_flag: element.rec_flag,
                awards: {
                    coin: element.awards.coin,
                    diamond: element.awards.diamond,
                    random_props: element.awards.random_props
                }
            }
            bookAwardData.awards_list.push(obj);
        }
        EventMgr.dispatch(NetNotify.Classification_BookAwardList, bookAwardData);
    }

    reqCurrentBook(){
        let params:c2sCurrentBook = new c2sCurrentBook();
        NetMgr.sendMsg(params);
    }

    onCurrentBook(data:any){
        console.log("onCurrentBook.....",data);
        if(data.code !== 200){
            console.log(data.msg);
            return;
        }
        let curBookData:CurrentBookStatus = {
            msg: data.msg,
            code: data.code,
        }
        if(isValid(data.type_name) && isValid(data.book_name) && isValid(data.grade)){
            curBookData.user_id = data.user_id;
            curBookData.type_name = data.type_name;
            curBookData.book_name = data.book_name;
            curBookData.grade = data.grade;
            curBookData.unit = data.unit;
            curBookData.status = data.status;
            curBookData.score = data.score;
            curBookData.total_score = data.total_score;
            curBookData.study_word_num = data.study_word_num;
            curBookData.total_word_num = data.total_word_num;
        }
        EventMgr.dispatch(NetNotify.Classification_CurrentBook, curBookData);
    }

    reqReportResult(data:ReportResultModel){
        let params:c2sReportResult = new c2sReportResult();
        params.type_name = data.type_name;
        params.book_name = data.book_name;
        params.grade = data.grade;
        params.unit = data.unit;
        params.game_mode = data.game_mode;
        NetMgr.sendMsg(params);
    }

    onReportResult(data:any){
        console.log("onReportResult.....",data);
        if(data.code !== 200){
            console.log(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_ReportResult, data);
    }
};

export const TBServer = _TextbookService.getInstance();
