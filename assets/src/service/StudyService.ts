import { EventType } from "../config/EventType";
import { c2sWordGameWords } from "../models/NetModel";
import { InterfacePath } from "../net/InterfacePath";
import { NetManager } from "../net/NetManager";
import EventManager from "../util/EventManager";

export default class StudyService {
    constructor() {
        this.addServerEvent();
    }

    addServerEvent() {
        EventManager.on(InterfacePath.WordGame_Words, this.onWordGameWords.bind(this));
    }

    //账号初始化
    getWordGameWords(bigId: number, smallId: number, microId: number, gameMode: number) {
        let para: c2sWordGameWords = new c2sWordGameWords();
        para.BigId = bigId;
        para.SmallId = smallId;
        para.MicroId = microId;
        para.GameMode = gameMode;
        NetManager.instance().sendMsg(para);
    }
    onWordGameWords(data: any) {
        EventManager.emit(EventType.WordGame_Words, data);
    }
}