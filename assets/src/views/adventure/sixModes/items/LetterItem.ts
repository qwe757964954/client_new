import { _decorator, Component, Label, Node, SpriteFrame, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LetterItem')
export class LetterItem extends Component {
    @property({ type: Label, tooltip: "字母" })
    letterLabel: Label = null;

    setData(letter: string) {
        this.letterLabel.string = letter;
        this.letterLabel.node.active = false;
        if (letter == " ") {
            this.getComponent(UIOpacity).opacity = 0;
        }
    }

    showLetter() {
        this.letterLabel.node.active = true;
    }
}


