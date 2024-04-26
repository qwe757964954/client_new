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

    setData(data: { Cn: string, Word: string }) {
        this.enLabel.string = data.Word;
        this.cnLabel.string = data.Cn;
    }
}


