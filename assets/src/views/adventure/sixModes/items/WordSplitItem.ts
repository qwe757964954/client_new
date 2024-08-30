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
    public index:number = 0;
    init(str: string) {
        this.word = str;
        this.lb_word.string = str;
        this.select_bg.active = false;
        this.scheduleOnce(() => {
            let texWidth = this.lb_word.getComponent(UITransform).contentSize.width;
            console.log('texWidth=', texWidth);
            this.node.getComponent(UITransform).width = this.sp_bg.getComponent(UITransform).width = this.select_bg.getComponent(UITransform).width = texWidth + 100;
        }, 0.1);
    }

    select() {
        this.select_bg.active = true;
    }
}


