import { isValid } from "cc";
import { EventType } from "../config/EventType";
import { ViewsManager } from "../manager/ViewsManager";
import { AdventureResultModel, c2sAdventureResult, c2sAdventureWord, c2sIslandProgress, c2sIslandStatus, c2sTextbookWordGroup, c2sWordGameWords, c2sWordGroup, WordGameWordsData } from "../models/AdventureModel";
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
    }

    //获取单个单词详情
    getAdventureWord(word: string) {
        let para: c2sAdventureWord = new c2sAdventureWord();
        para.word = word;
        NetMgr.sendMsg(para);
    }

    //获取大冒险岛屿状态
    getIslandStatus(bigId: number) {
        let para: c2sIslandStatus = new c2sIslandStatus();
        para.big_id = bigId;
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
    getTextbookWordGroup(type_name: string, book_name: string, grade: string, unit: string) {
        let para: c2sTextbookWordGroup = new c2sTextbookWordGroup();
        para.type_name = type_name;
        para.book_name = book_name;
        para.grade = grade;
        para.unit = unit;
        NetMgr.sendMsg(para);
    }
}