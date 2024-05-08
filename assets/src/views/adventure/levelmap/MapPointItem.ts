import { _decorator, Component, Label, Node } from 'cc';
import { MapLevelData } from '../../../models/AdventureModel';
const { ccclass, property } = _decorator;

@ccclass('MapPointItem')
export class MapPointItem extends Component {
    @property({ type: [Node], tooltip: "星星" })
    public stars: Node[] = [];
    @property({ type: Node, tooltip: "底盘" })
    public bgNode: Node = null;
    @property({ type: Label, tooltip: "关卡Label" })
    public levelLabel: Label = null;

    public data: MapLevelData = null;

    public index: number = 0;

    start() {

    }

    initData(data: MapLevelData) {
        this.data = data;
        this.levelLabel.string = data.small_id + "-" + data.micro_id;
    }
}


