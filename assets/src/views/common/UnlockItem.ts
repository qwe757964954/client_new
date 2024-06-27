import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UnlockItem')
export class UnlockItem extends Component {
    @property(Label)
    title: Label = null;
    @property(Label)
    funcLabel: Label = null;
    start() {

    }

    initData(data: any) {
        this.title.string = data.title;
        this.funcLabel.string = data.content;
    }
}


