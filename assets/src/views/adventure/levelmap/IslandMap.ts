import { _decorator, Component, Node, Sprite, SpriteFrame, Vec2 } from 'cc';
import { IslandStatusModel } from '../../../models/AdventureModel';
const { ccclass, property } = _decorator;

@ccclass('IslandMap')
export class IslandMap extends Component {
    @property({ type: Sprite, tooltip: "地图背景" })
    public bg: Sprite = null;

    @property({ type: [SpriteFrame], tooltip: "岛屿地图背景" })
    public islandBg: SpriteFrame[] = [];

    private _mapPoints: Map<number, number[][]> = new Map<number, number[][]>();

    start() {
        this._mapPoints.set(1, [[221, 244], [389, 96], [302, -89], [443, -289], [715, 242], [960, -100], [1265, -61], [1572, -257], [1735, -8], [1593, 151], [1821, 287], [2121, 266]]);
    }

    //设置数据
    setData(islandId: number, levelStatus: IslandStatusModel[]) {
        this.bg.spriteFrame = this.islandBg[islandId - 1];
        console.log('设置岛屿地图', islandId, levelStatus);
        let points = this._mapPoints.get(islandId);
    }
}


