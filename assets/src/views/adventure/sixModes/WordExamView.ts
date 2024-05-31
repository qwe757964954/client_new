import { _decorator, Component, Node } from 'cc';
import { BaseModeView } from './BaseModeView';
import List from '../../../util/list/List';
import { UnitWordModel } from '../../../models/TextbookModel';
import { GameMode } from '../../../models/AdventureModel';
const { ccclass, property } = _decorator;

@ccclass('WordExamView')
export class WordExamView extends BaseModeView {
    @property({ type: List, tooltip: '选项Item' })
    itemList: List = null;

    private _selectLock: boolean = false;
    private _rightWordData: UnitWordModel = null; //正确单词数据
    private _wrongMode: boolean = false; //错误重答模式
    private _wrongWordList: any[] = []; //错误单词列表

    async initData(wordsdata: UnitWordModel[], levelData: any) {
        this.gameMode = GameMode.Exam;
        super.initData(wordsdata, levelData);
        this.initWords(wordsdata);
        this.initEvent();
        this.initMonster(); //初始化怪物
    }

    //获取关卡单词回包
    initWords(data: UnitWordModel[]) {
        this._wordsData = data;
        this.showCurrentWord();
    }


    showCurrentWord() {
        this._selectLock = false;
        this._rightWordData = this._wrongMode ? this._wrongWordList.shift() : this._wordsData[this._wordIndex];
        console.log('word', this._rightWordData);

    }

    onItemRender(item: Node, index: number) {

    }
}


