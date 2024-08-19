import { isValid } from "cc";
import { EventType } from "../config/EventType";
import { WordSourceType } from "../config/WordConfig";
import { ViewsManager } from "../manager/ViewsManager";
import { AdventureCollectWordModel, AdventureResultModel, c2sAdventureCollectWord, c2sAdventureResult, c2sAdventureWord, c2sAdventureWordSentence, c2sAdvLevelProgress, c2sArticleExercisesList, c2sBossLevelRestart, c2sBossLevelSubmit, c2sBossLevelTopic, c2sGetProgressReward, c2sGetUnitList, c2sGradeSkipExercisesList, c2sGradeSkipExercisesSubmit, c2sIslandProgress, c2sIslandStatus, c2sMoreWordDetail, c2sSearchWord, c2sSubjectArticleList, c2sTextbookWordGroup, c2sTotalCollectWord, c2sWordGameGradeModify, c2sWordGameLevelRestart, c2sWordGameSubject, c2sWordGameUnitWords, c2sWordGameWords, c2sWordGroup, WordGameWordsData } from "../models/AdventureModel";
import { c2sReviewPlan, c2sReviewPlanDraw, c2sReviewPlanList, c2sReviewPlanLongTimeWords, c2sReviewPlanLongTimeWordSubmit, c2sReviewPlanOption, c2sReviewPlanStatus, c2sReviewPlanSubmit, c2sReviewPlanUpdate } from "../models/NetModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import { BaseControll } from "../script/BaseControll";
import EventManager from "../util/EventManager";

export default class StudyService extends BaseControll {
    constructor() {
        super("StudyService");
    }

    onInitModuleEvent() {
        this.addModelListener(InterfacePath.WordGame_Words, this.onWordGameWords);
        this.addModelListener(InterfacePath.Classification_AdventureCollectWord, this.onAdventureCollectWord);
    }

    //获取单个单词详情
    getAdventureWord(w_id: string) {
        let para: c2sAdventureWord = new c2sAdventureWord();
        para.w_id = w_id;
        NetMgr.sendMsg(para);
    }

    searchWord(word: string) {
        let para: c2sSearchWord = new c2sSearchWord();
        para.word = word;
        NetMgr.sendMsg(para);
    }

    moreWordDetail(word: string) {
        let para: c2sMoreWordDetail = new c2sMoreWordDetail();
        para.word = word;
        NetMgr.sendMsg(para);
    }

    totalCollectWord(word: string, status: number) {
        let para: c2sTotalCollectWord = new c2sTotalCollectWord();
        para.word = word;
        para.status = status;
        NetMgr.sendMsg(para);
    }
    //获取大冒险岛屿状态
    getIslandStatus() {
        let para: c2sIslandStatus = new c2sIslandStatus();
        NetMgr.sendMsg(para);
    }

    reqWordGameGradeModify(phase_id: number){
        let param: c2sWordGameGradeModify = new c2sWordGameGradeModify();
        param.phase_id = phase_id;
        NetMgr.sendMsg(param);
    }

    //获取大冒险岛屿进度
    getIslandProgress(bigId: number) {
        let para: c2sIslandProgress = new c2sIslandProgress();
        para.big_id = bigId;
        NetMgr.sendMsg(para);
    }

    //获取大冒险关卡单词
    getWordGameWords(bigId: number, smallId: number) {
        let para: c2sWordGameWords = new c2sWordGameWords();
        para.big_id = bigId;
        para.small_id = smallId;
        NetMgr.sendMsg(para);
    }
    onWordGameWords(data: WordGameWordsData) {
        if (data.code != 200) {
            ViewsManager.showTip(data.msg);
            return;
        }
        console.log("onWordGameWords", data);
        EventManager.emit(EventType.WordGame_Words, data.data);
    }
    /*
    export class c2sAdventureResult {
    command_id: string = InterfacePath.Adventure_Result;
    big_id: number;
    small_id: number;
    micro_id: number;
    game_mode: number;
    cost_time: number;
    status:number;
    score?: number;
    word: string;
}
    */
    //单词大冒险结果提交
    submitAdventureResult(params: AdventureResultModel) {
        let para: c2sAdventureResult = new c2sAdventureResult();
        para.big_id = params.big_id;
        para.small_id = params.small_id;
        para.game_mode = params.game_mode;
        para.cost_time = params.cost_time;
        para.status = params.status;
        para.word = params.word;
        if (isValid(params.score)) {
            para.score = params.score;
        }
        NetMgr.sendMsg(para);
    }

    //获取组合模式选项
    getWordGroup(bigId: number, smallId: number) {
        let para: c2sWordGroup = new c2sWordGroup();
        para.big_id = bigId;
        para.small_id = smallId;
        NetMgr.sendMsg(para);
    }

    //获取教材单词组合模式选项
    getTextbookWordGroup(book_id: string, unit_id: string) {
        let para: c2sTextbookWordGroup = new c2sTextbookWordGroup();
        para.book_id = book_id;
        para.unit_id = unit_id;
        NetMgr.sendMsg(para);
    }
    //大冒险收藏单词
    reqAdventureCollectWord(params: AdventureCollectWordModel) {
        let para: c2sAdventureCollectWord = new c2sAdventureCollectWord();
        para.w_id = params.w_id;
        para.action = params.action;
        NetMgr.sendMsg(para);
    }
    onAdventureCollectWord(data: any) {
        if (data.code != 200) {
            ViewsManager.showTip(data.msg);
            return;
        }
        console.log("onAdventureCollectWord", data);
        EventManager.emit(EventType.Classification_AdventureCollectWord, data);
    }

    //获取大冒险单词例句
    getAdvWordSentence(word: string) {
        let para: c2sAdventureWordSentence = new c2sAdventureWordSentence();
        para.word = word;
        NetMgr.sendMsg(para);
    }

    //获取大冒险关卡进度
    getAdvLevelProgress(big_id: number, small_id: number, subject_id: number, category: number) {
        let para: c2sAdvLevelProgress = new c2sAdvLevelProgress();
        para.big_id = big_id;
        para.small_id = small_id;
        para.subject_id = subject_id;
        para.category = category;
        NetMgr.sendMsg(para);
    }

    /**复习规划 */
    reqReviewPlan() {
        let para: c2sReviewPlan = new c2sReviewPlan();
        NetMgr.sendMsg(para);
    }
    /**复习规划更新 */
    reqReviewPlanUpdate() {
        let para: c2sReviewPlanUpdate = new c2sReviewPlanUpdate();
        NetMgr.sendMsg(para);
    }
    /**复习规划列表 */
    reqReviewPlanList(source: number, review_type: string) {
        console.log("reqReviewPlanList", source, review_type);
        let para: c2sReviewPlanList = new c2sReviewPlanList();
        para.source = source;
        para.review_type = review_type;
        NetMgr.sendMsg(para);
    }
    /**复习规划抽奖 */
    reqReviewPlanDraw(kind: number) {
        let para: c2sReviewPlanDraw = new c2sReviewPlanDraw();
        para.kind = kind;
        NetMgr.sendMsg(para);
    }
    /**复习规划状态与单词列表 */
    reqReviewPlanStatus(source: number) {
        let para: c2sReviewPlanStatus = new c2sReviewPlanStatus();
        para.source = source;
        NetMgr.sendMsg(para);
    }
    /**复习规划单词提交与结算 */
    reqReviewPlanSubmit(ws_id: string, wp_id: string, word: string, answer: string, status: number, cost_time: number) {
        console.log("reqReviewPlanSubmit", ws_id, wp_id, word, answer, status, cost_time);
        let para: c2sReviewPlanSubmit = new c2sReviewPlanSubmit();
        para.ws_id = ws_id;
        para.wp_id = wp_id;
        para.word = word;
        para.answer = answer;
        para.status = status;
        para.cost_time = cost_time;
        NetMgr.sendMsg(para);
    }
    /**复习规划选项 */
    reqReviewPlanOption(w_id: string, big_id: number, subject_id: number) {
        console.log("reqReviewPlanOption", w_id, big_id, subject_id);
        let para: c2sReviewPlanOption = new c2sReviewPlanOption();
        para.source = WordSourceType.word_game;
        para.w_id = w_id;
        para.big_id = big_id;
        para.subject_id = subject_id;
        NetMgr.sendMsg(para);
    }
    reqReviewPlanOptionEx(w_id: string, book_id: string, unit_id: string) {
        console.log("reqReviewPlanOptionEx", w_id, book_id, unit_id);
        let para: c2sReviewPlanOption = new c2sReviewPlanOption();
        para.source = WordSourceType.classification;
        para.w_id = w_id;
        para.book_id = book_id;
        para.unit_id = unit_id;
        NetMgr.sendMsg(para);
    }
    reqReviewPlanOptionEx2(word: string) {
        console.log("reqReviewPlanOptionEx2", word);
        let para: c2sReviewPlanOption = new c2sReviewPlanOption();
        para.source = WordSourceType.total;
        para.word = word;
        NetMgr.sendMsg(para);
    }
    /**复习规划长时间未复习单词 */
    reqReviewPlanLongTimeWords(source: number, book_id?: string) {
        console.log("reqReviewPlanLongTimeWords", source, book_id);
        let para: c2sReviewPlanLongTimeWords = new c2sReviewPlanLongTimeWords();
        para.source = source;
        para.book_id = book_id;
        NetMgr.sendMsg(para);
    }
    /**复习规划长时间未复习单词提交 */
    reqReviewPlanLongTimeWordSubmit(wp_id: string, word: string, answer: string, status: number, cost_time: number) {
        console.log("reqReviewPlanLongTimeWordSubmit", wp_id, word, answer, status, cost_time);
        let para: c2sReviewPlanLongTimeWordSubmit = new c2sReviewPlanLongTimeWordSubmit();
        para.wp_id = wp_id;
        para.word = word;
        para.answer = answer;
        para.status = status;
        para.cost_time = cost_time;
        NetMgr.sendMsg(para);
    }

    //获取Boss关卡题目
    getBossLevelTopic(big_id: number) {
        let para: c2sBossLevelTopic = new c2sBossLevelTopic();
        para.big_id = big_id;
        NetMgr.sendMsg(para);
    }

    //boss关卡答案提交
    submitBossLevelTopic(big_id: number, bl_id: string, w_id: string, status: number, option: string, cost_time: number) {
        let para: c2sBossLevelSubmit = new c2sBossLevelSubmit();
        para.big_id = big_id;
        para.w_id = w_id;
        para.bl_id = bl_id;
        para.status = status;
        para.option = option;
        para.cost_time = cost_time;
        NetMgr.sendMsg(para);
    }
    //boss关卡重新开始
    bossLevelRestart(big_id: number, bl_id: string) {
        let para: c2sBossLevelRestart = new c2sBossLevelRestart();
        para.big_id = big_id;
        para.bl_id = bl_id;
        NetMgr.sendMsg(para);
    }

    //获取岛屿进度奖励
    getProgressReward(big_id: number, pass_count: number) {
        let para: c2sGetProgressReward = new c2sGetProgressReward();
        para.big_id = big_id;
        para.pass_count = pass_count;
        NetMgr.sendMsg(para);
    }

    //获取单元列表
    getWordGameUnits(big_id: number) {
        let para: c2sGetUnitList = new c2sGetUnitList();
        para.big_id = big_id;
        NetMgr.sendMsg(para);
    }

    //关卡重新开始
    wordGameLevelRestart(big_id: number, small_id: number) {
        let para: c2sWordGameLevelRestart = new c2sWordGameLevelRestart();
        para.big_id = big_id;
        para.small_id = small_id;
        NetMgr.sendMsg(para);
    }

    //获取单元单词
    getUnitWords(big_id: number, unit: string) {
        let para: c2sWordGameUnitWords = new c2sWordGameUnitWords();
        para.big_id = big_id;
        para.unit = unit;
        NetMgr.sendMsg(para);
    }

    //获取大冒险主题数据
    getWordGameSubject(subject_id: number) {
        let para: c2sWordGameSubject = new c2sWordGameSubject();
        para.subject_id = subject_id;
        NetMgr.sendMsg(para);
    }

    //获取大冒险主题ai文章列表
    getSubjectArticleList(subject_id: number) {
        let para: c2sSubjectArticleList = new c2sSubjectArticleList();
        para.subject_id = subject_id;
        NetMgr.sendMsg(para);
    }

    //获取大冒险文章题目列表
    getArticleExercisesList(subject_id: number, article_id?: number) {
        let para: c2sArticleExercisesList = new c2sArticleExercisesList();
        para.subject_id = subject_id;
        if (article_id)
            para.article_id = article_id;
        NetMgr.sendMsg(para);
    }

    //获取大冒险跳级题目列表
    getGradeSkipExercisesList(big_id: number, unit: string) {
        let para: c2sGradeSkipExercisesList = new c2sGradeSkipExercisesList();
        para.big_id = big_id;
        para.unit = unit;
        NetMgr.sendMsg(para);
    }
    //大冒险跳级题目提交
    gradeSkipExercisesSubmit(big_id: number, unit: string, status: number) {
        let para: c2sGradeSkipExercisesSubmit = new c2sGradeSkipExercisesSubmit();
        para.big_id = big_id;
        para.unit = unit;
        para.status = status;
        NetMgr.sendMsg(para);
    }
}