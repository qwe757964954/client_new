import { _decorator, Component, Label, Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { Shake } from '../../../../util/Shake';
const { ccclass, property } = _decorator;

@ccclass('BossWordItem')
export class BossWordItem extends Component {
    @property(Sprite)
    public sp_bg: Sprite = null;
    @property(Label)
    public lb_word: Label = null;
    @property(SpriteFrame)
    public greenBg: SpriteFrame = null;
    @property(SpriteFrame)
    public redBg: SpriteFrame = null;
    @property(SpriteFrame)
    public normalBg: SpriteFrame = null;
    public word: string = "";


    init(str: string, idx: number) {
        this.word = str;
        let Opts = ["A", "B", "C"];
        this.lb_word.string = Opts[idx] + ". " + str;
        this.sp_bg.spriteFrame = this.normalBg;

        this.scheduleOnce(() => {
            let texWidth = this.lb_word.getComponent(UITransform).contentSize.width;
            console.log('texWidth=', texWidth);
            this.node.getComponent(UITransform).width = this.sp_bg.getComponent(UITransform).width = texWidth + 100;
        }, 0.05);
    }

    showResult(isRight: boolean) {
        if (isRight) {
            this.sp_bg.spriteFrame = this.greenBg;
        } else {
            this.sp_bg.spriteFrame = this.redBg;
            this.getComponent(Shake).shakeNode();
        }
    }
}


