import { _decorator, Component, Label, Node } from 'cc';
import { ChallengeAnswerItem } from './ChallengeAnswerItem';
const { ccclass, property } = _decorator;

@ccclass('ChallengeFrameView')
export class ChallengeFrameView extends Component {
    @property({ type: Label, tooltip: "单词Label" })
    wordLabel: Label = null;
    @property({ type: Label, tooltip: "音标Label" })
    symbolLabel: Label = null;
    @property({ type: Label, tooltip: "例句" })
    sentenceLabel: Label = null;

    start() {

    }

    onLoadAnswerVertical(item:Node, idx:number){
        let item_sript:ChallengeAnswerItem = item.getComponent(ChallengeAnswerItem);
        // let info:BossInfo = WordBossArray[idx];
        // item_sript.updatePropsItem(info,idx);
    }
    onAnswerVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        console.log("onBossVerticalSelected",selectedId);
        // if(this._selectCallback){
        //     this._selectCallback(selectedId);
        // }
    }


}


