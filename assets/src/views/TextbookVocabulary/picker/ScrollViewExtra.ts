import { CCInteger, Color, Component, Node, ScrollView, _decorator, math } from 'cc';
import { DateListItemNew } from './DateListItemNew';
import { DateListView } from './DateListView';

const { ccclass, property } = _decorator;

@ccclass('ScrollViewExtra')
export class ScrollViewExtra extends Component {
    @property(ScrollView)
    scrollView: ScrollView = null;

    @property(DateListView)
    listViewExtra: DateListView = null;

    @property({ type: CCInteger })
    public totalCount: number = 0;

    private nowOffsetY: number = 0;
    private selectChildren: Node[] = [];
    private selectChildIndex: number = 0;
    private listData: string[] = [];
    private contentY: number = null;
    private _selectCallFunc: (select_num: number) => void = null;
    private numberString:string = "";
    onLoad(): void {
        this.node.off(Node.EventType.MOUSE_WHEEL);
    }

    setTotalLevel(total: number) {
        this.totalCount = total;
        this.resetState();
        this.initializeList();
    }

    initSelectCallFunc(callFunc: (select_num: number) => void) {
        this._selectCallFunc = callFunc;
    }

    private initializeList() {
        this.listViewExtra.init([], this);
        this.listData = Array.from({ length: this.totalCount }, (_, i) => (i + 1).toString());
        this.listData.unshift(" ");
        this.listData.push(" ");
        this.addScrollChildIndex();
    }

    private resetState() {
        this.nowOffsetY = 0;
        this.selectChildren = [];
        this.selectChildIndex = 0;
    }

    private addScrollChildIndex() {
        this.scrollView.node.on(ScrollView.EventType.SCROLLING, () => this.onScrolling(), this);
        this.scrollView.node.on(ScrollView.EventType.SCROLL_ENDED, () => this.onScrollEnd(), this);
        this.nowOffsetY = this.scrollView.getScrollOffset().y;
        this.listViewExtra.updateData(this.listData, true);
        this.updateListSelectChildren();
        this.setSelectChildIndex(0);
    }
    private updateListSelectChildren() {
        const itemHeight = this.listViewExtra.itemHeight;
        this.selectChildren = this.listViewExtra.itemList
            .map((itemNode) => {
                const jsItem = itemNode.getComponent(DateListItemNew);
                const itemPos = this.listViewExtra.getPositionInView(itemNode);
                const absY = Math.abs(itemPos.y);

                if (jsItem.labNum.string.trim() !== "") {
                    return { itemNode, absY };
                }
                return null;
            })
            .filter(item => item !== null)
            .sort((a, b) => a.absY - b.absY)
            .map(({ itemNode }) => itemNode);

        console.log("updateListSelectChildren", this.selectChildren);

        if (this.selectChildren.length === 0) {
            this.selectChildIndex = -1;
            return;
        }

        this.selectChildIndex = this.selectChildren.findIndex(itemNode => {
            const itemPos = this.listViewExtra.getPositionInView(itemNode);
            console.log("itemPos.y.....", itemPos.y, itemHeight);
            return Math.abs(itemPos.y) < itemHeight / 2;
        });

        console.log("Selected item index:", this.selectChildIndex);
    }


    private getScrollChildOffset(): number {
        this.updateListSelectChildren();
        const itemHeight = this.listViewExtra.itemHeight;
        const maxOffset = this.scrollView.getMaxScrollOffset().y;
        const offset = this.scrollView.getScrollOffset().y;

        if (offset < 0) return 0;
        if (offset > maxOffset) return maxOffset;

        return Math.round(offset / itemHeight) * itemHeight;
    }
    private setSelectChildIndex(idx: number) {
        if (idx < 0 || idx >= this.selectChildren.length) {
            console.warn(`Invalid index: ${idx}`);
            if (this._selectCallFunc) {
                this._selectCallFunc(parseInt(this.numberString));
            }
            return;
        }

        this.selectChildren.forEach((itemNode, i) => {
            const jsItem = itemNode.getComponent(DateListItemNew);
            jsItem.labNum.color = i === idx ? Color.WHITE : new Color("#843C2F");
        });

        const selectedItem = this.selectChildren[idx]?.getComponent(DateListItemNew);
        if (selectedItem) {
            const numberString = selectedItem.labNum.string;
            if (parseInt(numberString) === this.totalCount) {
                const maxOffset = (this.totalCount - 1) * this.listViewExtra.itemHeight;
                this.scrollView.scrollToOffset(new math.Vec2(this.scrollView.getScrollOffset().x, maxOffset), 0);
            }

            if (this._selectCallFunc) {
                this._selectCallFunc(parseInt(numberString));
            }
        }
    }

    private onScrolling() {
        this.updateListSelectChildren();
        if (this.contentY !== null) {
            const deltaY = this.scrollView.content.getPosition().y - this.contentY;
            if (Math.abs(deltaY) <= 5) {
                this.scrollView.stopAutoScroll();
            }
        }
        this.contentY = this.scrollView.content.getPosition().y;
    }
    
    private onScrollEnd() {
        const offset = this.getScrollChildOffset();
        console.log("onScrollEnd.....",offset);
        console.log("onScrollEnd.....2",Math.abs(this.nowOffsetY - this.scrollView.getScrollOffset().y));
        if (Math.abs(this.nowOffsetY - this.scrollView.getScrollOffset().y) < 0.01) {
            this.setSelectChildIndex(this.selectChildIndex);
        } else {
            this.nowOffsetY = offset;
            this.scrollView.scrollToOffset(new math.Vec2(this.scrollView.getScrollOffset().x, this.nowOffsetY), 0.2);
        }
    }
    scrollToNumber(numberString: string) {
        this.numberString = numberString;
        const index = this.listData.findIndex(item => item === numberString);
        if (index !== -1) {
            this.updateListSelectChildren();
            let count = index-1;
            // Ensure the item height is correctly calculated
            const itemHeight = this.listViewExtra.itemHeight;
            const targetPositionY = itemHeight * count;

            // Get current scroll offset
            const scrollOffset = this.scrollView.getScrollOffset();

            // Calculate the scroll duration based on the distance
            const distance = Math.abs(targetPositionY - scrollOffset.y);
            const duration = Math.min((distance / itemHeight) * 0.08, 2); // Cap the max duration for smoother scrolling

            console.log(`Scrolling to ${numberString} at index ${index}. Target position: ${targetPositionY}`);
            console.log(`Current scroll offset: ${scrollOffset.y}`);
            console.log(`Calculated duration: ${duration}`);

            // Smoothly scroll to the target position
            this.scrollView.scrollToOffset(new math.Vec2(scrollOffset.x, targetPositionY), duration);
        } else {
            console.error(`Item with number ${numberString} not found.`);
        }
    }

}