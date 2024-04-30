import { InterfacePath } from "../net/InterfacePath";
import { BaseRepPacket } from "./NetModel";
/**我的词书数据 */
export interface MyTextbookStatus {
    AccountId: number,
    BookName: string,
    Grade: string,
    Score: number,
    StudyWordNum: number,
    TotalScore: number,
    TotalWordNum: number,
    TypeName: string,
    createtime:string,
    id:number,
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
export interface UnitListItemStatus{
    GameModes:string,
    Id:number,
    bookname:string,
    grade:string,
    score:number,
    studywordnum:number,
    totalwordnum:number,
    typename:string,
    unit:string,
}

// 我的词书
export class c2sBookStatus {
    Path: string = InterfacePath.Classification_BookStatus;
}

// 删除我的词书
export class c2sDelBookStatus {
    Path: string = InterfacePath.Classification_BookDel;
    TypeName:string;
    BookName:string;
    Grade:string;
}
//添加我的词书

export class c2sAddBookStatus {
    Path: string = InterfacePath.Classification_BookAdd;
    TypeName:string;
    BookName:string;
    Grade:string;
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
    Path:string = InterfacePath.Classification_UnitListStatus;
    TypeName:string;
    BookName:string;
    Grade:string;
}