import { ItemData } from "../manager/DataMgr";
import { InterfacePath } from "../net/InterfacePath";
import { BaseRepPacket } from "./NetModel";
import { UnitWordModel } from "./TextbookModel";

export enum GameMode {
    Study = 0, //导学
    WordMeaning = 7,  //词意
    Practice = 3, //练习
    Spelling = 1, //拼写
    Reading = 4,  //阅读
    Exam = 2,    //考试
    WordBoss = 5, //BOSS关卡
}

export enum QuestionKind {
    Choice = 1, //选择题
    FillInBlank = 2, //填空题
    JudgeAnswer = 3, //判断题
    SortAnswer = 4, //排序题
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
    phase_id:number;
}

//大冒险_年级选择与修改
export class c2sWordGameGradeModify {
    command_id: string = InterfacePath.WordGameGradeModify;
    phase_id:number;
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
    monster_id?: number;
    star_one_reward?: ItemData[];
    star_two_reward?: ItemData[];
    star_three_reward?: ItemData[];
    pass_reward?: ItemData[];
    random_reward?: ItemData[];
    
}

export class BossLevelData {
    bigId: number;
    bossAni: string;
    bossName: string;
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

    gate_list: GateData[];
    progress_reward_list: ProgressRewardData[];
    gate_total_num: number;
    gate_pass_num: number;
}

export interface MicroListItem {
    big_id: number;
    small_id: number;
    micro_id: number;
    flag: number;
    can_play: number;
    flag_info?: any;
}

export interface GateData {
    big_id: number;
    small_id: number;
    unit: string;
    subject_id: number;
    monster_id: number;
    star_one_reward: ItemData[];
    star_two_reward: ItemData[];
    star_three_reward: ItemData[];
    pass_reward: ItemData[];
    random_reward: ItemData[];
    flag: number;
    can_play: number;
    flag_info?: any;
    current_mode: number;
    progressData: LevelProgressData;
    error_num: number;
    game_modes?: number;
}

export interface ProgressRewardData {
    big_id: number;
    pass_count: number;
    pass_reward: ItemData[];
    open: number; //1领取过 0 未领取过
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
}

export class WordGameWordsData extends BaseRepPacket {
    data: UnitWordModel[];
}

//获取单词详情
export class c2sAdventureWord {
    command_id: string = InterfacePath.Adventure_Word;
    w_id: string;
}

//查询单词
export class c2sSearchWord {
    command_id: string = InterfacePath.Search_Word;
    word: string;
}

//总词收藏与取消收藏单词
export class c2sTotalCollectWord {
    command_id: string = InterfacePath.Total_Collect_Word;
    word: string;
    status: number;
}

//单词更多详情消息
export class c2sMoreWordDetail {
    command_id: string = InterfacePath.More_Word_Detail;
    word: string;
}


export class WordsDetailData extends BaseRepPacket {
    w_id?: string; //单词id
    word: string;
    cn: string; //单词释义
    c_id?: string;
    collect?: number;
    symbol: string;    //音标
    symbolus: string;  //美式音标
    syllable: string;  //音素拆分
    phonic: string;    //自然拼读拆分
    example: string;
    example_cn: string;
    etyma: string;      //词根
    ancillary: string;  //助记
    speech: { sp: string, tr: string }[];
    sentence_list?: SentenceData[];
    similar_list?: { word: string, cn: string }[];
    variant?: any;
    structure?: any;
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
    award_info?: any;
    flag_star_num: number;
    flag_info?: {
        star_one?: number;
        star_three?: number;
        star_two?: number
    };
    word: string;
    star_num?: number
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
}

//教材单词获取组合模式选项
export class c2sTextbookWordGroup {
    command_id: string = InterfacePath.Classification_WordGroup;
    book_id: string;
    unit_id: string;
}
export class c2sAdventureCollectWord {
    command_id: string = InterfacePath.Classification_AdventureCollectWord;
    w_id: string
    action: number;
}

export interface AdventureCollectWordModel {
    w_id: string;
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
    subject_id: number;
    category?: number;
}

export class LevelProgressData extends BaseRepPacket {
    big_id: number;
    small_id: number;
    subject_id: number;
    game_mode: number;
    flag: number;
    pass_num: number;
    word_num: number;
    error_word: any;
    time_remaining: number;
    cost_time: number;
    err_num: number;
    word_list: UnitWordModel[];
}

export class c2sBossLevelTopic {
    command_id: string = InterfacePath.BossLevel_Topic;
    big_id: number;
}

export class BossTopicData {
    w_id: string;
    word: string;
    cn: string;
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
    opt_num: number;
    sentence: string;
    speech: string;
    gs_id: string;
    symbol: string;
}

export class ChallengeInfo {
    bl_id: string;
    user_id: number;
    need_num: number;
    word_num: number;
    err_num: number;
    challenge_num: number
    cost_time: number;
    w_id_list: string[];
    word_list: BossTopicData[];
}

export class BossLevelTopicData extends BaseRepPacket {
    big_id: number;
    challenge_info: ChallengeInfo;
}

export class c2sBossLevelSubmit {
    command_id: string = InterfacePath.BossLevel_Submit;
    big_id: number;
    bl_id: string; //挑战id
    w_id: string; //题目id
    status: number; //状态 1 成功 2 错误 3 超时
    option: string; //选择的内容 如果3，则为空字符串
    cost_time: number; //耗时
}

export class BossLevelSubmitData extends BaseRepPacket {
    flag: number;
    award_info: any;
}
//boss关卡重新开始
export class c2sBossLevelRestart {
    command_id: string = InterfacePath.WordBossGame_Restart;
    big_id: number;
    bl_id: string;
}

//获取岛屿进度奖励
export class c2sGetProgressReward {
    command_id: string = InterfacePath.Progress_RewardGet;
    big_id: number;
    pass_count: number;
}
export class ProgressRewardReply extends BaseRepPacket {
    pass_reward: ItemData[];
}

//获取单元列表
export class c2sGetUnitList {
    command_id: string = InterfacePath.WordGame_UnitList;
    big_id: number;
}
export class UnitListData extends BaseRepPacket {
    unit_info_dict: any;
}
export class UnitData {
    big_id: number;
    unit: string;
    status: number;
}

//关卡重新开始
export class c2sWordGameLevelRestart {
    command_id: string = InterfacePath.WordGame_LevelRestart;
    big_id: number;
    small_id: number;
}
export class LevelRestartData extends BaseRepPacket {

}

//获取大冒险单元单词
export class c2sWordGameUnitWords {
    command_id: string = InterfacePath.WordGame_UnitWords;
    big_id: number;
    unit: string;
}
export class WordGameUnitWordReply extends BaseRepPacket {
    word_list: UnitWord[] = [];
}
export class UnitWord {
    w_id: string;
    big_id: number;
    small_id: number;
    subject_id: number;
    word: string;
    cn: string;
    image_url: string;
    symbol: string;
}

//获取大冒险主题
export class c2sWordGameSubject {
    command_id: string = InterfacePath.WordGame_Subject;
    subject_id: number;
}
export class WordGameSubjectReply extends BaseRepPacket {
    subject: Subject;
    word_list: UnitWord[];
}
export class Subject {
    big_id: number;
    subject_id: number;
    subject_name: string;
    sentence_knowledge: string[];
    dialogue_content: string[];
    is_unit?: boolean = false;
    status?: number;
}

//大冒险主题ai文章列表
export class c2sSubjectArticleList {
    command_id: string = InterfacePath.Subject_ArticleList;
    subject_id: number;
}
export class SubjectArticleListReply extends BaseRepPacket {
    article_list: Article[];
}
export class Article {
    article_id: number;
    subject_id: number;
    article: string;
    create_time: string;
}

//大冒险文章题目列表
export class c2sArticleExercisesList {
    command_id: string = InterfacePath.Article_ExercisesList;
    subject_id: number;
    article_id?: number;
}
export class ArticleExercisesListReply extends BaseRepPacket {
    exercises_list: ArticleExercise[];
}
export class ArticleExercise {
    se_id: string;
    content: string; //题目
    answer: string; //答案
    options: string[]; //错误选项
    kind: number; //练习题目类型 1 选择题 2 填空题 3 判断题 4排序题
    source: number; //来源
    article_id: number; //文章id
    subject_id: number; //主题id
    create_time: string;
}

//大冒险跳级题目列表
export class c2sGradeSkipExercisesList {
    command_id: string = InterfacePath.GradeSkip_ExercisesList;
    big_id: number;
    unit: string;
}
export class GradeSkipExercisesListReply extends BaseRepPacket {
    unit_word_list: UnitWord[];
    unit_group_list: UnitGroup[];
    unit_exercises_list: ArticleExercise[];
}
export class UnitGroup {
    word: string;
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
    opt_num: number;
    sentence: string;
    cn: string;
    speech: string;
    gs_id: number;
}

//跳级练习结果提交
export class c2sGradeSkipExercisesSubmit {
    command_id: string = InterfacePath.GradeSkip_ExercisesSubmit;
    big_id: number;
    unit: string;
    status: number;
}
export class GradeSkipExercisesSubmitReply extends BaseRepPacket {
    small_id_list: number[];
}

// Define an interface for the objects in the data array
export interface LandDataItem {
    big_id: number;
    status: number;
    flag: number;
}

// Define an interface for the top-level response
export interface LandStatusResponse extends BaseRepPacket{
    data: LandDataItem[];  // Array of LandDataItem
}