import { InterfacePath } from "../net/InterfacePath";
import { BaseRepPacket } from "./NetModel";

export interface MyTextbookListStatus extends BaseRepPacket{
    data:MyTextbookStatus[];
}

/**我的词书数据 */
export interface MyTextbookStatus {
    book_name: string,
    grade: string,
    score: number,
    study_word_num: number,
    total_score: number,
    total_word_num: number,
    type_name: string,
    unit:string,
    user_id:number,
} 

export interface BookListItemData extends BaseRepPacket{
    data:BookItemData[]
}


export interface BookItemData {
    name?:string,
    num?:number,
    sort_no?:number,
    type_name?:string
}

export interface SchoolBookListItemData extends BaseRepPacket{
    data:SchoolBookItemData[];
}

export interface SchoolBookItemData{
    book_name:string,
    num:number,
}

export interface SchoolBookListGradeItemData extends BaseRepPacket{
    data:SchoolBookGradeItemData[];
}

export interface SchoolBookGradeItemData{
    grade:string,
    num:number,
}

export interface UnitListItemStatus extends BaseRepPacket{
    unit_list:UnitItemStatus[];
    gate_total:number,
}


export interface UnitItemStatus{
    num:number,
    unit:string,
    gate_list:GateListItem[];
}

export interface GateListItem{
    small_id:number,
}

// 我的词书
export class c2sBookStatus {
    command_id: string = InterfacePath.Classification_BookStatus;
}

// 删除我的词书
export class c2sDelBookStatus {
    command_id: string = InterfacePath.Classification_BookDel;
    type_name:string;
    book_name:string;
    grade:string;
}
//添加我的词书

export class c2sAddBookStatus {
    command_id: string = InterfacePath.Classification_BookAdd;
    type_name:string;
    book_name:string;
    grade:string;
}

//添加计划

export class c2sAddPlanStatus {
    command_id: string = InterfacePath.Classification_PlanAdd;
    type_name:string;
    book_name:string;
    grade:string;
    rank_num:number;
    num:number;
}

//添加书附带添加计划
export class c2sAddPlanBookStatus {
    command_id: string = InterfacePath.Classification_AddPlanBook;
    type_name:string;
    book_name:string;
    grade:string;
    rank_num:number;
    num:number;
}

//修改计划

export class c2sModifyPlanStatus {
    command_id: string = InterfacePath.Classification_PlanModify;
    plan_id:string;
    rank_num:number;
    num:number;
}


//获取分类汇总列表
export class c2sSearchBookList{
    command_id: string = InterfacePath.Classification_List;
}

//获取教材课本
export class c2sSchoolBook{
    command_id: string = InterfacePath.Classification_SchoolBook;
    type_name:string;
}
//教材课本-年级
export class c2sSchoolBookGrade{
    command_id: string = InterfacePath.Classification_SchoolGrade;
    type_name:string;
    book_name:string;
}

//书年级单元列表

export class c2sUnitListStatus{
    command_id:string = InterfacePath.Classification_UnitListStatus;
    type_name:string;
    book_name:string;
    grade:string;
}
//添加计划请求model
export interface ReqPlanData{
    type_name:string;
    book_name:string;
    grade:string;
    rank_num:number;
    num:number;
}

//修改计划请求model
export interface ModifyPlanData{
    plan_id:string;
    rank_num:number;
    num:number;
}

//我的词书——书对应计划详情

export class c2sBookPlanDetail {
    command_id: string = InterfacePath.Classification_BookPlanDetail;
    type_name:string;
    book_name:string;
    grade:string;
}

export interface BookPlanDetail extends BaseRepPacket{
    book_name:string;
    grade:string;
    id:string;
    num:number;
    rank_num:number;
    type_name:string;
    user_id:number;
}

export interface ReqUnitStatusParam{
    type_name:string;
    book_name:string;
    grade:string;
    unit:string;
    small_id:number;
}

//我的单词--词书年级单元学习情况列表接口
export class c2sUnitStatus {
    command_id: string = InterfacePath.Classification_UnitStatus;
    type_name:string;
    book_name:string;
    grade:string;
    unit:string;
    small_id:number;
}

export interface UnitStatusData extends BaseRepPacket{
    type_name:string;
    book_name:string;
    grade:string;
    unit:string;
    small_id:number;
    user_id:number;
    user_name:string;
    game_mode:number;
    flag:number;
    word_num:number;
}

export interface UnitWordModel{
    cn:string;
    phonic:string;
    syllable:string;
    symbol:string;
    symbolus:string;
    word:string;
}

export class c2sBookAwardList {
    command_id: string = InterfacePath.Classification_BookAwardList;
    type_name:string;
    book_name:string;
}

export interface BookAwardListModel extends BaseRepPacket{
    study_num:number;
    study_word_num:number;
    total_num:number;
    total_word_num:number;
    awards_list:AwardListItem[];
}

export interface AwardListItem {
    awards:AwardItem;
    num:number;
    rec_flag:number;
}

export  interface AwardItem {
    coin:number;
    diamond:number;
    random_props:RandomPropsData;
}

export interface RandomPropsData {
    change:number;
    prop_id:number;
    rat:number;
}

export class c2sCurrentBook {
    command_id: string = InterfacePath.Classification_CurrentBook;
}



export interface CurrentBookStatus extends BaseRepPacket {
    user_id?:number;
    book_name?:string;
    type_name?:string;
    grade?:string;
    unit?:string;
    status?:number;
    score?:number;
    total_score?:number;
    study_word_num?:number;
    total_word_num?:number;
    id?:string;
    num?:number;
    rank_num?:number;
    unit_pass_num?:number;
    unit_total_num?:number;
}

export interface ReportResultModel{ 
    type_name:string;
    book_name:string;
    grade:string;
    unit:string;
    game_mode:number;
}

export class c2sReportResult {
    command_id: string = InterfacePath.Classification_ReportResult;
    type_name:string;
    book_name:string;
    grade:string;
    unit:string;
    game_mode:number;
}

export class c2sWordDetail {
    command_id: string = InterfacePath.Classification_Word;
    c_id:string;
    word:string;
}

export interface WordDetailStatus extends BaseRepPacket {
    ancillary?:string;
    cn?:string;
    etyma?:string;
    example?:string;
    example_cn?:string;
    phonic?:number;
    sentence_list?:any[];
    similar_list?:number;
    speech?:number;
    structure?:any;
    syllable:string;
    symbol:string;
    symbolus:string;
    variant:any;
    word:string;
}
export class c2sChangeTextbook {
    command_id: string = InterfacePath.Classification_ChangeTextbook;
    type_name:string;
    book_name:string;
    grade:string;
}

export class c2sGameSubmit {
    command_id: string = InterfacePath.Classification_GameSubmit;
    word:string;
    type_name:string;
    book_name:string;
    grade:string;
    cost_time:number;
    unit:string;
    small_id:number;
    game_mode:number;
    word_flag:number;
    score:string;
}

export interface GameSubmitModel {
    word:string;
    type_name:string;
    book_name:string;
    grade:string;
    cost_time:number;
    unit:string;
    small_id:number;
    game_mode:number;
    word_flag:number;
    score?:string;
}

// export enum AmoutType {
//     Coin= 0,/**金币 */
//     Diamond= 1,/**钻石 */
//     Energy= 2/**体力 */
// }


export enum CheckWordType {
    AllWord=1, /**全部单词 */
    Learned=2, /**已学单词 */
    NotLearned=3, /**未学单词 */
    Collect=4,/**收藏单词 */ 
} 

export enum CheckOrderType {
    UnitSortOrder=1,/**单元排序正序 */
    UnitReverseOrder=2,/**单元排序倒序 */
    LearningTimeOrder=3,/**学习时间正序 */
    LearningReverseOrder=4,/**学习时间倒序 */
    AlphabeticalOrder=5,/**字母正序 */
    AlphabeticalReverseOrder=6,/**字母倒序 */
}

export interface CheckWordModel {
    type_name:string;
    book_name:string;
    grade:string;
    word_type:CheckWordType;
    order_type:CheckOrderType;
}

export class c2sCheckWord {
    command_id: string = InterfacePath.Classification_CheckWord;
    grade:string;
    type_name:string;
    book_name:string;
    word_type:CheckWordType;
    order_type:CheckOrderType;
}

export interface CheckWordResponse extends BaseRepPacket{
    data:CheckWordItem[];
}

export interface CheckWordItem {
    cn:string;
    phonic:string;
    syllable:string;
    symbol:string;
    symbolus:string;
    unit:string;
    word:string;
}

export class c2sVocabularyWord {
    command_id: string = InterfacePath.Classification_VocabularyWord;
    grade:string;
    type_name:string;
    book_name:string;
    unit:string;
    small_id:number;
}

export interface VocabularyWordData extends BaseRepPacket{
    data:UnitWordModel[];
}

export interface ReqCollectWord {
    word?:string;
    c_id?:string;
    action:number;
}

export class c2sCollectWord {
    command_id: string = InterfacePath.Classification_CollectWord;
    word?:string;
    c_id?:string;
    action:number;
}

export interface CollectWordData extends BaseRepPacket{

}

