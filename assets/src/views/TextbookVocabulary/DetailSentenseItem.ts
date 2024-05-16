import { _decorator, Component, Label, Node, RichText } from 'cc';
import CCUtil from '../../util/CCUtil';
import { RemoteSoundMgr } from '../../manager/RemoteSoundManager';
import { NetConfig } from '../../config/NetConfig';
import { WordSentence } from './SearchWordView';
const { ccclass, property } = _decorator;

@ccclass('SentenseItem')
export class DetailSentenseItem extends Component {
    @property({ type: Node, tooltip: "声音按钮" })
    public soundBtn: Node = null;

    @property({ type: RichText, tooltip: "单词例句" })
    public sentenceTxt: RichText = null;

    @property({ type: Label, tooltip: "单词例句中文翻译" }) //
    public sentenceChTxt: Label = null;

    private _sentenceData: WordSentence = null;
    private _sentenceId: string = "";

    start() {

    }

    init(data: WordSentence) {
        if (!data) {
            return;
        }
        this.initData(data);
        this.initEvent();
    }

    protected onDestroy(): void {
        this.RemoveEvent();
    }

    initData(data: WordSentence) {
        this._sentenceData = data;
        this.onSentenceDetail();
    }

    onSentenceDetail() {
        if (!this._sentenceData) {
            return;
        }
        let word = this._sentenceData.Word;
        let sentence: string = this._sentenceData.En; //英语部分
        let strCnt: string = this._sentenceData.Cn;
        this._sentenceId = this._sentenceData.Id;
        let lowerSent: string = sentence.toLowerCase(); //句子变小写
        let lowerWord = word.toLowerCase(); //单词变小写
        let startIndex = lowerSent.indexOf(lowerWord); //寻找单词的位置
        if (startIndex != 0) { //如果单词在中间位置
            startIndex = lowerSent.indexOf(" " + lowerWord); //前面的空格也算？
        }
        let endIndex = startIndex + word.length; // 单词结束位置

        var strHead: string = "";
        var strMid: string = ""
        var strTail: string = "";
        if (startIndex === -1) { //如果没有找到
            this.sentenceTxt.string = "<color=#6C331F>" + sentence + "</color>";
        }
        else if (startIndex === 0) { //如果单词出现在首位
            strTail = sentence.substring(endIndex);
            this.sentenceTxt.string = "<color=#ff4e00>" + word + "</color>" + "<color=#6C331F>" + strTail + "</color>";
        }
        else if (startIndex > 0 && startIndex <= sentence.length - 1) { //单词在中间
            strHead = sentence.substring(0, startIndex);
            strMid = sentence.substring(startIndex, endIndex + 1);
            strTail = sentence.substring(endIndex + 1);
            this.sentenceTxt.string = "<color=#6C331F>" + strHead + "</color>" +
                "<color=#ff4e00>" + strMid + "</color>" + "<color=#6C331F>" + strTail + "</color>";
        }
        else {
            this.sentenceTxt.string = "<color=#6C331F>" + sentence + "</color>";
        }
        this.sentenceChTxt.string = strCnt; //中文部分
    }

    initEvent() {
        CCUtil.onTouch(this.soundBtn, this.onPlaySentence, this);
    }

    RemoveEvent() {
        CCUtil.offTouch(this.soundBtn, this.onPlaySentence, this);
    }

    /**播放单词例句声音 */
    private onPlaySentence() {
        //SoundUtil.playSound("/assets/sounds/glossary/sentence_tts/Emily/" + this.sentenceId + ".wav")
        let wordSoundUrl = "/sounds/glossary/sentence_tts/Emily/" + this._sentenceId + ".wav";
        RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    update(deltaTime: number) {

    }
}


