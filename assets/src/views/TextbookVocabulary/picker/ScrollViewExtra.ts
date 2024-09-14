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
    private numberString: string = "";

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
        this.scrollView.node.on(ScrollView.EventType.SCROLLING, this.onScrolling, this);
        this.scrollView.node.on(ScrollView.EventType.SCROLL_ENDED, this.onScrollEnd, this);
        this.nowOffsetY = this.scrollView.getScrollOffset().y;
        this.listViewExtra.updateData(this.listData, true);
        this.updateListSelectChildren();
        this.setSelectChildIndex(0);
    }

    private updateListSelectChildren() {
        const itemHeight = this.listViewExtra.itemHeight;

        this.selectChildren = this.listViewExtra.itemList
            .map(itemNode => {
                const jsItem = itemNode.getComponent(DateListItemNew);
                const itemPos = this.listViewExtra.getPositionInView(itemNode);
                return jsItem.labNum.string.trim() ? { itemNode, absY: Math.abs(itemPos.y) } : null;
            })
            .filter(item => item !== null)
            .sort((a, b) => a.absY - b.absY)
            .map(({ itemNode }) => itemNode);

        if (this.selectChildren.length === 0) {
            this.selectChildIndex = -1;
            return;
        }

        const itemHeightHalf = this.listViewExtra.itemHeight / 2;
        this.selectChildIndex = this.selectChildren.findIndex(itemNode => {
            const itemPos = this.listViewExtra.getPositionInView(itemNode);
            return Math.abs(itemPos.y) < itemHeightHalf;
        });
    }

    private getScrollChildOffset(): number {
        this.updateListSelectChildren();
        const itemHeight = this.listViewExtra.itemHeight;
        const maxOffset = this.scrollView.getMaxScrollOffset().y;
        const offset = this.scrollView.getScrollOffset().y;

        return Math.max(0, Math.min(maxOffset, Math.round(offset / itemHeight) * itemHeight));
    }

    private setSelectChildIndex(idx: number) {
        if (idx < 0 || idx >= this.selectChildren.length) {
            this.scrollToIndexByNumberString();
            return;
        }

        this.selectChildren.forEach((itemNode, i) => {
            const jsItem = itemNode.getComponent(DateListItemNew);
            jsItem.labNum.color = i === idx ? Color.WHITE : new Color("#843C2F");
        });

        const selectedItem = this.selectChildren[idx]?.getComponent(DateListItemNew);
        if (selectedItem) {
            this.handleSelectedItem(selectedItem);
        }
    }

    private scrollToIndexByNumberString() {
        const index = this.listData.indexOf(this.numberString);
        if (index === -1) return;

        const itemHeight = this.listViewExtra.itemHeight;
        const targetPositionY = itemHeight * index;

        if (targetPositionY !== this.scrollView.getScrollOffset().y) {
            this.scrollView.scrollToOffset(new math.Vec2(this.scrollView.getScrollOffset().x, targetPositionY), 0.2);
        } else if (this._selectCallFunc) {
            this._selectCallFunc(parseInt(this.numberString));
            this.numberString = "";
        }
    }

    private handleSelectedItem(selectedItem: DateListItemNew) {
        const numberString = selectedItem.labNum.string;
        if (parseInt(numberString) === this.totalCount) {
            const maxOffset = (this.totalCount - 1) * this.listViewExtra.itemHeight;
            this.scrollView.scrollToOffset(new math.Vec2(this.scrollView.getScrollOffset().x, maxOffset), 0);
        }

        if (this.numberString.length > 0 && numberString !== this.numberString) {
            this.scrollToIndexByNumberString();
            return;
        }

        if (this._selectCallFunc) {
            this._selectCallFunc(parseInt(numberString));
            this.numberString = "";
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
        if (Math.abs(this.nowOffsetY - this.scrollView.getScrollOffset().y) < 0.01) {
            this.setSelectChildIndex(this.selectChildIndex);
        } else {
            this.nowOffsetY = offset;
            this.scrollView.scrollToOffset(new math.Vec2(this.scrollView.getScrollOffset().x, this.nowOffsetY), 0.0001);
        }
    }

    scrollToNumber(numberString: string) {
        this.numberString = numberString;
        const index = this.listData.indexOf(numberString);
        if (index === -1) {
            console.error(`Item with number ${numberString} not found.`);
            return;
        }

        this.updateListSelectChildren();
        const itemHeight = this.listViewExtra.itemHeight;
        const targetPositionY = itemHeight * (index - 1);

        const scrollOffset = this.scrollView.getScrollOffset();
        const distance = Math.abs(targetPositionY - scrollOffset.y);
        const duration = Math.min((distance / itemHeight) * 0.08, 2);

        if (targetPositionY !== scrollOffset.y) {
            this.scrollView.scrollToOffset(new math.Vec2(scrollOffset.x, targetPositionY), duration);
        } else if (this._selectCallFunc) {
            this._selectCallFunc(parseInt(this.numberString));
            this.numberString = "";
        }
    }
}
