import { _decorator, Label, Node } from 'cc';
import { GameMode } from '../../../models/AdventureModel';
import { UnitWordModel } from '../../../models/TextbookModel';
import { BaseModeView } from './BaseModeView';
const { ccclass, property } = _decorator;

@ccclass('WordReadingView')
export class WordReadingView extends BaseModeView {
    @property({ type: Label, tooltip: "单词Label" })
    wordLabel: Label = null;
    @property({ type: Label, tooltip: "音标Label" })
    symbolLabel: Label = null;
    @property({ type: Label, tooltip: "中文Label" })
    cnLabel: Label = null;
    @property({ type: Node, tooltip: "单词读音" })
    wordSound: Node = null;



    async initData(wordsdata: UnitWordModel[], levelData: any) {
        this.gameMode = GameMode.Reading;
        super.initData(wordsdata, levelData);
        this.initWords(wordsdata);
        this.initEvent();
        this.initMonster(); //初始化怪物
    }

    //获取关卡单词回包
    initWords(data: UnitWordModel[]) {
        console.log('initWords', data);
        this._wordsData = data;
        this.showCurrentWord();
    }

    //显示当前单词
    showCurrentWord() {
        let wordData = this._wordsData[this._wordIndex];
        console.log('word', wordData);
        let word = wordData.word;
        
    }

    protected initEvent(): void {
        super.initEvent();
    }
    protected removeEvent(): void {
        super.removeEvent();
    }

    onDestroy(): void {
        super.onDestroy();
    }
}


