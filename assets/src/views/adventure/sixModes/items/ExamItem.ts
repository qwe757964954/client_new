import { _decorator, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ExamItem')
export class ExamItem extends Component {
    @property({ type: Node, tooltip: "选中背景" })
    selectBg: Node = null;
    @property({ type: Label, tooltip: "显示内容" })
    letterLabel: Label = null;
    private _select: boolean = false;

    letter: string = "";

    setData(letter: string) {
        this.letter = letter;
        this.letterLabel.string = letter;
        this.select = false;
    }

    public get select(): boolean {
        return this._select;
    }

    public set select(value: boolean) {
        this._select = value;
        this.selectBg.active = value;
    }
}


