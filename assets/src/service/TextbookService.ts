import { isValid } from "cc";
import { ViewsManager } from "../manager/ViewsManager";
import { CheckWordModel, GameSubmitModel, ModifyPlanData, MyTextbookStatus, ReportResultModel, ReqCollectWord, ReqPlanData, ReqUnitStatusParam, ReqUnitType, c2sAddPlanBookStatus, c2sBookAwardList, c2sBookPlanDetail, c2sBookStatus, c2sChangeTextbook, c2sCheckWord, c2sCollectWord, c2sCurrentBook, c2sDelBookStatus, c2sGameSubmit, c2sModifyPlanStatus, c2sReportResult, c2sSchoolBook, c2sSchoolBookGrade, c2sSearchBookList, c2sUnitListStatus, c2sUnitStatus, c2sVocabularyWord, c2sWordDetail } from "../models/TextbookModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { NetNotify } from "../net/NetNotify";
import { BaseControll } from "../script/BaseControll";
import { EventMgr } from "../util/EventManager";

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
        this.addModelListener(InterfacePath.Classification_List, this.onBookList);
        this.addModelListener(InterfacePath.Classification_SchoolBook, this.onSchoolBook);
        this.addModelListener(InterfacePath.Classification_SchoolGrade, this.onSchoolBookGrade);
        this.addModelListener(InterfacePath.Classification_UnitListStatus, this.onUnitListStatus);
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
        this.addModelListener(InterfacePath.Classification_CheckWord,this.onCheckWord);
        this.addModelListener(InterfacePath.Classification_VocabularyWord,this.onVocabularyWord);
        this.addModelListener(InterfacePath.Classification_CollectWord,this.onCollectWord);
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
        EventMgr.dispatch(NetNotify.Classification_BookStatus, data);
    }
    reqBookDel(data: MyTextbookStatus) {
        let param: c2sDelBookStatus = new c2sDelBookStatus();
        param.book_id = data.book_id;
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
    onBookAdd(data: any) {
        console.log("onBookAdd", data);
        if (data.code !== 200) {
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return
        }
        EventMgr.dispatch(NetNotify.Classification_BookAdd, data);
    }

    reqModifyPlan(data: ModifyPlanData) {
        let param: c2sModifyPlanStatus = new c2sModifyPlanStatus();
        param.cu_id = data.cu_id;
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
    reqSchoolBook(phase_id: number) {
        let param: c2sSchoolBook = new c2sSchoolBook();
        param.phase_id = phase_id;
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
    reqSchoolBookGrade(phase_id: number, BookName: string) {
        let param: c2sSchoolBookGrade = new c2sSchoolBookGrade();
        param.phase_id = phase_id;
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
    reqUnitListStatus(book_id: string) {
        console.log("reqUnitListStatus......",book_id);
        let param: c2sUnitListStatus = new c2sUnitListStatus();
        param.book_id = book_id;
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
        params.book_id = data.book_id;
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
    reqBookPlanDetail(book_id: string) {
        let params: c2sBookPlanDetail = new c2sBookPlanDetail();
        params.book_id = book_id;
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
    reqUnitStatus(data: ReqUnitStatusParam) {
        let params: c2sUnitStatus = new c2sUnitStatus();
        params.book_id = data.book_id;
        params.unit_id = data.unit_id;
        params.small_id = data.small_id;
        params.category = ReqUnitType.Normal;
        if(isValid(data.category)){
            params.category = data.category;
        }
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
        EventMgr.dispatch(NetNotify.Classification_CurrentBook, data);
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
    /**
     * 单词详情
     * 请求
     * @param word 
     */
    reqWordDetail(w_id:string){
        let params:c2sWordDetail = new c2sWordDetail();
        params.w_id = w_id;
        NetMgr.sendMsg(params);
    }
    /**
     * 单词详情
     * 响应
     * @param data 
     * @returns 
     */
    onWordDetail(data:any){
        console.log("onWordDetail....",data);
        if(data.code !== 200) {
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_Word, data);
    }
    /**
     * 切换教材
     * 请求
     * @param data 
     */
    reqChangeTextbook(book_id: string) {
        let params: c2sChangeTextbook = new c2sChangeTextbook();
        params.book_id = book_id;
        NetMgr.sendMsg(params);
    }
    /**
     * 切换教材
     * 响应
     * @param data 
     * @returns 
     */
    onChangeTextbook(data: any) {
        console.log("onChangeTextbook", data);
        if (data.code !== 200) {
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_ChangeTextbook, data);
    }
    /**
     * 单词提交
     * 请求
     * @param data 
     */
    reqGameSubmit(data:GameSubmitModel){
        let params:c2sGameSubmit = new c2sGameSubmit();
        params.word = data.word;
        params.book_id = data.book_id;
        params.cost_time = data.cost_time;
        params.unit_id = data.unit_id;
        params.game_mode = data.game_mode;
        params.small_id = data.small_id;
        params.status = data.status;
        if(isValid(data.score)){
            params.score = data.score;
        }
        console.log(params);
        NetMgr.sendMsg(params);
    }
    /**
     * 单词提交
     * 响应
     * @param data 
     * @returns 
     */
    onGameSubmit(data:any){
        console.log("onGameSubmit.....",data);
        if(data.code !== 200){
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_GameSubmit, data);
    }
    /**
     * 词表单词列表
     * 请求
     * @param data 
     */
    reqCheckWord(data:CheckWordModel){
        let params:c2sCheckWord = new c2sCheckWord();
        params.book_id = data.book_id;
        params.word_type = data.word_type;
        params.order_type = data.order_type;
        NetMgr.sendMsg(params);
    }
    /**
     * 词表单词列表 
     * 响应
     */
    onCheckWord(data:any){
        console.log("onGameSubmit.....",data);
        if(data.code !== 200){
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_CheckWord, data);
    }
    /**教材单词分类词汇列表接口 
     * 请求
     */
    reqVocabularyWord(param: ReqUnitStatusParam) {
        let params: c2sVocabularyWord = new c2sVocabularyWord();
        params.book_id = param.book_id;
        params.unit_id = param.unit_id;
        params.small_id = param.small_id;
        NetMgr.sendMsg(params);
    }
    /**
     * 教材单词分类词汇列表接口 
     * 响应
     * @param data 
     * @returns 
     */
    onVocabularyWord(data: any) {
        console.log("onVocabularyWord", data);
        if (data.code !== 200) {
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_VocabularyWord, data);
    }
    /**
     * 请求收藏与移除
     * req
     * @param param 
     */
    reqCollectWord(data:ReqCollectWord){
        let params:c2sCollectWord = new c2sCollectWord();
        params.word = data.word;
        params.book_id = data.book_id;
        params.unit_id = data.unit_id;
        params.action = data.action;
        NetMgr.sendMsg(params);
    }
    /**
     * 收藏与移除
     * response
     */
    onCollectWord(data:any){
        console.log("onCollectWord",data);
        if(data.code !== 200){
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(NetNotify.Classification_CollectWord, data);
    }
};

export const TBServer = _TextbookService.getInstance();
