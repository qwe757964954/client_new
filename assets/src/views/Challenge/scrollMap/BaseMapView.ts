import { _decorator, instantiate, isValid, Layout, Node, Prefab, Size, Sprite, SpriteFrame, UITransform, Vec2, Vec3, view } from 'cc';
import { EventType } from '../../../config/EventType';
import { ResLoader } from '../../../manager/ResLoader';
import { UnitItemStatus } from '../../../models/TextbookModel';
import { BaseView } from '../../../script/BaseView';
import { PoolMgr } from '../../../util/PoolUtil';
import { MapTouchBetterController } from '../MapCom/MapTouchBetterController';
import { MapCoordinates } from './MapCoordinates';

const { ccclass, property } = _decorator;



@ccclass('BaseMapView')
export abstract class BaseMapView extends BaseView {
    @property(Node)
    MapLayout: Node = null;

    @property(Node)
    contentNode: Node = null;

    @property(Prefab)
    mapItemPrefab: Prefab = null;

    @property
    public moveOffset: number = 200;

    private bgFrame:SpriteFrame = null;

    // @property([Vec2])
    myCoordinates: Vec2[] = [];
    protected _unitStatus: any[] = [];
    protected _pointItems: Node[] = [];
    protected _totalGrade = 0;
    protected _passGrade = 0;
    public _curLevelIndex:number = 0;
    protected async initUI(): Promise<void> {
        this.mapItemPrefab.addRef();
        this.offViewAdaptSize();
    }
    onInitModuleEvent() {
        this.addModelListener(EventType.Update_Curent_Level_Index, this.updateCurLevelIndex);
    }
    private compareUnitNames(a: UnitItemStatus, b: UnitItemStatus): number {
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
    public async initMap(data: any) {
        this._unitStatus = data.gate_list || data.unit_list;
        if(isValid(data.unit_list)){
            this._unitStatus.sort(this.compareUnitNames);
        }
        this._totalGrade = data.gate_total_num || data.gate_total; 
        this._passGrade = isValid(data.gate_pass_num)? data.gate_pass_num:0; 
        this.myCoordinates = MapCoordinates.getInstance().getCoordinates(1);
        this.clearOldItems();

        try {
            await this.addMapBackground();
            await Promise.all([this.loadMapItems()]);
            this.scrollToNormal();
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }
    protected getItemNode(): Node {
        return PoolMgr.getNodePool("mapItemPool").size() > 0
            ? PoolMgr.getNodeFromPool("mapItemPool")
            : instantiate(this.mapItemPrefab);
    }
    protected abstract createItemNode(itemData: any, unitCount: number): Node[];

    private clearOldItems() {
        this.MapLayout.children.forEach(map => {
            PoolMgr.recycleNodes("mapItemPool", map.children);
        });
        PoolMgr.recycleNodes("bgNodePool", this.MapLayout.children);
        this.MapLayout.removeAllChildren();
    }

    private async loadMapItems(): Promise<void> {
        this._pointItems = [];
        let unitCount = 0;

        for (const itemData of this._unitStatus) {
            const itemNodes = this.createItemNode(itemData, unitCount);

            if (itemNodes.length > 0) {
                this.positionAndAddItems(itemNodes, unitCount);
                unitCount += itemNodes.length;
            } else if (itemNodes.length === 1) {
                this.positionAndAddItem(itemNodes[0], unitCount);
                unitCount++;
            }
        }
    }
    private positionAndAddItems(items: Node[], unitCount: number): void {
        for (const item of items) {
            this.positionAndAddItem(item, unitCount);
            unitCount++;
        }
    }

    private positionAndAddItem(item: Node, unitCount: number): void {
        const point = this.calculatePointPosition(unitCount);
        const mapCount = this.calculateMapsNeeded(unitCount + 1);
        const mapNode = this.MapLayout.getChildByName(`bg_map_${mapCount - 1}`);

        item.setPosition(point.x, point.y, 0);
        mapNode.addChild(item);
        this._pointItems.push(item);
    }
    private calculatePointPosition(unitCount: number): Vec2 {
        const coordinate = this.myCoordinates[unitCount % this.myCoordinates.length];
        return new Vec2(coordinate.x - 1095, coordinate.y);
    }

    private calculateMapsNeeded(index: number): number {
        // Placeholder logic, to be replaced with actual map calculation
        return Math.ceil(index / this.myCoordinates.length);
    }

    private async addMapBackground(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if(!this.bgFrame){
                this.bgFrame = await ResLoader.instance.loadAsyncPromise<SpriteFrame>('adventure/bg/long_background/bg_map_01/spriteFrame', SpriteFrame);
                this.bgFrame.addRef();
            }
            const mapCount = this.calculateMapsNeeded(this._totalGrade);
            this.createBackgroundNodes(mapCount, this.bgFrame)
                .forEach(bgNode => this.MapLayout.addChild(bgNode));
            this.MapLayout.getComponent(Layout).updateLayout();
            resolve();
        });
    }

    private createBackgroundNodes(mapCount: number, spriteFrame: SpriteFrame): Node[] {
        const bgNodes: Node[] = [];
        for (let i = 0; i < mapCount; i++) {
            const bgNode = this.getBackgroundNode();
            bgNode.name = `bg_map_${i}`;
            if(!isValid(bgNode.getComponent(Sprite))){
                bgNode.addComponent(Sprite)
            }
            bgNode.getComponent(Sprite).spriteFrame = spriteFrame;
            const uiTrans = bgNode.getComponent(UITransform);
            uiTrans.anchorPoint = new Vec2(0.5, 0.5);
            bgNodes.push(bgNode);
        }
        return bgNodes;
    }

    private getBackgroundNode(): Node {
        return PoolMgr.getNodePool("bgNodePool").size() > 0
            ? PoolMgr.getNodeFromPool("bgNodePool")
            : new Node('BackgroundNode'); // Placeholder, replace with actual node creation logic
    }

    public scrollToNormal() {
        this.MapLayout.setPosition(0, 0, 0);
        if (this._pointItems.length === 0) return;

        const contentScript = this.contentNode.getComponent(MapTouchBetterController);
        const firstItem = this._pointItems[this._passGrade];
        const itemPosition = this.calculateItemPosition(firstItem);
        const movePosition = this.calculateMovePosition(firstItem);
        contentScript.moveToTargetPos(movePosition);
        contentScript.setTouchMoveCallback((nodePos: Vec3) => this.updateVisibleItems(nodePos));
        this.updateVisibleItems(itemPosition);
    }

    private calculateMovePosition(itemNode: Node):Vec3{
        const itemPosition = itemNode.getWorldPosition();
        itemPosition.x -= this.moveOffset;
        return itemPosition;
    }

    private calculateItemPosition(itemNode: Node): Vec3 {
        let itemPosition = itemNode.getComponent(UITransform).convertToNodeSpaceAR(itemNode.getWorldPosition());
        const uiTransform = itemNode.getComponent(UITransform);
        itemPosition.x -= this.moveOffset;
        return itemPosition;
    }
        
    private updateVisibleItems(nodePos: Vec3) {
        const visibleSize = view.getVisibleSize();
        const viewBounds = this.getViewBounds(nodePos, visibleSize);

        this._pointItems.forEach(item => {
            const itemPos = item.getWorldPosition();
            const itemBounds = this.getItemBounds(itemPos);
            item.active = !this.isItemOutOfBounds(itemBounds, viewBounds);
        });
    }

    private getViewBounds(nodePos: Vec3, visibleSize: Size) {
        return {
            left: nodePos.x - visibleSize.width,
            right: nodePos.x + visibleSize.width,
            top: nodePos.y + visibleSize.height,
            bottom: nodePos.y - visibleSize.height
        };
    }

    private getItemBounds(itemPos: Vec3) {
        const uiTransform = this.mapItemPrefab.data.getComponent(UITransform);
        return {
            left: itemPos.x - uiTransform.width / 2,
            right: itemPos.x + uiTransform.width / 2,
            top: itemPos.y + uiTransform.height / 2,
            bottom: itemPos.y - uiTransform.height / 2
        };
    }

    private isItemOutOfBounds(itemBounds: any, viewBounds: any) {
        return itemBounds.right <= viewBounds.left || 
               itemBounds.left >= viewBounds.right || 
               itemBounds.top <= viewBounds.bottom || 
               itemBounds.bottom >= viewBounds.top;
    }

    public updateCurLevelIndex(index: number): void {
        this._curLevelIndex = index;
    }
    onDestroy(){
        super.onDestroy();
        this.mapItemPrefab.decRef();
        this.bgFrame.decRef();
    }
    public abstract gotoNextLevel(): void;
}
