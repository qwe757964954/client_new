import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapPointItem')
export class MapPointItem extends Component {
    @property({ type: [Node], tooltip: "星星" })
    public stars: Node[] = [];
    @property({ type: Node, tooltip: "底盘" })
    public bgNode: Node = null;

    public data: { bigId: number, smallId: number } = null;
    start() {

    }

    setData(data: { bigId: number, smallId: number }) {
        this.data = data;
    }
}


