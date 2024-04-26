import { EventType } from "../config/EventType";
import { c2sClassificationWord, c2sWordGameWords } from "../models/NetModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetMgr } from "../net/NetManager";
import EventManager from "../util/EventManager";

export default class StudyService {
    constructor() {
        this.addServerEvent();
    }

    addServerEvent() {
        EventManager.on(InterfacePath.WordGame_Words, this.onWordGameWords.bind(this));
        EventManager.on(InterfacePath.Classification_Word, this.onClassificationWord.bind(this));
    }

    //获取单个单词详情
    getClassificationWord(word: string) {
        let para: c2sClassificationWord = new c2sClassificationWord();
        para.Word = word;
        NetManager.instance().sendMsg(para);
    }
    onClassificationWord(data: any) {
        EventManager.emit(EventType.Classification_Word, data);
    }

    //获取大冒险关卡单词
    getWordGameWords(bigId: number, smallId: number, microId: number, gameMode: number) {
        let para: c2sWordGameWords = new c2sWordGameWords();
        para.BigId = bigId;
        para.SmallId = smallId;
        para.MicroId = microId;
        para.GameMode = gameMode;
        NetMgr.sendMsg(para);
    }
    onWordGameWords(data: any) {
        EventManager.emit(EventType.WordGame_Words, data);
    }
}