import { InterfacePath } from "../net/InterfacePath";
import { BaseRepPacket } from "./NetModel";
import { UnitWordModel } from "./TextbookModel";

export enum GameMode {
    Study = 0, //导学
    WordMeaning = 7,  //词意
    Practice = 3, //练习
    Spelling = 1, //拼写
    Reading = 4,  //阅读
    Exam = 2    //考试
}

export class SentenceData {
    id: string;
    cn: string;
    sentence: string;
}

//大冒险岛屿状态
export class c2sIslandStatus {
    command_id: string = InterfacePath.Island_Status;
    big_id: number;
}

export class IslandStatusModel {
    flag: number;
    micros: { game_modes: string, micro_id: number }[]; //小关数据
    small_id: number;
    small_type: number; //关卡类型
}

export class MapLevelData {
    flag?: number;
    big_id: number;
    small_id: number;
    micro_id: number;
    small_type?: number;
    game_modes?: string;
    current_mode?: number;
}

export class IslandStatusData extends BaseRepPacket {
    data: IslandStatusModel[];
}

//大冒险岛屿进度
export class c2sIslandProgress {
    command_id: string = InterfacePath.Island_Progress;
    big_id: number;
}

export class IslandProgressData {
    small_id: number;
    micro_id: number;
    game_mode: number;
}

export class IslandProgressModel extends BaseRepPacket {

}

//单词大冒险获取单词数据
export class c2sWordGameWords {
    command_id: string = InterfacePath.WordGame_Words;
    big_id: number;
    small_id: number;
    micro_id: number;
    game_mode: number;
}

export class WordGameWordsData extends BaseRepPacket {
    data: UnitWordModel[];
}

//获取单词详情
export class c2sAdventureWord {
    command_id: string = InterfacePath.Adventure_Word;
    word: string;
}

export class WordsDetailData extends BaseRepPacket {
    word: string;
    cn: string; //单词释义
    c_id:string;
    collect_flag:number; 
    symbol: string;    //音标
    symbolus: string;  //美式音标
    syllable: string;  //音素拆分
    phonic: string;    //自然拼读拆分
    example: string;
    example_cn: string;
    etyma: string;      //词根
    ancillary: string;  //助记
    speech: string;
    sentence_list: SentenceData[];
    similar_list: { word: string, cn: string }[];
    variant: any;
    structure: any;
}

//大冒险结果提交
export class c2sAdventureResult {
    command_id: string = InterfacePath.Adventure_Result;
    big_id: number;
    small_id: number;
    micro_id: number;
    game_mode: number;
    cost_time: number;
}
//大冒险结果提交返回
export class s2cAdventureResult extends BaseRepPacket {
    data: { pass_num: number };
}