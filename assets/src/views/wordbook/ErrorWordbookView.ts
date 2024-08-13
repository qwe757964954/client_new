import { _decorator, EventTouch, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsMgr } from '../../manager/ViewsManager';
import { s2cWordbookErrorbook, s2cWordbookErrorbookInfo } from '../../models/NetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ToolUtil } from '../../util/ToolUtil';
import { WordSourceType } from '../adventure/sixModes/BaseModeView';
import { WordMeaningView } from '../adventure/sixModes/WordMeaningView';
import { ReviewWordModel } from '../reviewPlan/ReviewPlanView';
import { ReviewSourceType } from '../reviewPlan/ReviewWordListView';
import { EducationLevel } from '../TextbookVocabulary/TextbookInfo';
import { WordItem, WordItemInfo } from './WordItem';
const { ccclass, property } = _decorator;

const c_btnSelectCount = 10;
@ccclass('ErrorWordbookView')
export class ErrorWordbookView extends BaseComponent {
    @property(List)
    public list: List = null;
    @property(Node)
    public btnReview1: Node = null;
    @property(Node)
    public btnReview2: Node = null;
    @property([Node])
    public btnSortAry: Node[] = [];
    @property(Node)
    public btnShowCn: Node = null;
    @property(Node)
    public btnSelectAll: Node = null;
    @property(Node)
    public btnSelectTen: Node = null;
    @property(Node)
    public btnSelectRand: Node = null;

    private _isInit: boolean = false;
    private _sourceType: WordSourceType = null;
    private _lastSelectTab: Node = null;
    private _showCnFlag: boolean = false;
    private _listData: s2cWordbookErrorbookInfo[] = [];
    private _selectAry: boolean[] = [];

    protected onDestroy(): void {
        this.clearEvent();
    }
    protected onLoad(): void {
        this.initEvent();
    }

    private initEvent() {
        CCUtil.onTouch(this.btnReview1, this.onBtnReview1, this);
        CCUtil.onTouch(this.btnReview2, this.onBtnReview2, this);
        CCUtil.onTouch(this.btnShowCn, this.onBtnShowCn, this);
        CCUtil.onTouch(this.btnSelectAll, this.onBtnSelectAll, this);
        CCUtil.onTouch(this.btnSelectTen, this.onBtnSelectTen, this);
        CCUtil.onTouch(this.btnSelectRand, this.onBtnSelectRand, this);
        for (let i = 0; i < this.btnSortAry.length; i++) {
            const element = this.btnSortAry[i];
            element["idx"] = i;
            CCUtil.onTouch(element, this.onBtnSort, this);
        }

        this.addEvent(InterfacePath.c2sWordbookErrorbook, this.onRepErrorbook.bind(this));
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
    public init(sourceType: WordSourceType) {
        if (this._isInit) return;
        this._isInit = true;
        this._sourceType = sourceType;
        ServiceMgr.wordbookSrv.reqErrorbook(this.getSourceStr());

    }
    /**获得来源字符串 */
    private getSourceStr() {
        if (WordSourceType.errorWordbook == this._sourceType) {
            return "err";
        } else if (WordSourceType.collectWordbook == this._sourceType) {
            return "collect";
        }
        return ""
    }
    /**错题本返回 */
    private onRepErrorbook(data: s2cWordbookErrorbook) {
        if (200 != data.code) return;
        if (!data.word_list || data.word_type != this.getSourceStr()) return;
        this._listData = data.word_list;
        this._lastSelectTab = null;
        this.onSortByNode(this.btnSortAry[0]);
        // this.list.numItems = this._listData.length;
    }
    /**获得单词中文 */
    private getCn(data: s2cWordbookErrorbookInfo) {
        let cn;
        if (ReviewSourceType.word_game == data.source_type) {
            cn = data.gw_cn;
        } else if (ReviewSourceType.classification == data.source_type) {
            cn = data.cw_cn;
        } else {
            cn = data.g_cn;
        }
        return cn;
    }
    /**列表加载 */
    private onLoadList(node: Node, idx: number) {
        let data = this._listData[idx];
        let itemInfo = new WordItemInfo();
        itemInfo.idx = idx;
        itemInfo.word = data.word;
        itemInfo.symbol = data.symbol;
        itemInfo.symbolus = data.symbolus;
        itemInfo.cn = this.getCn(data);
        let isSelect = this._selectAry[idx];
        if (null == isSelect) isSelect = false;
        itemInfo.isSelect = isSelect;
        itemInfo.isShowCn = this._showCnFlag;
        node.getComponent(WordItem).init(itemInfo, () => {
            ServiceMgr.studyService.moreWordDetail(data.word);
        }, (_, status) => {
            this._selectAry[idx] = status;
        });
    }
    /**获得学习单词 */
    private getStudyWords() {
        let ary = [];
        for (let i = 0; i < this._selectAry.length; i++) {
            if (this._selectAry[i]) {
                ary.push(this._listData[i]);
            }
        }
        return ary;
    }
    /**词义训练 */
    private onBtnReview1() {
        let studyWords = this.getStudyWords();
        if (studyWords.length == 0) {
            return;
        }
        let wordsdata: ReviewWordModel[] = [];
        studyWords.forEach((value: s2cWordbookErrorbookInfo) => {
            let word = new ReviewWordModel();
            word.cn = this.getCn(value);;
            word.w_id = value.w_id;
            word.word = value.word;
            // word.wp_id = value.wp_id;
            word.symbol = value.symbol;
            word.symbolus = value.symbolus;
            word.book_id = value.book_id;
            word.unit_id = value.unit_id;
            word.big_id = value.big_id;
            word.subject_id = value.subject_id;
            word.source = value.source_type;
            word.e_id = value.e_id;
            word.cw_id = value.cw_id;
            wordsdata.push(word);
        });
        ViewsMgr.showView(PrefabType.WordMeaningView, (node: Node) => {
            node.getComponent(WordMeaningView).initData(wordsdata, {
                source_type: this._sourceType,
                pass_num: 0,
                word_num: 0,
                error_num: 0,
                wordCount: wordsdata.length,
                monster_id: EducationLevel.ElementaryGrade1
            });
        });
    }
    /**拼写训练 */
    private onBtnReview2() {
        let studyWords = this.getStudyWords();
        if (studyWords.length == 0) {
            return;
        }
    }
    /**排序按钮 */
    private onSortByNode(node: Node) {
        console.log("onSortByNode", this._sourceType, this._listData.length);
        let tabNode = node.getChildByName("img_tab");
        if (this._lastSelectTab == tabNode) return;
        tabNode.active = true;
        if (this._lastSelectTab) {
            this._lastSelectTab.active = false;
        }
        this._lastSelectTab = tabNode;
        /**排序 */
        let idx = node["idx"];
        if (0 == idx) {
            this._listData.sort((a, b) => {
                return a.create_time < b.create_time ? 1 : -1;
            });
        } else if (1 == idx) {
            this._listData.sort((a, b) => {
                return a.create_time >= b.create_time ? 1 : -1;
            });
        } else if (2 == idx) {
            this._listData.sort((a, b) => {
                return a.word > b.word ? 1 : -1;
            });
        } else {
            this._listData.sort((a, b) => {
                return a.word <= b.word ? 1 : -1;
            });
        }

        this._selectAry = Array.from({ length: this._listData.length }, () => false);;
        this.list.numItems = this._listData.length;
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
    /**全部选择 */
    private onBtnSelectAll() {
        this._selectAry.fill(true);
        this.list.updateAll();
    }
    /**顺序选择十个 */
    private onBtnSelectTen() {
        let needCount = Math.min(c_btnSelectCount, this._selectAry.length);
        this._selectAry.fill(true, 0, needCount);
        this._selectAry.fill(false, needCount);
        this.list.updateAll();
    }
    /**随机选择十个 */
    private onBtnSelectRand() {
        this._selectAry.fill(false);
        let ary = ToolUtil.getRandomUniqueItemsIdx(this._selectAry, c_btnSelectCount);
        for (let i = 0; i < ary.length; i++) {
            this._selectAry[ary[i]] = true;
        }
        this.list.updateAll();
    }
}


