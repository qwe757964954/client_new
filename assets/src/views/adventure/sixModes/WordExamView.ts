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

    }

    onItemRender(item: Node, index: number) {

    }
}


