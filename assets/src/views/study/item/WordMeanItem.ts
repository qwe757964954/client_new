import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WordMeanItem')
export class WordMeanItem extends Component {
    @property({ type: Label, tooltip: "释义" })
    meanLabel: Label = null;
    start() {

    }

    setData(data: { sp: string, tr: string }) {
        this.meanLabel.string = data.sp + " " + data.tr;
    }
}


