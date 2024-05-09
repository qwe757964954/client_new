import { EventType } from "../config/EventType";
import { ViewsManager } from "../manager/ViewsManager";
import { c2sAdventureResult, c2sClassificationWord, c2sIslandStatus, c2sWordGameWords, WordGameWordsData } from "../models/AdventureModel";
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
        this.addModelListener(InterfacePath.Classification_Word, this.onClassificationWord);
    }

    //获取单个单词详情
    getClassificationWord(word: string) {
        let para: c2sClassificationWord = new c2sClassificationWord();
        para.Word = word;
        NetMgr.sendMsg(para);
    }
    onClassificationWord(data: any) {
        EventManager.emit(EventType.Classification_Word, data);
    }

    //获取大冒险岛屿状态
    getIslandStatus(bigId: number) {
        let para: c2sIslandStatus = new c2sIslandStatus();
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

    //单词大冒险结果提交
    submitAdventureResult(bigId: number, smallId: number, microId: number, gameMode: number, costTime: number) {
        let para: c2sAdventureResult = new c2sAdventureResult();
        para.big_id = bigId;
        para.small_id = smallId;
        para.micro_id = microId;
        para.game_mode = gameMode;
        para.cost_time = costTime;
        NetMgr.sendMsg(para);
    }
}