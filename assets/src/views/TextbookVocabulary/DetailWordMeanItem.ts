import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DetailWordMeanItem') //单词释义
export class DetailWordMeanItem extends Component {

    @property({ type: Label, tooltip: "单词含义" }) //
    public wordMeanTxt: Label = null;

    Init(data) { //{ sp: "vt.", tr: "vi. 赠送，捐赠"}
        this.wordMeanTxt.string = "";
        if (!data) {
            return;
        }
        if (!data.sp || !data.tr) {
            return;
        }

        this.wordMeanTxt.string = data.sp + " " + data.tr//data.mean;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


