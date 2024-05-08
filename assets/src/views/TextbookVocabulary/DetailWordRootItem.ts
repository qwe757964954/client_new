import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DetailWordRootItem') //单词释义
export class DetailWordRootItem extends Component {

    @property({ type: Label, tooltip: "词根类型" }) //
    public rootTypeTxt: Label = null;

    @property({ type: Label, tooltip: "词根内容" }) //
    public rootItemTxt: Label = null;

    Init(data) { // {type:"词根", txt:"词根内容"}
        this.rootTypeTxt.string = "";
        this.rootItemTxt.string = "";
        if (!data) {
            return;
        }
        if (!data.type || !data.txt) {
            return;
        }

        this.rootTypeTxt.string = data.type;
        this.rootItemTxt.string = data.txt;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


