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
        this.addModelListeners([
            [InterfacePath.Classification_BookStatus, this.onBookStatus],
            [InterfacePath.Classification_BookDel, this.onBookDel],
            [InterfacePath.Classification_List, this.onBookList],
            [InterfacePath.Classification_SchoolBook, this.onSchoolBook],
            [InterfacePath.Classification_SchoolGrade, this.onSchoolBookGrade],
            [InterfacePath.Classification_UnitListStatus, this.onUnitListStatus],
            [InterfacePath.Classification_PlanModify, this.onModifyPlan],
            [InterfacePath.Classification_AddPlanBook, this.onAddPlanBook],
            [InterfacePath.Classification_BookPlanDetail, this.onBookPlanDetail],
            [InterfacePath.Classification_UnitStatus, this.onUnitStatus],
            [InterfacePath.Classification_BookAwardList, this.onBookAddAwardList],
            [InterfacePath.Classification_CurrentBook, this.onCurrentBook],
            [InterfacePath.Classification_ReportResult, this.onReportResult],
            [InterfacePath.Classification_Word, this.onWordDetail],
            [InterfacePath.Classification_ChangeTextbook, this.onChangeTextbook],
            [InterfacePath.Classification_GameSubmit, this.onGameSubmit],
            [InterfacePath.Classification_CheckWord, this.onCheckWord],
            [InterfacePath.Classification_CollectWord, this.onCollectWord],
            [InterfacePath.Classification_VocabularyWord, this.onVocabularyWord]
        ]);
    }
    private addModelListeners(listeners: [string, (data: any) => void][]): void {
        for (const [path, handler] of listeners) {
            this.addModelListener(path, handler.bind(this));
        }
    }

    private handleResponse(data: any, successNotify: string): void {
        console.log(successNotify, data);
        if (data.code !== 200) {
            console.log(data.msg);
            ViewsManager.showTip(data.msg);
            return;
        }
        EventMgr.dispatch(successNotify, data);
    }

    reqBookStatus() {
        let para: c2sBookStatus = new c2sBookStatus();
        NetMgr.sendMsg(para);
    }
    onBookStatus(data: any) {
        this.handleResponse(data, NetNotify.Classification_BookStatus);
    }
    reqBookDel(data: MyTextbookStatus) {
        let param: c2sDelBookStatus = new c2sDelBookStatus();
        param.book_id = data.book_id;
        NetMgr.sendMsg(param);
    }
    onBookDel(data: any) {
        this.handleResponse(data, NetNotify.Classification_BookDel);
    }
    onBookAdd(data: any) {
        this.handleResponse(data, NetNotify.Classification_BookAwardList);
    }

    reqModifyPlan(data: ModifyPlanData) {
        let param: c2sModifyPlanStatus = new c2sModifyPlanStatus();
        param.cu_id = data.cu_id;
        param.num = data.num;
        NetMgr.sendMsg(param);
    }

    onModifyPlan(data: any) {
        this.handleResponse(data, NetNotify.Classification_PlanModify);
    }

    reqBookList() {
        let param: c2sSearchBookList = new c2sSearchBookList();
        NetMgr.sendMsg(param);
    }
    onBookList(data: any) {
        this.handleResponse(data, NetNotify.Classification_List);
    }
    reqSchoolBook(phase_id: number) {
        let param: c2sSchoolBook = new c2sSchoolBook();
        param.phase_id = phase_id;
        NetMgr.sendMsg(param);
    }
    onSchoolBook(data: any) {
        this.handleResponse(data, NetNotify.Classification_SchoolBook);
    }
    reqSchoolBookGrade(phase_id: number, BookName: string) {
        let param: c2sSchoolBookGrade = new c2sSchoolBookGrade();
        param.phase_id = phase_id;
        param.book_name = BookName;
        NetMgr.sendMsg(param);
    }
    onSchoolBookGrade(data: any) {
        this.handleResponse(data, NetNotify.Classification_SchoolGrade);
    }
    reqUnitListStatus(book_id: string) {
        console.log("reqUnitListStatus......",book_id);
        let param: c2sUnitListStatus = new c2sUnitListStatus();
        param.book_id = book_id;
        NetMgr.sendMsg(param);
    }
    onUnitListStatus(data: any) {
        this.handleResponse(data, NetNotify.Classification_UnitListStatus);
    }

    reqAddPlanBook(data: ReqPlanData) {
        let params: c2sAddPlanBookStatus = new c2sAddPlanBookStatus();
        params.book_id = data.book_id;
        params.num = data.num;
        NetMgr.sendMsg(params);
    }

    onAddPlanBook(data: any) {
        this.handleResponse(data, NetNotify.Classification_AddPlanBook);
    }
    reqBookPlanDetail(book_id: string) {
        let params: c2sBookPlanDetail = new c2sBookPlanDetail();
        params.book_id = book_id;
        NetMgr.sendMsg(params);
    }

    onBookPlanDetail(data: any) {
        this.handleResponse(data, NetNotify.Classification_BookPlanDetail);
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
        this.handleResponse(data, NetNotify.Classification_UnitStatus);
    }
    reqBookAwardList(type_name: string, book_name: string) {
        let params: c2sBookAwardList = new c2sBookAwardList();
        params.type_name = type_name;
        params.book_name = book_name;
        NetMgr.sendMsg(params);
    }
    onBookAddAwardList(data: any) {
        this.handleResponse(data, NetNotify.Classification_BookAwardList);
    }

    reqCurrentBook(){
        let params:c2sCurrentBook = new c2sCurrentBook();
        NetMgr.sendMsg(params);
    }

    onCurrentBook(data:any){
        this.handleResponse(data, NetNotify.Classification_CurrentBook);
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
        this.handleResponse(data, NetNotify.Classification_ReportResult);
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
        this.handleResponse(data, NetNotify.Classification_Word);
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
        this.handleResponse(data, NetNotify.Classification_ChangeTextbook);
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
        this.handleResponse(data, NetNotify.Classification_GameSubmit);
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
        this.handleResponse(data, NetNotify.Classification_CheckWord);
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
        this.handleResponse(data, NetNotify.Classification_VocabularyWord);
    }
    /**
     * 请求收藏与移除
     * req
     * @param param 
     */
    reqCollectWord(data:ReqCollectWord){
        let params:c2sCollectWord = new c2sCollectWord();
        params.w_id = data.w_id;
        params.action = data.action;
        NetMgr.sendMsg(params);
    }
    /**
     * 收藏与移除
     * response
     */
    onCollectWord(data:any){
        this.handleResponse(data, NetNotify.Classification_CollectWord);
    }
};

export const TBServer = _TextbookService.getInstance();
