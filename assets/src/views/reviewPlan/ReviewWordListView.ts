import { _decorator, Node, Sprite, SpriteFrame } from 'cc';
import { ViewsMgr } from '../../manager/ViewsManager';
import { s2cReviewPlanList } from '../../models/NetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ReviewWordInfo, ReviewWordItem } from './ReviewWordItem';
const { ccclass, property } = _decorator;

export enum ReviewSourceType {
    classification = 1,//教材单词
    word_game = 2,//单词大冒险
}

enum ReviewType {
    today = "today",//今日复习
    all = "all",//所有复习
}

@ccclass('ReviewWordListView')
export class ReviewWordListView extends BaseComponent {
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

    private _souceType: ReviewSourceType = null;//来源类型
    private _reviewType: ReviewType = null;//复习类型
    private _data: ReviewWordInfo[] = [];//复习规划列表数据
    private _today: number = 0;//今日日期

    onLoad() {
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

        this.addEvent(InterfacePath.c2sReviewPlanList, this.onRepReviewPlanList.bind(this));
    }
    /**移除事件 */
    private removeEvent(): void {
        CCUtil.offTouch(this.btnClose, this.onClickClose, this);
        CCUtil.offTouch(this.btnTodayReview, this.onClickTodayReview, this);
        CCUtil.offTouch(this.btnReview, this.onClickReview, this);

        this.clearEvent();
    }
    /**初始化 */
    public init(souceType: ReviewSourceType): void {
        this._souceType = souceType;
        this.showList(ReviewType.today);
    }
    /**关闭按钮点击 */
    public onClickClose(): void {
        this.node.destroy();
    }
    /**今日复习按钮点击 */
    public onClickTodayReview(): void {
        this.showList(ReviewType.today);
    }
    /**全部待复习按钮点击 */
    public onClickReview(): void {
        this.showList(ReviewType.all);
    }
    /**显示list */
    public showList(type: ReviewType): void {
        if (type == this._reviewType) return;
        this._reviewType = type;
        if (ReviewType.today == type) {
            this.btnTodayReview.spriteFrame = this.btnTitleFrames[0];
            this.btnReview.spriteFrame = this.btnTitleFrames[1];
        } else {
            this.btnTodayReview.spriteFrame = this.btnTitleFrames[1];
            this.btnReview.spriteFrame = this.btnTitleFrames[0];
        }

        this._data = [];
        ServiceMgr.studyService.reqReviewPlanList(this._souceType, type);
    }
    /**加载list列表 */
    onLoadListItem(item: Node, idx: number): void {
        item.getComponent(ReviewWordItem).init(this._data[idx], this._today);
    }
    /**复习规划列表返回 */
    onRepReviewPlanList(data: s2cReviewPlanList): void {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        this._today = data.today_timestamp;
        data.need_review_list.forEach(item => {
            let info = this._data.find(obj => obj.w_id == item.w_id);
            if (!info) {
                info = new ReviewWordInfo();
                info.w_id = item.w_id;
                this._data.push(info);
            }
            info.word = item.word;
            info.next_review_time = item.next_review_time;
        });
        this.listView.numItems = this._data.length;
    }
}

