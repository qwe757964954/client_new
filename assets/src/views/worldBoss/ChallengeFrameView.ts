import { _decorator, Component, isValid, Label, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { BossGameWord } from './BossInfo';
import { AnswerType, ChallengeAnswerItem } from './ChallengeAnswerItem';
const { ccclass, property } = _decorator;

@ccclass('ChallengeFrameView')
export class ChallengeFrameView extends Component {

    @property(List)
    wordScroll:List = null;

    @property({ type: Label, tooltip: "单词Label" })
    wordLabel: Label = null;
    @property({ type: Label, tooltip: "音标Label" })
    symbolLabel: Label = null;
    @property({ type: Label, tooltip: "例句" })
    sentenceLabel: Label = null;

    private _bossWords:BossGameWord[] = []; 
    private _currentWord:BossGameWord = null;
    private _isMoving:boolean = false;
    start() {

    }

    onLoadWordData(words:BossGameWord[]){
        this._bossWords = words;
        
        this.wordScroll.numItems = words.length;
        this.wordScroll.update();
        this.wordScroll.selectedId = -1;
        this._currentWord = this.getRandomWord(words);
        this.wordLabel.string = this._currentWord.En;
    }
    getRandomWord(words:BossGameWord[]){
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    }
    removeWord(wordInfo:BossGameWord){
        this._bossWords = this._bossWords.filter(wordInfo => wordInfo.En != this._currentWord.En);
    }
    onLoadAnswerVertical(item:Node, idx:number){
        let item_sript:ChallengeAnswerItem = item.getComponent(ChallengeAnswerItem);
        let wordInfo:BossGameWord = this._bossWords[idx];
        item_sript.updatePropsItem(wordInfo,idx);
    }
    onAnswerVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        if(selectedId >= this._bossWords.length){return;}
        if(this._isMoving){return}
        this._isMoving = true;
        console.log("onBossVerticalSelected",selectedId);
        let wordInfo:BossGameWord = this._bossWords[selectedId];
        let status:AnswerType = this._currentWord.En == wordInfo.En ? AnswerType.Correct :  AnswerType.Error;
        let item_sript:ChallengeAnswerItem = item.getComponent(ChallengeAnswerItem);
        item_sript.changeItemStatus(status);
        this.removeWord(wordInfo);
        this.scheduleOnce(() => {
            this._isMoving = false;
        },2)
        EventMgr.dispatch(EventType.Challenge_ReportResult,{result:status});
        
    }

}


