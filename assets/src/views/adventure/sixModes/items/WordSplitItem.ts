import { _decorator, Component, Label, Node, Sprite, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WordSplitItem')
export class WordSplitItem extends Component {
    @property(Sprite)
    public sp_bg: Sprite = null;
    @property(Node)
    public select_bg: Node = null;
    @property(Label)
    public lb_word: Label = null;
    public word: string = "";
    start() {

    }

    init(str: string) {
        this.word = str;
        this.lb_word.string = str;
        this.select_bg.active = false;
        this.node.getComponent(UITransform).width = this.sp_bg.getComponent(UITransform).width = this.select_bg.getComponent(UITransform).width = this.lb_word.getComponent(UITransform).width + 100;
    }
}


