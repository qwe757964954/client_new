import { _decorator, Component, Label, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import { NetConfig } from '../../config/NetConfig';
import { WordSimpleData2 } from '../TextbookVocabulary/SearchWordView';
const { ccclass, property } = _decorator;

@ccclass('WordLearnMonestItem')
export class WordLearnMonestItem extends Component {
    @property({ type: Label, tooltip: "单词本身" })
    public wordTxt: Label = null;

    @property({ type: Label, tooltip: "单词释义" }) //usSymbolTxt
    public cnTxt: Label = null;

    @property({ type: Label, tooltip: "单词释义" }) //
    public usSymbolTxt: Label = null;

    @property({ type: Node, tooltip: "声音按钮" }) //
    public soundBtn: Node = null;

    @property({ type: Node, tooltip: "去学习按钮" }) //
    public learnBtn: Node = null;

    wordData: WordSimpleData2 = null;

    Init(data: WordSimpleData2) { // { Word: "give", Cn: "赠送，给予", Symbol: "[/ ˈtiːtʃə(r) /]" }
        if (!data) {
            return;
        }

        this.wordData = data;
        this.wordTxt.string = data.Word;
        this.cnTxt.string = data.Cn;
        this.usSymbolTxt.string = data.Symbol;

        this.initEvent();
    }

    initEvent() {
        CCUtil.onTouch(this.soundBtn, this.onSoundClick, this);
        CCUtil.onTouch(this.learnBtn, this.onLearnClick, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.soundBtn, this.onSoundClick, this);
        CCUtil.offTouch(this.soundBtn, this.onLearnClick, this);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    onSoundClick() {
        let wordSoundUrl = "/sounds/glossary/words/en/" + this.wordData.Word + ".wav";
        RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    onLearnClick() {
        console.log("Learn word:", this.wordData.Word);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


