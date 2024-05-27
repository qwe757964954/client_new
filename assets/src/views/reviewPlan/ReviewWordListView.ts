import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ReviewWordItem } from './ReviewWordItem';
const { ccclass, property } = _decorator;

@ccclass('ReviewWordListView')
export class ReviewWordListView extends Component {
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property(Sprite)
    public btnTodayReview: Sprite = null;//今日复习
    @property(Sprite)
    public btnReview: Sprite = null;//全部待复习
    @property(List)
    public listView: List = null;//单词列表
    @property([SpriteFrame])
    public btnTitleFrames: SpriteFrame[] = [];//按钮标题图片

    private _dataAry: any[] = [];

    start() {
        this.init();
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化事件 */
    private initEvent(): void {
        CCUtil.onTouch(this.btnClose, this.onClickClose, this);
        CCUtil.onTouch(this.btnTodayReview, this.onClickTodayReview, this);
        CCUtil.onTouch(this.btnReview, this.onClickReview, this);
    }
    /**移除事件 */
    private removeEvent(): void {
        CCUtil.offTouch(this.btnClose, this.onClickClose, this);
        CCUtil.offTouch(this.btnTodayReview, this.onClickTodayReview, this);
        CCUtil.offTouch(this.btnReview, this.onClickReview, this);
    }
    /**初始化 */
    public init(): void {
        this.showList(0);
    }
    /**关闭按钮点击 */
    public onClickClose(): void {
        this.node.destroy();
    }
    /**今日复习按钮点击 */
    public onClickTodayReview(): void {
        this.showList(0);
    }
    /**全部待复习按钮点击 */
    public onClickReview(): void {
        this.showList(1);
    }
    /**显示list */
    public showList(type: number): void {
        if (0 == type) {
            this.btnTodayReview.spriteFrame = this.btnTitleFrames[0];
            this.btnReview.spriteFrame = this.btnTitleFrames[1];
        } else {
            this.btnTodayReview.spriteFrame = this.btnTitleFrames[1];
            this.btnReview.spriteFrame = this.btnTitleFrames[0];
        }

        this._dataAry = [
            { word: "barely 1", mean: "1 adv.几乎不" },
            { word: "barely 2", mean: "2 adv.几乎不" },
            { word: "barely 3", mean: "3 adv.几乎不" },
            { word: "barely 4", mean: "4 adv.几乎不" },
            { word: "barely 5", mean: "5 adv.几乎不" },
            { word: "barely 6", mean: "6 adv.几乎不" },
            { word: "barely 7", mean: "7 adv.几乎不" },
            { word: "barely 8", mean: "8 adv.几乎不" },
            { word: "barely 9", mean: "9 adv.几乎不" },
            { word: "barely 10", mean: "10 adv.几乎不" },
        ];
        this.listView.numItems = this._dataAry.length;
    }
    /**加载list列表 */
    onLoadListItem(item: Node, idx: number): void {
        item.getComponent(ReviewWordItem).init(this._dataAry[idx]);
    }
}


