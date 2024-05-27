import { _decorator, Component, instantiate, Node, Prefab, Sprite, SpriteFrame, Vec3 } from 'cc';
import { EventType } from '../../../config/EventType';
import { MapLevelData } from '../../../models/AdventureModel';
import CCUtil from '../../../util/CCUtil';
import EventManager from '../../../util/EventManager';
import { WorldIsland } from '../WorldIsland';
import { MapPointItem } from './MapPointItem';
const { ccclass, property } = _decorator;

@ccclass('IslandMap')
export class IslandMap extends Component {
    @property({ type: Sprite, tooltip: "地图背景" })
    public bg: Sprite = null;
    @property({ type: Prefab, tooltip: "地图点" })
    public mapPointPrefab: Prefab = null;
    @property({ type: Node, tooltip: "地图点容器" })
    public mapPointContainer: Node = null;

    @property({ type: [SpriteFrame], tooltip: "岛屿地图背景" })
    public islandBg: SpriteFrame[] = [];

    private _pointItems: Node[] = [];


    start() {

    }

    //设置数据
    setData(islandId: number, mapPoints: MapLevelData[]) {
        this.removePointEvent();
        for (let i = 0; i < this._pointItems.length; i++) {
            this._pointItems[i].active = false;
        }
        this._pointItems = [];
        this.bg.spriteFrame = this.islandBg[islandId - 1];
        let points = WorldIsland.getMapPointsByBigId(islandId);
        for (let i = 0; i < mapPoints.length; i++) {
            let mapPoint = instantiate(this.mapPointPrefab);
            mapPoint.position = new Vec3(points[i][0], points[i][1], 0);
            this.mapPointContainer.addChild(mapPoint);
            mapPoint.active = true;
            mapPoint.getComponent(MapPointItem).initData(mapPoints[i]);
            this._pointItems.push(mapPoint);
            CCUtil.onTouch(mapPoint, this.onPointClick.bind(this, mapPoint), this);
        }
    }

    onPointClick(point: Node) {
        let data: MapLevelData = point.getComponent(MapPointItem).data;
        EventManager.emit(EventType.MapPoint_Click, data);
    }

    removePointEvent() {
        for (let i = 0; i < this._pointItems.length; i++) {
            CCUtil.offTouch(this._pointItems[i], this.onPointClick.bind(this, this._pointItems[i]), this);
        }
    }

    protected onDestroy(): void {
        this.removePointEvent();
    }
}


