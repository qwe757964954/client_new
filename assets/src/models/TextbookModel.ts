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
    dataArr:BookItemData[]
}


export interface BookItemData {
    name:string,
    num:number,
    sort_no:number,
    type_name:string
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
    data:UnitItemStatus[];
}

export interface UnitItemStatus{
    num:number,
    unit:string,
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
    type_name:string;
    book_name:string;
    grade:string;
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

export class c2sBookAwardList {
    command_id: string = InterfacePath.Classification_BookAwardList;
    type_name:string;
    book_name:string;
}

