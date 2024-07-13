import { InterfacePath } from "../net/InterfacePath";
import { BaseRepPacket } from "./NetModel";

export interface MyTextbookListStatus extends BaseRepPacket {
    data: MyTextbookStatus[];
}

/**我的词书数据 */
export interface MyTextbookStatus {
    book_id: string;          // Unique identifier for the book
    book_name: string;        // Name of the book
    grade: string;            // Grade level (e.g., "二上")
    num: number;              // A numerical value (context not specified)
    phase_id: number;         // Identifier for the phase
    remainder_num: number;    // Number of remaining items (context not specified)
    status: number;           // Status code (e.g., 1 for active)
    study_word_num: number;   // Number of studied words
    total_word_num: number;   // Total number of words
    user_id: number;          // Identifier for the user
}

export interface BookListItemData extends BaseRepPacket {
    data: BookItemData[]
}


export interface BookItemData {
    name?: string,
    num?: number,
    sort_no?: number,
    type_name?: string,
    phase_id?: number
}

export interface SchoolBookListItemData extends BaseRepPacket {
    data: SchoolBookItemData[];
}

export interface SchoolBookItemData {
    book_name: string,
    num: number,
}

export interface SchoolBookListGradeItemData extends BaseRepPacket {
    data: SchoolBookGradeItemData[];
}

export interface SchoolBookGradeItemData {
    book_id: string,
    book_name: string,
    grade: string,
    num: number,
}
export interface UnitListItemStatus extends BaseRepPacket {
    unit_list: UnitItemStatus[];
    gate_total: number,
}


export interface UnitItemStatus {
    num: number,
    unit_id: string,
    unit_name: string,
    gate_list: GateListItem[];
}

export interface GateListItem {
    small_id: number,
    flag: number,
    flag_info: any,
}

// 我的词书
export class c2sBookStatus {
    command_id: string = InterfacePath.Classification_BookStatus;
}

// 删除我的词书
export class c2sDelBookStatus {
    command_id: string = InterfacePath.Classification_BookDel;
    book_id: string;
}

//添加书附带添加计划
export class c2sAddPlanBookStatus {
    command_id: string = InterfacePath.Classification_AddPlanBook;
    book_id: string;
    num: number;
}

//修改计划

export class c2sModifyPlanStatus {
    command_id: string = InterfacePath.Classification_PlanModify;
    cu_id: string;
    num: number;
}


//获取分类汇总列表
export class c2sSearchBookList {
    command_id: string = InterfacePath.Classification_List;
}

//获取教材课本
export class c2sSchoolBook {
    command_id: string = InterfacePath.Classification_SchoolBook;
    phase_id: number;
}
//教材课本-年级
export class c2sSchoolBookGrade {
    command_id: string = InterfacePath.Classification_SchoolGrade;
    phase_id: number;
    book_name: string;
}

//书年级单元列表

export class c2sUnitListStatus {
    command_id: string = InterfacePath.Classification_UnitListStatus;
    book_id: string;
}
//添加计划请求model
export interface ReqPlanData {
    book_id: string;
    num: number;
}

//修改计划请求model
export interface ModifyPlanData {
    cu_id: string;
    num: number;
}

//我的词书——书对应计划详情

export class c2sBookPlanDetail {
    command_id: string = InterfacePath.Classification_BookPlanDetail;
    book_id: string;
}

export interface BookPlanDetail extends BaseRepPacket {
    book_id: string;
    cu_id: string;
    num: number;
    user_id: number;
    gate_total: number;
}

export interface ReqUnitStatusParam {
    book_id: string
    unit_id: string;
    small_id: number;
    category?: number;
}

export enum ReqUnitType {
    Normal = 1,/**常规 */
    Test = 2,/**测评 */
}

//我的单词--词书年级单元学习情况列表接口
export class c2sUnitStatus {
    command_id: string = InterfacePath.Classification_UnitStatus;
    book_id: string;
    unit_id: string;
    small_id: number;
    category?: number;
}

export interface UnitStatusData extends BaseRepPacket {
    book_id: string;            // Unique identifier for the book
    error_num: number;
    error_word: any;  // An object for errors, assuming it's a flexible structure
    flag: number;               // A numerical flag
    game_mode: number;          // Game mode identifier
    pass_num: number;           // Number of passes
    small_id: number;           // Identifier for a smaller unit or sub-id
    time_remaining: number;     // Time remaining, possibly in seconds
    unit_id: string;            // Unique identifier for the unit
    unit_name: string;          // Name of the unit
    word_num: number;           // Number of words
}


export interface UnitWordModel {
    book_id: string;
    cn: string;
    phonic: string;
    syllable: string;
    symbol: string;
    symbolus: string;
    unit_id: string;
    w_id: string;
    word: string;
}

export class c2sBookAwardList {
    command_id: string = InterfacePath.Classification_BookAwardList;
    type_name: string;
    book_name: string;
}

export interface BookAwardListModel extends BaseRepPacket {
    study_num: number;
    study_word_num: number;
    total_num: number;
    total_word_num: number;
    awards_list: AwardListItem[];
}

export interface AwardListItem {
    awards: AwardItem;
    num: number;
    rec_flag: number;
}

export interface AwardItem {
    coin: number;
    diamond: number;
    random_props: RandomPropsData;
}

export interface RandomPropsData {
    change: number;
    prop_id: number;
    rat: number;
}

export class c2sCurrentBook {
    command_id: string = InterfacePath.Classification_CurrentBook;
}



export interface CurrentBookStatus extends BaseRepPacket {
    book_id: string;           // "c35b5822693fb6ca584cf7c1a500a7c3"
    book_name: string;         // "人教版新起点"
    gate_pass_num: number;     // 0
    gate_total_num: number;    // 9
    grade: string;             // "一下"
    phase_id: number;          // 10006
    status: number;            // 1
    study_word_num: number;    // 0
    total_word_num: number;    // 45
    unit_pass_num: number;     // 0
    unit_total_num: number;    // 6
    user_id: number;           // 4
}

export interface ReportResultModel {
    type_name: string;
    book_name: string;
    grade: string;
    unit: string;
    game_mode: number;
}

export class c2sReportResult {
    command_id: string = InterfacePath.Classification_ReportResult;
    type_name: string;
    book_name: string;
    grade: string;
    unit: string;
    game_mode: number;
}

export class c2sWordDetail {
    command_id: string = InterfacePath.Classification_Word;
    w_id: string;
}

export interface ReqWordDetail {
    book_id: string;
    unit_id: string;
    word: string;
}

export interface WordDetailStatus extends BaseRepPacket {
    ancillary?: string;
    cn?: string;
    etyma?: string;
    example?: string;
    example_cn?: string;
    phonic?: number;
    sentence_list?: any[];
    similar_list?: number;
    speech?: number;
    structure?: any;
    syllable: string;
    symbol: string;
    symbolus: string;
    variant: any;
    word: string;
}
export class c2sChangeTextbook {
    command_id: string = InterfacePath.Classification_ChangeTextbook;
    book_id: string;
}

export class c2sGameSubmit {
    command_id: string = InterfacePath.Classification_GameSubmit;
    word: string;
    book_id: string;
    cost_time: number;
    unit_id: string;
    small_id: number;
    game_mode: number;
    status: number;
    score?: number;
}

export interface GameSubmitResponse extends BaseRepPacket {
    award_info?: any;
    flag_info?: {
        star_one?: number;
        star_three?: number;
        star_two?: number
    };
    pass_flag?: number;
    word?: string;
}

export interface GameSubmitModel {
    word: string;
    book_id: string;
    cost_time: number;
    unit_id: string;
    small_id: number;
    game_mode: number;
    status: number;
    score?: number;
}

// export enum AmoutType {
//     Coin= 0,/**金币 */
//     Diamond= 1,/**钻石 */
//     Energy= 2/**体力 */
// }


export enum CheckWordType {
    AllWord = 1, /**全部单词 */
    Learned = 2, /**已学单词 */
    NotLearned = 3, /**未学单词 */
    Collect = 4,/**收藏单词 */
}

export enum CheckOrderType {
    UnitSortOrder = 1,/**单元排序正序 */
    UnitReverseOrder = 2,/**单元排序倒序 */
    AlphabeticalOrder = 3,/**字母正序 */
    AlphabeticalReverseOrder = 4,/**字母倒序 */
    LearningTimeOrder = 5,/**学习时间正序 */
    LearningReverseOrder = 6,/**学习时间倒序 */

}

export interface CheckWordModel {
    book_id: string;
    word_type: CheckWordType;
    order_type: CheckOrderType;
}

export class c2sCheckWord {
    command_id: string = InterfacePath.Classification_CheckWord;
    book_id: string;
    word_type: CheckWordType;
    order_type: CheckOrderType;
}

export interface CheckWordResponse extends BaseRepPacket {
    data: CheckWordItem[];
}

export interface CheckWordItem {
    cn: string;
    collect:number;
    phonic: string;
    syllable: string;
    symbol: string;
    symbolus: string;
    unit_name: string;
    w_id:string;
    word: string;
}

export class c2sVocabularyWord {
    command_id: string = InterfacePath.Classification_VocabularyWord;
    book_id: string;
    unit_id: string;
    small_id: number;
}

export interface VocabularyWordData extends BaseRepPacket {
    data: UnitWordModel[];
}

export interface ReqCollectWord {
    w_id?: string;
    action: number;
}

export class c2sCollectWord {
    command_id: string = InterfacePath.Classification_CollectWord;
    w_id?: string;
    action: number;
}

export interface CollectWordData extends BaseRepPacket {

}

