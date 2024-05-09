import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WordMonestTabItem')
export class WordMonestTabItem extends Component {
    @property({ type: Label, tooltip: "Tab页标题" })
    public typeTxt: Label = null;

    @property({ type: Node, tooltip: "Lock图标" })
    public lockIcon: Node = null;

    @property({ type: Node, tooltip: "底部图标" })
    public focusImg: Node = null;

    public Init() {

    }

    start() {

    }

    update(deltaTime: number) {

    }
}


