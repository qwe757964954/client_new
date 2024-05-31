import { _decorator, Component, Label, Node, Sprite, SpriteFrame, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SelectLetterItem')
export class SelectLetterItem extends Component {
    @property({ type: Node, tooltip: "背景" })
    bg: Node = null;
    @property({ type: Label, tooltip: "字母" })
    letterLabel: Label = null;
    @property({ type: SpriteFrame, tooltip: "蓝背景" })
    blueBg: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: "绿背景" })
    greenBg: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: "黄背景" })
    yellowBg: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: "白背景" })
    whiteBg: SpriteFrame = null;

    setData(data: { letter: string, color: number }) {
        this.letterLabel.string = data.letter;
        this.bg.getComponent(Sprite).spriteFrame = this.getBg(data.color);
        if (data.letter == " ") {
            this.getComponent(UIOpacity).opacity = 0;
        } else {
            this.getComponent(UIOpacity).opacity = 255;
        }
    }

    getBg(colorIdx: number): SpriteFrame {
        switch (colorIdx) {
            case 0:
                return this.whiteBg;
            case 1:
                return this.blueBg;
            case 2:
                return this.greenBg;
            case 3:
                return this.yellowBg;
            default:
                return this.blueBg;
        }
    }
}


