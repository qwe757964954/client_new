export interface VocabularyChildNode {
    Id?: number;
    PId?: number;
    Name?: string;
    VideoUrl?: string | null;
    SubFlag?: number;
    SortNo?: number | null;
    Difficulty?: number | null;
    Score?: number | null;
    isSum?: boolean;
}

export interface VocabularyParentNode {
    Id: number;
    PId: number;
    Name: string;
    VideoUrl: string | null;
    SubFlag: number;
    SortNo: number | null;
    ChildNodes: VocabularyChildNode[];
    Score: number;
    CompStatus: number;
}

export interface ResponseData {
    Code: number;
    Data: VocabularyParentNode[];
    Msg: string;
    Path: string;
}