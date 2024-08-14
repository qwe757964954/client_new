import { _decorator, EventTouch, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { WordModel, WordSourceType } from '../../config/WordConfig';
import { ViewsMgr } from '../../manager/ViewsManager';
import { s2cReviewPlanList, s2cReviewPlanStatus } from '../../models/NetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { GameSourceType } from '../adventure/sixModes/BaseModeView';
import { WordMeaningView } from '../adventure/sixModes/WordMeaningView';
import { WordDetailUI } from '../common/WordDetailUI';
import { ReviewWordModel } from '../reviewPlan/ReviewPlanView';
import { EducationLevel } from '../TextbookVocabulary/TextbookInfo';
import { WordItem, WordItemInfo } from './WordItem';
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
    private _souceType: GameSourceType = null;//来源类型
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
        this.addEvent(InterfacePath.c2sReviewPlanStatus, this.onRepReviewPlanStatus.bind(this));
        this.addEvent(EventType.Wordbook_List_Refresh, this.onWordbookListRefresh.bind(this));
    }
    protected onEnable(): void {
        if (this._isInit) {
            this.onStartListRefresh();
        }
    }

    public init(souceType: GameSourceType): void {
        if (this._isInit) return;
        this._souceType = souceType;
        this._isInit = true;
        this.onSortByNode(this.btnSortAry[0]);
    }

    private onLoadList(node: Node, idx: number) {
        let data = this._listData[idx];
        data.idx = idx;
        data.isSelect = null;
        data.isShowCn = this._showCnFlag;
        node.getComponent(WordItem).init(data, () => {
            ViewsMgr.showView(PrefabType.WordDetailUI, (node: Node) => {
                let wordData = new WordModel();
                wordData.word = data.word;
                wordData.w_id = data.w_id;
                if (GameSourceType.word_game == this._souceType) {
                    wordData.source = WordSourceType.word_game;
                } else {
                    wordData.source = WordSourceType.classification;
                }
                node.getComponent(WordDetailUI).init(wordData);
            });
        });
    }

    private onBtnReview() {
        ServiceMgr.studyService.reqReviewPlanStatus(this._souceType);
    }
    private onSortByNode(node: Node) {
        let tabNode = node.getChildByName("img_tab");
        if (this._lastSelectTab == tabNode) return;
        tabNode.active = true;
        let idx = node["idx"];
        console.log("onSortByNode:", idx);
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
        this.list.node.active = false;
        this.btnReview.active = false;
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
        this._listData = [];
        let canReview = false;
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
            info.symbol = item.symbol;
            info.symbolus = item.symbolus;
            info.next_review_time = item.next_review_time;
            if (this._today == item.next_review_time) canReview = true;
        });
        this.list.node.active = true;
        this.btnReview.active = canReview && (this._listData.length > 0);
        this.list.numItems = this._listData.length;
    }
    /**复习规划状态与单词列表 */
    onRepReviewPlanStatus(data: s2cReviewPlanStatus) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        if (data.source != this._souceType) {
            return;
        }
        if (!data.review_wp_list || data.review_wp_list.length == 0) {
            ViewsMgr.showTip(TextConfig.ReviewPlan_Null);
            return;
        }

        let wordsdata: ReviewWordModel[] = [];
        data.review_wp_list.forEach((value) => {
            let word: ReviewWordModel = new ReviewWordModel();
            word.cn = value.cn;
            word.w_id = value.w_id;
            word.word = value.word;
            word.wp_id = value.wp_id;
            word.symbol = value.symbol;
            word.symbolus = value.symbolus;
            word.book_id = value.book_id;
            word.unit_id = value.unit_id;
            word.big_id = value.big_id;
            word.subject_id = value.subject_id;
            word.source = data.source;
            wordsdata.push(word);
        });
        let errorNum = 0;
        for (const key in data.error_wp_info) {
            const value = data.error_wp_info[key];
            errorNum++;
            let word = wordsdata.find(val => val.wp_id == key);
            if (!word) continue;
            wordsdata.push(word);
        }
        let wordCount = data.review_wp_list.length;
        let wordNum = Math.min(wordCount, data.word_num);
        console.log("wordsdata", errorNum, wordsdata);
        let showView = () => {
            ViewsMgr.showView(PrefabType.WordMeaningView, (node: Node) => {
                node.getComponent(WordMeaningView).initData(wordsdata, {
                    source_type: GameSourceType.review,
                    ws_id: data.ws_id,
                    pass_num: data.pass_num,
                    word_num: wordNum,
                    error_num: errorNum,
                    souceType: this._souceType,
                    wordCount: wordCount,
                    monster_id: EducationLevel.ElementaryGrade1
                });
            });
        };
        showView();
    }
    /**通知列表刷新 */
    private onWordbookListRefresh() {
        this.onStartListRefresh();
    }
    /**开始列表刷新 */
    private onStartListRefresh() {
        if (this._lastSelectTab) {
            this._lastSelectTab.active = false;
            this._lastSelectTab = null;
        }
        this.onSortByNode(this.btnSortAry[0]);
    }
}


