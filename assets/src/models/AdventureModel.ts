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
    word: string;
    match_mean: string;
    source: string;
}

//大冒险岛屿状态
export class c2sIslandStatus {
    command_id: string = InterfacePath.Island_Status;
}

export class IslandStatusModel {
    flag: number;
    micros: { game_modes: string, micro_id: number }[]; //小关数据
    small_id: number;
    small_type: number; //关卡类型
    num: number;
}

export class MapLevelData {
    flag?: number;
    big_id: any;
    small_id: number;
    micro_id: number;
    small_type?: number;
    game_modes?: string;
    current_mode?: number;
    flag_info?: any;
}

export class IslandStatusData extends BaseRepPacket {
    data: IslandStatusModel;
    num: number;
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
    micro_list: MicroListItem[];
    micro_total_num: number;
    micro_pass_num: number;
    // code: number;
    // msg: string;
}

export interface MicroListItem {
    big_id: number;
    small_id: number;
    micro_id: number;
    flag: number;
    can_play: number;
    flag_info?: any;
}

export interface MicroData {
    micro_list: MicroListItem[];
    micro_total_num: number;
    micro_pass_num: number;
    code: number;
    msg: string;
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
    big_id: number;
    small_id: number;
    micro_id: number;
}

export class WordsDetailData extends BaseRepPacket {
    word: string;
    cn: string; //单词释义
    c_id?: string;
    collect_flag: number;
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
    status: number;
    score?: number;
    word: string;
}

export interface AdventureResultModel {
    big_id: number;
    small_id: number;
    micro_id: number;
    game_mode: number;
    cost_time: number;
    status: number;
    score?: number;
    word: string;
}

//大冒险结果提交返回
export class AdventureResult extends BaseRepPacket {
    pass_flag: number;
    award?: any;
    flag_star_num: number;
    word: string;
}

//组合模式拆分数据
export class WordGroupModel {
    word: string;
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
    opt_num: number;
}

export class WordGroupData extends BaseRepPacket {
    data: WordGroupModel[];
}

//大冒险获取组合模式选项
export class c2sWordGroup {
    command_id: string = InterfacePath.Words_Group;
    big_id: number;
    small_id: number;
    micro_id: number;
}

//教材单词获取组合模式选项
export class c2sTextbookWordGroup {
    command_id: string = InterfacePath.Classification_WordGroup;
    type_name: string;
    book_name: string;
    grade: string;
    unit: string;
}
export class c2sAdventureCollectWord {
    command_id: string = InterfacePath.Classification_AdventureCollectWord;
    big_id: number;
    small_id: number;
    micro_id: number;
    action: number;
}

export interface AdventureCollectWordModel {
    big_id: number;
    small_id: number;
    micro_id: number;
    action: number;
}

export class c2sAdventureWordSentence {
    command_id: string = InterfacePath.WordGame_Sentence;
    word: string;
}

export class AdventureWordSentenceData extends BaseRepPacket {
    data: SentenceData;
}

export class c2sAdvLevelProgress {
    command_id: string = InterfacePath.Adventure_LevelProgress;
    big_id: number;
    small_id: number;
    micro_id: number;
}

export class LevelProgressData extends BaseRepPacket {
    big_id: number;
    small_id: number;
    micro_id: number;
    game_mode: number;
    flag: number;
    pass_num: number;
    word_num: number;
    error_word: any;
    time_remaining: number;
}
