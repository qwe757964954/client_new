import { CCFloat, CCInteger, Component, Node, Prefab, ScrollView, UITransform, Vec3, _decorator, instantiate, isValid } from 'cc';
import { DateListItemNew } from './DateListItemNew';

const { ccclass, property } = _decorator;

@ccclass('DateListView')
export class DateListView extends Component {
    @property(ScrollView)
    public scrollView: ScrollView = null;

    @property(Prefab)
    public itemPrefab: Prefab = null; 

    @property({ type: CCInteger })
    direction: number = 1; // 1 for vertical, others for horizontal

    @property({ type: CCInteger })
    spawnCount: number = 1; // Number of items to spawn

    @property({ type: CCFloat })
    spacingY: number = 0; // Vertical spacing

    @property({ type: CCFloat })
    spacingX: number = 0; // Horizontal spacing

    @property({ type: CCFloat })
    itemHeight: number = 0; // Item height

    @property({ type: CCFloat })
    itemWidth: number = 0; // Item width

    @property({ type: CCInteger })
    colNum: number = 0; // Number of columns for vertical layout

    @property({ type: CCInteger })
    rowNum: number = 0; // Number of rows for horizontal layout

    private initialized = false;
    private dataList: any[] = [];
    private totalCount: number = 0;
    private content: Node = null;
    private updateTimer: number = 0;
    private updateInterval: number = 0.05;
    private lastContentPos: Vec3 = new Vec3();
    private bufferZone: Vec3 = new Vec3();
    private callback: Function = null;
    public itemList: Node[] = [];
    private obj:any = null;
    onLoad(): void {}

    start() {}

    init(list: any[], params: any) {
        if (this.initialized) return;
        this.obj = params;
        this.dataList = list || [];
        this.totalCount = this.dataList.length;
        this.content = this.scrollView.content;
        this.bufferZone.set(
            Math.ceil(this.spawnCount / (this.direction === 1 ? this.colNum : this.rowNum)) * (this.direction === 1 ? (this.itemHeight + this.spacingY) : (this.itemWidth + this.spacingX)) / 2,
            Math.ceil(this.spawnCount / (this.direction === 1 ? this.colNum : this.rowNum)) * (this.direction === 1 ? (this.itemHeight + this.spacingY) : (this.itemWidth + this.spacingX)) / 2
        );

        this.initialize();
        this.initialized = true;
        this.callback = null;
    }

    removeAllItems() {
        // this.itemList.forEach(item => item && item.destroy());
        for (const key in this.itemList) {
            if (Object.prototype.hasOwnProperty.call(this.itemList, key)) {
                if (this.itemList[key]) {
                    this.itemList[key] = null;
                }
            }
        }

        this.itemList = [];
        if (this.content) {
            this.content.removeAllChildren();
        }
    }

    private initialize() {
        const itemCount = Math.min(this.spawnCount, this.totalCount);

        if (this.direction === 1) {
            this.content.getComponent(UITransform).height = Math.ceil(this.totalCount / this.colNum) * (this.itemHeight + this.spacingY) + this.spacingY;

            for (let i = 0; i < itemCount; i++) {
                this.createItem(i, this.getVerticalPosition(i));
            }
        } else {
            this.content.getComponent(UITransform).width = Math.ceil(this.totalCount / this.rowNum) * (this.itemWidth + this.spacingX) + this.spacingX;

            for (let i = 0; i < itemCount; i++) {
                this.createItem(i, this.getHorizontalPosition(i));
            }
        }
    }

    private createItem(index: number, position: Vec3) {
        const item = instantiate(this.itemPrefab);
        this.content.addChild(item);
        item.active = true;
        item.setPosition(position);
        const itemComp = item.getComponent(DateListItemNew);
        itemComp.index = index;
        itemComp.updateItem(index, this.dataList[index], this.obj);
        this.itemList.push(item);
    }

    private getVerticalPosition(index: number): Vec3 {
        const row = Math.floor(index / this.colNum);
        const col = index % this.colNum;
        const x = (this.itemWidth + this.spacingX) * (-(this.colNum - 1) / 2 + col);
        const y = -this.itemHeight * (0.5 + row) - this.spacingY;
        return new Vec3(x, y, 0);
    }

    private getHorizontalPosition(index: number): Vec3 {
        const row = Math.floor(index / this.rowNum);
        const col = index % this.rowNum;
        const x = -this.itemWidth * (0.5 + row) - this.spacingX * (col + 1);
        const y = (this.itemHeight + this.spacingY) * ((this.rowNum - 1) / 2 - col);
        return new Vec3(x, y, 0);
    }

    getPositionInView(item: Node): Vec3 {
        if (isValid(item) && isValid(item.parent)) {
            const worldPos = item.parent.getComponent(UITransform).convertToWorldSpaceAR(item.getPosition());
            return this.scrollView.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        }
        return new Vec3();
    }

    update(dt: number) {
        if (!this.initialized) return;
        this.updateTimer += dt;

        if (this.updateTimer < this.updateInterval || this.itemList.length <= 0) return;

        this.updateTimer = 0;
        const items = this.itemList;
        const isVertical = this.direction === 1;

        if (isVertical) {
            this.updateVertical(items);
        } else {
            this.updateHorizontal(items);
        }
    }

    private updateVertical(items: Node[]) {
        const isDown = this.content.getPosition().y < this.lastContentPos.y;
        const offset = (this.itemHeight + this.spacingY) * Math.ceil(this.spawnCount / this.colNum);
        const newY = new Vec3(0, 0, 0);

        items.forEach(item => {
            const viewPos = this.getPositionInView(item);
            if (isDown) {
                newY.set(item.getPosition().x, item.getPosition().y + offset, 0);
                if (viewPos.y < -this.bufferZone.y && newY.y < 0) {
                    this.updateItemPosition(item, newY, true);
                }
            } else {
                newY.set(item.getPosition().x, item.getPosition().y - offset, 0);
                if (viewPos.y > this.bufferZone.y && newY.y > -this.content.getComponent(UITransform).height) {
                    this.updateItemPosition(item, newY, false);
                }
            }
        });

        this.lastContentPos.y = this.content.getPosition().y;
    }

    private updateHorizontal(items: Node[]) {
        const isLeft = this.content.getPosition().x < this.lastContentPos.x;
        const offset = (this.itemWidth + this.spacingX) * Math.ceil(this.spawnCount / this.rowNum);
        const newX = new Vec3(0, 0, 0);

        items.forEach(item => {
            const viewPos = this.getPositionInView(item);
            if (isLeft) {
                newX.set(item.getPosition().x + offset, item.getPosition().y, 0);
                if (viewPos.x < -this.bufferZone.x && newX.x < this.content.getComponent(UITransform).width) {
                    this.updateItemPosition(item, newX, true);
                }
            } else {
                newX.set(item.getPosition().x - offset, item.getPosition().y, 0);
                if (viewPos.x > this.bufferZone.x && newX.x > 0) {
                    this.updateItemPosition(item, newX, false);
                }
            }
        });

        this.lastContentPos.x = this.content.getPosition().x;
    }

    private updateItemPosition(item: Node, newPosition: Vec3, isDownOrLeft: boolean) {
        item.setPosition(newPosition);
        const itemComp = item.getComponent(DateListItemNew);
        const index = itemComp.index + (isDownOrLeft ? -this.itemList.length : this.itemList.length);
        itemComp.index = index;
        itemComp.updateItem(index, this.dataList[index], this.obj);
    }

    updateData(list?: any[], isSplitLoad?: boolean, notScrollToTop?: boolean) {
        this.dataList = list || [];
        const shouldScrollToTop = this.dataList.length > this.spawnCount;

        this.scrollView.stopAutoScroll();
        if (isSplitLoad) {
            this.updateDataAndSplitLoad(this.dataList);
            return;
        }

        if (this.direction === 1) {
            if (!notScrollToTop || !shouldScrollToTop) {
                this.scrollView.scrollToTop();
            }
            this.updateVerticalData();
        } else {
            if (!notScrollToTop || !shouldScrollToTop) {
                this.scrollView.scrollToLeft();
            }
            this.updateHorizontalData();
        }
    }

    private updateVerticalData() {
        const itemCount = Math.min(this.spawnCount, this.totalCount);
        for (let i = 0; i < itemCount; i++) {
            if (i >= this.itemList.length) {
                this.createItem(i, this.getVerticalPosition(i));
            } else {
                this.updateItemPosition(this.itemList[i], this.getVerticalPosition(i), true);
            }
        }
        this.itemList.splice(itemCount, this.itemList.length - itemCount);
    }

    private updateHorizontalData() {
        const itemCount = Math.min(this.spawnCount, this.totalCount);
        for (let i = 0; i < itemCount; i++) {
            if (i >= this.itemList.length) {
                this.createItem(i, this.getHorizontalPosition(i));
            } else {
                this.updateItemPosition(this.itemList[i], this.getHorizontalPosition(i), true);
            }
        }
        this.itemList.splice(itemCount, this.itemList.length - itemCount);
    }

    private updateDataAndSplitLoad(list: any[]) {
        this.removeAllItems();
        this.dataList = list || [];
        this.totalCount = this.dataList.length;
        this.initialize();
    }

    onDestroy() {
        // this.removeAllItems();
    }
}
