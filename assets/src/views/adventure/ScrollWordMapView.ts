import { Layout, Node, Prefab, Sprite, SpriteFrame, UITransform, Vec2, Vec3, _decorator, instantiate, view } from 'cc';
import { EventType } from '../../config/EventType';
import { TextConfig } from '../../config/TextConfig';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { GateData, IslandProgressModel } from '../../models/AdventureModel';
import { BaseView } from '../../script/BaseView';
import ImgUtil from '../../util/ImgUtil';
import { PoolMgr } from '../../util/PoolUtil';
import { MapPointItem } from '../adventure/levelmap/MapPointItem';
import ChallengeUtil from '../Challenge/ChallengeUtil';
import { MapTouchBetterController } from '../Challenge/MapCom/MapTouchBetterController';

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

@ccclass('ScrollWordMapView')
export class ScrollWordMapView extends BaseView {
    @property(Node)
    MapLayout: Node = null;

    @property(Node)
    contentNode: Node = null;

    @property(Prefab)
    mapItemPrefab: Prefab = null;
    private _unitStatus: GateData[] = [];
    private _pointItems: Node[] = [];
    private _totalGrade = 0;
    private _passGrade = 0;
    public _curLevelIndex: number = 0;
    private _itemWidth: number = 0;
    private _itemHeight: number = 0;

    protected initUI(): void {
        this.offViewAdaptSize();
        const uiTransform = this.mapItemPrefab.data.getComponent(UITransform);
        this._itemWidth = uiTransform.width;
        this._itemHeight = uiTransform.height;
    }

    onInitModuleEvent() {
        this.addModelListener(EventType.Goto_Textbook_Next_Level, this.gotoNextTextbookLevel);
    }

    async loadMapItems() {
        this._pointItems = [];
        let unitCount = 0;

        for (const itemData of this._unitStatus) {
            const coordinate = MapCoordinates[unitCount % MapCoordinates.length];
            const point: MapCoordinate = {
                x: coordinate.x - 1095,
                y: coordinate.y
            };

            let itemNode: Node = PoolMgr.getNodePool("mapItemPool").size() > 0
                ? PoolMgr.getNodeFromPool("mapItemPool")
                : instantiate(this.mapItemPrefab);
            
            const itemScript = itemNode.getComponent(MapPointItem);
            itemScript.initGateData(itemData);
            itemScript.clearAni();
            if(unitCount === this._passGrade-1){
                itemScript.showPlayerAndPet();
            }
            if(unitCount === this._totalGrade-1){
                itemScript.initBoss();
            }
            const mapCount = ChallengeUtil.calculateMapsNeeded(unitCount + 1, MapCoordinates.length);
            const mapNode = this.MapLayout.getChildByName(`bg_map_${mapCount - 1}`);
            itemNode.setPosition(point.x, point.y, 0);
            mapNode.addChild(itemNode);
            this._pointItems.push(itemNode);
            unitCount++;
        }
    }

    async initWordLevel(data: IslandProgressModel) {
        console.log("initWordLevel", data);
        this._unitStatus = data.gate_list;
        this._totalGrade = data.gate_total_num;
        this._passGrade = data.gate_pass_num;
        this.MapLayout.children.forEach(map => {
            PoolMgr.recycleNodes("mapItemPool", map.children);
        });
        PoolMgr.recycleNodes("bgNodePool", this.MapLayout.children);
        this.MapLayout.removeAllChildren();
        try {
            await this.addMapBackground();
            await this.loadMapItems();
            this.MapLayout.setPosition(0, 0, 0);
            this.scrollToNormal();
        } catch (error) {
            console.error('Error initializing units:', error);
        }
    }

    private scrollToNormal() {
        if (this._pointItems.length === 0) return;
        const contentScript = this.contentNode.getComponent(MapTouchBetterController);
        const firstItem = this._pointItems[0];
        const itemPosition = firstItem.getWorldPosition();
        const uiTransform = firstItem.getComponent(UITransform);
        itemPosition.x -= uiTransform.width;

        contentScript.moveToTargetPos(itemPosition);
        contentScript.setTouchMoveCallback((nodePos: Vec3) => this.updateVisibleItems(nodePos));

        const index = 0;
        this.updateVisibleItems(new Vec3(MapCoordinates[index].x, MapCoordinates[index].y, 0));
    }

    private updateVisibleItems(nodePos: Vec3) {
        const visibleSize = view.getVisibleSize();
        const viewBounds = {
            left: nodePos.x - visibleSize.width,
            right: nodePos.x + visibleSize.width,
            top: nodePos.y + visibleSize.height,
            bottom: nodePos.y - visibleSize.height
        };

        this._pointItems.forEach(item => {
            const itemPos = item.getWorldPosition();
            const itemBounds = {
                left: itemPos.x - this._itemWidth / 2,
                right: itemPos.x + this._itemWidth / 2,
                top: itemPos.y + this._itemHeight / 2,
                bottom: itemPos.y - this._itemHeight / 2
            };

            item.active = !(itemBounds.right <= viewBounds.left || itemBounds.left >= viewBounds.right ||
                itemBounds.top <= viewBounds.bottom || itemBounds.bottom >= viewBounds.top);
        });
    }

    private addMapBackground(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ResLoader.instance.load("adventure/bg/long_background/bg_map_01/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    return reject(err);
                }

                const mapCount = ChallengeUtil.calculateMapsNeeded(this._totalGrade, MapCoordinates.length);
                const bgNodes: Node[] = [];
                for (let i = 0; i < mapCount; i++) {
                    let bgNode: Node = PoolMgr.getNodePool("bgNodePool").size() > 0
                        ? PoolMgr.getNodeFromPool("bgNodePool")
                        : ImgUtil.create_2DNode(`bg_map_${i}`);

                    bgNode.name = `bg_map_${i}`;
                    bgNode.addComponent(Sprite).spriteFrame = spriteFrame;
                    const uiTrans = bgNode.getComponent(UITransform);
                    uiTrans.anchorPoint = new Vec2(0.5, 0.5);
                    bgNodes.push(bgNode);
                }

                bgNodes.forEach(bgNode => this.MapLayout.addChild(bgNode));
                this.MapLayout.getComponent(Layout).updateLayout();
                resolve();
            });
        });
    }

    private gotoNextTextbookLevel() {
        const nextIndex = this._curLevelIndex + 1;
        if (nextIndex >= this._pointItems.length) {
            ViewsManager.showTip(TextConfig.All_level_Tip);
            return;
        }
        return
        // const nextItem = this._pointItems[nextIndex];
        // const item = nextItem.getComponent(MapPointItem);
        // this._curLevelIndex = item.index;
        // const data = item.data;
        // const itemStatus = this._unitStatus.find(status => status.unit_name === data.big_id);
        // const gate = itemStatus.gate_list[data.small_id - 1];

        // EventMgr.dispatch(EventType.Goto_Break_Through_Textbook_Next_Level, {
        //     itemStatus,
        //     gate,
        //     isNext: true
        // } as GotoUnitLevel);
    }
}

