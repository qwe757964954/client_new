import { _decorator, Component, isValid, Label, Node } from 'cc';
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
    onLoadAnswerVertical(item:Node, idx:number){
        let item_sript:ChallengeAnswerItem = item.getComponent(ChallengeAnswerItem);
        let wordInfo:BossGameWord = this._bossWords[idx];
        item_sript.updatePropsItem(wordInfo,idx);
    }
    onAnswerVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        console.log("onBossVerticalSelected",selectedId);
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        let wordInfo:BossGameWord = this._bossWords[selectedId];
        let status:AnswerType = this._currentWord.En == wordInfo.En ? AnswerType.Correct :  AnswerType.Error;
        let item_sript:ChallengeAnswerItem = item.getComponent(ChallengeAnswerItem);
        item_sript.changeItemStatus(status);
        this.scheduleOnce(()=>{
            this.onLoadWordData(this._bossWords);
        },3)
        
    }


}


