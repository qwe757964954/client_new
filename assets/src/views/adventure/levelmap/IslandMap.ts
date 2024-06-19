import { _decorator, Component, instantiate, Node, Prefab, Sprite, SpriteFrame, Vec3 } from 'cc';
import { EventType } from '../../../config/EventType';
import { MapLevelData, MicroListItem } from '../../../models/AdventureModel';
import CCUtil from '../../../util/CCUtil';
import EventManager from '../../../util/EventManager';
import { WorldIsland } from '../WorldIsland';
import { MapPointItem } from './MapPointItem';
import { ViewsMgr } from '../../../manager/ViewsManager';
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

    private _pointDatas:MicroListItem[] = [];
    private _pointItems: Node[] = [];

    private _progressData: number;
    private _aniNode: Node = null;
    private _bossNode: Node = null;
    private _islandId: number;

    start() {

    }

    //设置数据
    setData(islandId: number, mapPoints: MicroListItem[], progressData: number) {
        this.removePointEvent();
        this._progressData = progressData;
        this._pointDatas = mapPoints;
        this._islandId = islandId;
        for (let i = 0; i < this._pointItems.length; i++) {
            this._pointItems[i].active = false;
        }
        this._pointItems = [];
        this.bg.spriteFrame = this.islandBg[islandId - 1];
        let points = WorldIsland.getMapPointsByBigId(islandId);
        let posData: { map: IslandMap, position: Vec3 } = null;
        for (let i = 0; i < mapPoints.length; i++) {
            let mapPoint = instantiate(this.mapPointPrefab);
            mapPoint.position = new Vec3(points[i][0], points[i][1], 0);
            this.mapPointContainer.addChild(mapPoint);
            mapPoint.active = true;
            mapPoint.getComponent(MapPointItem).initData(mapPoints[i]);
            this._pointItems.push(mapPoint);
            CCUtil.onTouch(mapPoint, this.onPointClick.bind(this, mapPoint), this);
            if (mapPoints[i].flag == 0 && mapPoints[i].can_play == 1) { //当前关卡
                posData = { map: this, position: mapPoint.position };
            }
        }
        if (!posData) {
            if (this._aniNode) {
                this._aniNode.active = false;
            }
            this._aniNode = null;
        }
        if(this._bossNode){
            this._bossNode.active = false;
        }
        this._bossNode = null;
        return posData;
    }

    setBossNode(bossNode:Node){
        let points = WorldIsland.getMapPointsByBigId(this._islandId);
        let lastIdx = this._pointDatas.length - 1;
        let lastPoint = points[lastIdx];
        bossNode.position = new Vec3(lastPoint[0] + 50, lastPoint[1] + 250, 0);
        this.node.addChild(bossNode);
        bossNode.active = true;
        this._bossNode = bossNode;
    }

    setAniNode(aniNode: Node) {
        this.node.addChild(aniNode);
        aniNode.active = true;
        this._aniNode = aniNode;
    }

    onPointClick(point: Node) {
        let data: MicroListItem = point.getComponent(MapPointItem).data as MicroListItem;
        if (!data.can_play) {
            ViewsMgr.showTip("请先通过前置关卡");
            return;
        }
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


