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