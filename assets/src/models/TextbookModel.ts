import { InterfacePath } from "../net/InterfacePath";
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
export interface BookListItemData{
    Name:string,
    Num:number,
    SortNo:number,
    TypeName:string
}

export interface SchoolBookListItemData{
    Name:string,
    Num:number,
    SortNo:number,
    TypeName:string
}
export interface SchoolBookGradeItemData{
    Name:string,
    Num:number,
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
    Path: string = InterfacePath.Classification_List;
}

//获取教材课本
export class c2sSchoolBook{
    Path: string = InterfacePath.Classification_SchoolBook;
    TypeName:string;
}
//教材课本-年级
export class c2sSchoolBookGrade{
    Path: string = InterfacePath.Classification_SchoolGrade;
    TypeName:string;
    BookName:string;
}

//书年级单元列表

export class c2sUnitListStatus{
    Path:string = InterfacePath.Classification_UnitListStatus;
    TypeName:string;
    BookName:string;
    Grade:string;
}