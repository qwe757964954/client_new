import { _decorator, Component, Label, Node, Sprite, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpellWordItem')
export class SpellWordItem extends Component {
    @property(Sprite)
    public sp_bg: Sprite = null;
    @property(Node)
    public select_bg: Node = null;
    @property(Label)
    public lb_word: Label = null;
    @property(Label)
    idxLabel: Label = null;
    @property(Node)
    idxNode: Node = null;
    public word: string = "";
    public isSelect: boolean = false;
    public selectIdx: number = -1;

    init(str: string) {
        this.word = str;
        this.lb_word.string = str;
        this.select_bg.active = false;

        this.scheduleOnce(() => {
            let texWidth = this.lb_word.getComponent(UITransform).contentSize.width;
            console.log('texWidth=', texWidth);
            this.node.getComponent(UITransform).width = this.sp_bg.getComponent(UITransform).width = this.select_bg.getComponent(UITransform).width = texWidth + 100;
        }, 0.05);
    }

    select(idx: number) {
        this.isSelect = !this.isSelect;
        if (this.isSelect) {
            this.select_bg.active = true;
            this.idxLabel.string = idx.toString();
            this.idxNode.active = true;
            this.selectIdx = idx;
        } else {
            this.select_bg.active = false;
            this.idxNode.active = false;
            this.selectIdx = -1;
        }
    }

    dispose() {
        this.select_bg.active = false;
        this.idxNode.active = false;
        this.selectIdx = -1;
        this.isSelect = false;
    }
}


