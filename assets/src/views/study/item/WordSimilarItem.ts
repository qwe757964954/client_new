import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WordSimilarItem')
export class WordSimilarItem extends Component {
    @property({ type: Label, tooltip: "英文" })
    enLabel: Label = null;
    @property({ type: Label, tooltip: "中文" })
    cnLabel: Label = null;
    start() {

    }

    setData(data: { cn: string, word: string }) {
        this.enLabel.string = data.word;
        this.cnLabel.string = data.cn;
    }
}


