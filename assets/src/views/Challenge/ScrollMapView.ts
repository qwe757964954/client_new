import { Layout, Node, Prefab, Sprite, SpriteFrame, UITransform, Vec2, _decorator, instantiate } from 'cc';
import { EventType } from '../../config/EventType';
import { TextConfig } from '../../config/TextConfig';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { GateListItem, UnitItemStatus, UnitListItemStatus } from '../../models/TextbookModel';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import ImgUtil from '../../util/ImgUtil';
import { PoolMgr } from '../../util/PoolUtil';
import { MapPointItem } from '../adventure/levelmap/MapPointItem';
import { GotoUnitLevel } from './BreakThroughView';
import ChallengeUtil from './ChallengeUtil';
import { MapTouchBetterController } from './MapCom/MapTouchBetterController';

const { ccclass, property } = _decorator;

/**地图坐标对象 */
export interface MapCoordinate {
    x: number;
    y: number;
}

export const MapCoordinates: MapCoordinate[] = [
    { x: 225.147, y: 238.611 },
    { x: 395.16, y: 132.353 },
    { x: 318.654, y: -160.92 },
    { x: 532.824, y: -308.162 },
    { x: 768.746, y: -215.463 },
    { x: 976.223, y: -106.705 },
    { x: 1353.568, y: -124.166 },
    { x: 1621.942, y: -245.518 },
    { x: 1752.452, y: -46.406 },
    { x: 1593.867, y: 215.336 },
    { x: 1798.642, y: 291.26 },
    { x: 2065.9, y: 261.275 }
];

@ccclass('ScrollMapView')
export class ScrollMapView extends BaseView {
    @property(Node)
    MapLaout: Node = null;

    @property(Node)
    contentNode: Node = null;

    @property(Prefab)
    mapItemPrefab: Prefab = null;

    private _clickCallback: (itemStatus: UnitItemStatus, gate: GateListItem) => void = null;
    private _unitStatus: UnitItemStatus[] = [];
    private _pointItems: Node[] = [];
    private _total_grade = 0;
    public _curLevelIndex: number = 0;

    protected initUI(): void {
        this.offViewAdaptSize();
    }

    onInitModuleEvent() {
        this.addModelListener(EventType.Goto_Textbook_Next_Level, this.gotoNextTextbookLevel);
    }

    async loadMapItems() {
        this._pointItems = [];

        let unit_count = 0;
        for (const itemData of this._unitStatus) {
            for (const gate of itemData.gate_list) {
                const index = unit_count % MapCoordinates.length;
                const point: MapCoordinate = {
                    x: MapCoordinates[index].x - 1095,
                    y: MapCoordinates[index].y
                };

                let itemNode: Node = PoolMgr.getNodePool("mapItemPool").size() > 0 
                    ? PoolMgr.getNodeFromPool("mapItemPool")
                    : instantiate(this.mapItemPrefab);

                let itemScript = itemNode.getComponent(MapPointItem);
                itemScript.index = unit_count;
                itemScript.initSmallData({
                    big_id: itemData.unit_name,
                    small_id: gate.small_id,
                    micro_id: gate.small_id,
                    flag_info: gate.flag_info
                });

                CCUtil.onBtnClick(itemNode, (event) => this.onItemClick(event.node));

                const map_count = ChallengeUtil.calculateMapsNeeded(unit_count + 1, MapCoordinates.length);
                const mapNode = this.MapLaout.getChildByName(`bg_map_${map_count - 1}`);
                itemNode.setPosition(point.x, point.y, 0);
                mapNode.addChild(itemNode);
                this._pointItems.push(itemNode);
                unit_count++;
            }
        }
    }

    async initUnit(unitStatus: UnitListItemStatus) {
        this._unitStatus = unitStatus.unit_list;
        this._total_grade = unitStatus.gate_total;

        this._unitStatus.sort(this.compareUnitNames);

        this.MapLaout.removeAllChildren();
        try {
            await this.addMapBg();
            await this.loadMapItems();
            this.MapLaout.setPosition(0, 0, 0);
            this.scrollToNormal();
        } catch (error) {
            console.error('Error initializing units:', error);
        }
    }

    compareUnitNames(a: UnitItemStatus, b: UnitItemStatus): number {
        const unitA = a.unit_name.replace(/\s+/g, '');
        const unitB = b.unit_name.replace(/\s+/g, '');

        const isANumber = !isNaN(Number(unitA));
        const isBNumber = !isNaN(Number(unitB));

        if (isANumber && isBNumber) {
            return Number(unitA) - Number(unitB);
        }

        if (isANumber !== isBNumber) {
            return isANumber ? 1 : -1;
        }

        const partsA = unitA.split(/(\d+)/).filter(Boolean);
        const partsB = unitB.split(/(\d+)/).filter(Boolean);

        for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
            const partA = partsA[i];
            const partB = partsB[i];
            const numA = parseInt(partA, 10);
            const numB = parseInt(partB, 10);

            if (!isNaN(numA) && !isNaN(numB)) {
                if (numA !== numB) {
                    return numA - numB;
                }
            } else {
                const comparison = partA.localeCompare(partB);
                if (comparison !== 0) {
                    return comparison;
                }
            }
        }

        return partsA.length - partsB.length;
    }

    scrollToNormal() {
        if (this._pointItems.length === 0) return;

        const content_script = this.contentNode.getComponent(MapTouchBetterController);
        const itemNode = this._pointItems[0];
        const uiTransform = itemNode.getComponent(UITransform);
        const worldPos = itemNode.getWorldPosition();
        worldPos.x -= uiTransform.width;
        content_script.moveToTargetPos(worldPos);
    }

    
    addMapBg(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ResLoader.instance.load("adventure/bg/long_background/bg_map_01/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    reject(err);
                } else {
                    const map_count = ChallengeUtil.calculateMapsNeeded(this._total_grade, MapCoordinates.length);
                    const bgNodes: Node[] = [];
                    for (let index = 0; index < map_count; index++) {
                        let bgNode: Node = PoolMgr.getNodePool("bgNodePool").size() > 0
                            ? PoolMgr.getNodeFromPool("bgNodePool")
                            : ImgUtil.create_2DNode(`bg_map_${index}`);

                        bgNode.name = `bg_map_${index}`;
                        bgNode.addComponent(Sprite).spriteFrame = spriteFrame;
                        const uiTrans = bgNode.getComponent(UITransform);
                        uiTrans.anchorPoint = new Vec2(0.5, 0.5);
                        bgNodes.push(bgNode);
                    }

                    for (const bgNode of bgNodes) {
                        this.MapLaout.addChild(bgNode);
                    }

                    this.MapLaout.getComponent(Layout).updateLayout();
                    resolve();
                }
            });
        });
    }

    setClickCallback(callback: (itemStatus: UnitItemStatus, gate: GateListItem) => void) {
        this._clickCallback = callback;
    }

    onItemClick(point: Node) {
        const item = point.getComponent(MapPointItem);
        this._curLevelIndex = item.index;
        const data = item.data;
        const itemStatus = this._unitStatus.find(item => item.unit_name === data.big_id);
        const small_id = data.small_id;
        const gate = itemStatus.gate_list[small_id - 1];

        EventMgr.dispatch(EventType.Goto_Textbook_Level, {
            itemStatus,
            gate,
            isNext: false
        } as GotoUnitLevel);
    }

    gotoNextTextbookLevel() {
        const next_level = this._curLevelIndex + 1;
        if (next_level >= this._pointItems.length) {
            ViewsManager.showTip(TextConfig.All_level_Tip);
            return;
        }

        const point = this._pointItems[next_level];
        const item = point.getComponent(MapPointItem);
        this._curLevelIndex = item.index;
        const data = item.data;
        const itemStatus = this._unitStatus.find(item => item.unit_name === data.big_id);
        const small_id = data.small_id;
        const gate = itemStatus.gate_list[small_id - 1];

        EventMgr.dispatch(EventType.Goto_Break_Through_Textbook_Next_Level, {
            itemStatus,
            gate,
            isNext: true
        } as GotoUnitLevel);
    }

    removePointEvent() {
        // Optionally clean up when removing points
        // this.MapLaout.removeAllChildren();
    }
}
