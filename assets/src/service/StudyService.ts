import { isValid } from "cc";
import { EventType } from "../config/EventType";
import { ViewsManager } from "../manager/ViewsManager";
import { AdventureCollectWordModel, AdventureResultModel, c2sAdventureCollectWord, c2sAdventureResult, c2sAdventureWord, c2sAdventureWordSentence, c2sAdvLevelProgress, c2sIslandProgress, c2sIslandStatus, c2sTextbookWordGroup, c2sWordGameWords, c2sWordGroup, WordGameWordsData } from "../models/AdventureModel";
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
    getAdventureWord(word: string, big_id: number, small_id: number, micro_id: number) {
        let para: c2sAdventureWord = new c2sAdventureWord();
        para.word = word;
        para.big_id = big_id;
        para.small_id = small_id;
        para.micro_id = micro_id;
        NetMgr.sendMsg(para);
    }

    //获取大冒险岛屿状态
    getIslandStatus() {
        let para: c2sIslandStatus = new c2sIslandStatus();
        NetMgr.sendMsg(para);
    }

    //获取大冒险岛屿进度
    getIslandProgress(bigId: number) {
        let para: c2sIslandProgress = new c2sIslandProgress();
        para.big_id = bigId;
        NetMgr.sendMsg(para);
    }

    //获取大冒险关卡单词
    getWordGameWords(bigId: number, smallId: number, microId: number, gameMode: number) {
        let para: c2sWordGameWords = new c2sWordGameWords();
        para.big_id = bigId;
        para.small_id = smallId;
        para.micro_id = microId;
        para.game_mode = gameMode;
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
        para.micro_id = params.micro_id;
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
    getWordGroup(bigId: number, smallId: number, microId: number) {
        let para: c2sWordGroup = new c2sWordGroup();
        para.big_id = bigId;
        para.small_id = smallId;
        para.micro_id = microId;
        NetMgr.sendMsg(para);
    }

    //获取教材单词组合模式选项
    getTextbookWordGroup(book_id:string, unit_id: string) {
        let para: c2sTextbookWordGroup = new c2sTextbookWordGroup();
        para.book_id = book_id;
        para.unit_id = unit_id;
        NetMgr.sendMsg(para);
    }
    //大冒险收藏单词
    reqAdventureCollectWord(params: AdventureCollectWordModel) {
        let para: c2sAdventureCollectWord = new c2sAdventureCollectWord();
        para.big_id = params.big_id;
        para.small_id = params.small_id;
        para.micro_id = params.micro_id;
        para.action = params.action;
        NetMgr.sendMsg(para);
    }
    onAdventureCollectWord(data: any) {
        if (data.code != 200) {
            ViewsManager.showTip(data.msg);
            return;
        }
        console.log("onAdventureCollectWord", data);
        EventManager.emit(EventType.Classification_AdventureCollectWord, data.data);
    }

    //获取大冒险单词例句
    getAdvWordSentence(word: string) {
        let para: c2sAdventureWordSentence = new c2sAdventureWordSentence();
        para.word = word;
        NetMgr.sendMsg(para);
    }

    //获取大冒险关卡进度
    getAdvLevelProgress(big_id: number, small_id: number, micro_id: number) {
        let para: c2sAdvLevelProgress = new c2sAdvLevelProgress();
        para.big_id = big_id;
        para.small_id = small_id;
        para.micro_id = micro_id;
        NetMgr.sendMsg(para);
    }
}