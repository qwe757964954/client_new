import { _decorator, Component, Label, Node } from 'cc';
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
    public soundBtn: Label = null;

    @property({ type: Node, tooltip: "去学习按钮" }) //
    public learnBtn: Label = null;

    initUI() {

    }
    start() {

    }

    update(deltaTime: number) {

    }
}


