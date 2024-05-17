import { isValid } from "cc";
import { ViewsManager } from "../manager/ViewsManager";
import { CurrentBookStatus, GameSubmitModel, ModifyPlanData, MyTextbookListStatus, MyTextbookStatus, ReportResultModel, ReqPlanData, ReqUnitStatusParam, c2sAddBookStatus, c2sAddPlanBookStatus, c2sAddPlanStatus, c2sBookAwardList, c2sBookPlanDetail, c2sBookStatus, c2sChangeTextbook, c2sCurrentBook, c2sDelBookStatus, c2sGameSubmit, c2sModifyPlanStatus, c2sReportResult, c2sSchoolBook, c2sSchoolBookGrade, c2sSearchBookList, c2sUnitListStatus, c2sUnitStatus, c2sWordDetail } from "../models/TextbookModel";
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
        this.addModelListener(InterfacePath.Classification_ReportResult,this.onReportResult);
        this.addModelListener(InterfacePath.Classification_Word,this.onWordDetail);
        this.addModelListener(InterfacePath.Classification_ChangeTextbook,this.onChangeTextbook);
        this.addModelListener(InterfacePath.Classification_GameSubmit,this.onGameSubmit);
    }
    reqBookStatus() {
        let para: c2sBookStatus = new c2sBookStatus();
        NetMgr.sendMsg(para);
    }
    onBookStatus(data: any) {
        console.log(data);
        if (data.code !== 200) {
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
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
            ViewsManager.showTip(data.msg);
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
            ViewsManager.showTip(data.msg);
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
            ViewsManager.showTip(data.msg);
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
            ViewsManager.showTip(data.msg);
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
            ViewsManager.showTip(data.msg);
            return
        }
        EventMgr.dispatch(NetNotify.Classification_List, data);
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
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_SchoolBook, data);
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
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_SchoolGrade, data);
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
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_UnitListStatus, data);
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
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_BookPlanDetail, data);
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
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_UnitStatus, data);
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
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_BookAwardList, data);
    }

    reqCurrentBook(){
        let params:c2sCurrentBook = new c2sCurrentBook();
        NetMgr.sendMsg(params);
    }

    onCurrentBook(data:any){
        console.log("onCurrentBook.....",data);
        if(data.code !== 200){
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
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
            curBookData.id = data.id;
            curBookData.num = data.num;
            curBookData.rank_num = data.rank_num;
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
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_ReportResult, data);
    }
    reqWordDetail(word:string){
        let params:c2sWordDetail = new c2sWordDetail();
        params.word = word;
        NetMgr.sendMsg(params);
    }
    onWordDetail(data:any){
        console.log("onWordDetail....",data);
        if(data.code !== 200) {
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_Word, data);
    }

    reqChangeTextbook(data: BookUnitModel) {
        let params: c2sChangeTextbook = new c2sChangeTextbook();
        params.type_name = data.type_name;
        params.book_name = data.book_name;
        params.grade = data.grade;
        NetMgr.sendMsg(params);
    }

    onChangeTextbook(data: any) {
        console.log("onChangeTextbook", data);
        if (data.code !== 200) {
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_ChangeTextbook, data);
    }


    reqGameSubmit(data:GameSubmitModel){
        let params:c2sGameSubmit = new c2sGameSubmit();
        params.word = data.word;
        params.type_name = data.type_name;
        params.book_name = data.book_name;
        params.grade = data.grade;
        params.cost_time = data.cost_time;
        params.unit = data.unit;
        params.game_mode = data.game_mode;
        console.log(data);
        NetMgr.sendMsg(params);
    }
    onGameSubmit(data:any){
        console.log("onGameSubmit.....",data);
        if(data.code !== 200){
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_GameSubmit, data);
    }
};

export const TBServer = _TextbookService.getInstance();
