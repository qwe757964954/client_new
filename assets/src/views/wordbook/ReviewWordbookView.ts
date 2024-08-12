import { _decorator, EventTouch, Node } from 'cc';
import { ViewsMgr } from '../../manager/ViewsManager';
import { s2cReviewPlanList } from '../../models/NetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ReviewSourceType } from '../reviewPlan/ReviewWordListView';
import { WordItemInfo } from './WordItem';
const { ccclass, property } = _decorator;

@ccclass('ReviewWordbookView')
export class ReviewWordbookView extends BaseComponent {
    @property(List)
    public list: List = null;
    @property(Node)
    public btnReview: Node = null;
    @property([Node])
    public btnSortAry: Node[] = [];
    @property(Node)
    public btnShowCn: Node = null;

    private _isInit: boolean = false;
    private _lastSelectTab: Node = null;
    private _showCnFlag: boolean = false;
    private _souceType: ReviewSourceType = null;//来源类型
    // private _reviewType: ReviewType = null;//复习类型
    private _listData: WordItemInfo[] = [];//复习规划列表数据
    private _today: number = 0;//今日日期

    protected onLoad(): void {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.clearEvent();
    }

    private initEvent() {
        CCUtil.onTouch(this.btnReview, this.onBtnReview, this);
        CCUtil.onTouch(this.btnShowCn, this.onBtnShowCn, this);
        for (let i = 0; i < this.btnSortAry.length; i++) {
            const element = this.btnSortAry[i];
            element["idx"] = i;
            CCUtil.onTouch(element, this.onBtnSort, this);
        }

        this.addEvent(InterfacePath.c2sReviewPlanList, this.onRepReviewPlanList.bind(this));
    }
    protected onEnable(): void {
        if (this._isInit) {
            if (this._lastSelectTab) {
                this._lastSelectTab.active = false;
                this._lastSelectTab = null;
            }
            this.onSortByNode(this.btnSortAry[0]);
        }
    }

    public init(souceType: ReviewSourceType): void {
        this._souceType = souceType;
        this.onSortByNode(this.btnSortAry[0]);
    }

    private onLoadList(node: Node, idx: number) {
        let data = this._listData[idx];
        data.idx = idx;
        data.isSelect = null;
        data.isShowCn = this._showCnFlag;
        // node.getComponent(WordItem).init(data);
    }

    private onBtnReview() {

    }
    private onSortByNode(node: Node) {
        let tabNode = node.getChildByName("img_tab");
        if (this._lastSelectTab == tabNode) return;
        tabNode.active = true;
        let idx = node["idx"];
        if (this._lastSelectTab) {
            this._lastSelectTab.active = false;
        }
        this._lastSelectTab = tabNode;
        let type;
        if (0 == idx) {
            type = "today";
        } else {
            type = "all";
        }
        // this.list.node.active = false;
        ServiceMgr.studyService.reqReviewPlanList(this._souceType, type);
    }
    private onBtnSort(event: EventTouch) {
        let node: Node = event.currentTarget;
        this.onSortByNode(node);

    }
    private onBtnShowCn() {
        let tabNode = this.btnShowCn.getChildByName("img_tab");
        this._showCnFlag = !tabNode.active;
        tabNode.active = this._showCnFlag;
        this.list.updateAll();
    }

    /**复习规划列表返回 */
    onRepReviewPlanList(data: s2cReviewPlanList): void {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        this._today = data.today_timestamp;
        data.need_review_list.forEach(item => {
            let info = this._listData.find(obj => obj.w_id == item.w_id);
            if (!info) {
                info = new WordItemInfo();
                info.w_id = item.w_id;
                this._listData.push(info);
            }
            info.word = item.word;
            info.cn = item.cn;
            info.next_review_time = item.next_review_time;
        });
        // this.list.node.active = true;
        this.list.numItems = this._listData.length;
    }
}


