import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapPointItem')
export class MapPointItem extends Component {
    @property({ type: [Node], tooltip: "星星" })
    public stars: Node[] = [];
    @property({ type: Node, tooltip: "底盘" })
    public bgNode: Node = null;
    @property({ type: Label, tooltip: "关卡Label" })
    public levelLabel: Label = null;

    public data: { bigId: number, smallId: number } = null;
    start() {

    }

    setData(data: { bigId: number, smallId: number }) {
        this.data = data;
        this.levelLabel.string = this.data.bigId + "-" + this.data.smallId;
    }
}


