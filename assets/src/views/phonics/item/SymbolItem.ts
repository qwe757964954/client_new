import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SymbolItem')
export class SymbolItem extends Component {
    @property(Node)
    public bg: Node = null;
    @property(Label)
    public symbolLabel: Label = null;

    setData(data: any) {
        this.symbolLabel.string = data.symbol;
    }

}


