import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DetailWordNearSynonymMeanItem') //近义词
export class DetailWordNearSynonymMeanItem extends Component {

    @property({ type: Label, tooltip: "单词英语" }) //
    public enTxt: Label = null;

    @property({ type: Label, tooltip: "单词中文翻译" }) //
    public chTxt: Label = null;

    Init(data) {
        this.enTxt.string = "";
        this.chTxt.string = "";
        if (!data) {
            return;
        }
        this.enTxt.string = data.Word;
        this.chTxt.string = data.Cn;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


