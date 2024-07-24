import { _decorator, Label, Node, Sprite, SpriteFrame, Toggle } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ViewsMgr } from '../../manager/ViewsManager';
import { s2cReviewPlanLongTimeWords, s2cReviewPlanWordInfo } from '../../models/NetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ToolUtil } from '../../util/ToolUtil';
import { WordSourceType } from '../adventure/sixModes/BaseModeView';
import { WordMeaningView } from '../adventure/sixModes/WordMeaningView';
import { ReviewWordModel } from './ReviewPlanView';
import { ReviewSourceType } from './ReviewWordListView';
const { ccclass, property } = _decorator;

const maxSelectCount = 10;

@ccclass('ReviewAdjustPlanView')
export class ReviewAdjustPlanView extends BaseComponent {
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property(Node)
    public btnStudy: Node = null;//学习按钮
    @property(List)
    public list: List = null;//列表
    @property([SpriteFrame])
    public imgFrames: SpriteFrame[] = [];
    @property(Node)
    public btnSelect1: Node = null;
    @property(Node)
    public btnSelect2: Node = null;
    @property(Label)
    public label: Label = null;

    private _selectState: boolean[];
    private _selectCount: number = 0;
    private _source: ReviewSourceType = null;
    private _book_id: string = null;
    private _data: s2cReviewPlanWordInfo[] = null;

    onLoad() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onClickClose, this);
        CCUtil.onTouch(this.btnStudy, this.onClickStudy, this);
        CCUtil.onTouch(this.btnSelect1, this.onClickSelect1, this);
        CCUtil.onTouch(this.btnSelect2, this.onClickSelect2, this);

        this.addEvent(InterfacePath.c2sReviewPlanLongTimeWords, this.onRepReviewPlanLongTimeWords.bind(this));
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onClickClose, this);
        CCUtil.offTouch(this.btnStudy, this.onClickStudy, this);
        CCUtil.offTouch(this.btnSelect1, this.onClickSelect1, this);
        CCUtil.offTouch(this.btnSelect2, this.onClickSelect2, this);

        this.clearEvent();
    }
    /**初始化 */
    init(source: ReviewSourceType, book_id?: string) {
        this._source = source;
        this._book_id = book_id;

        this._selectCount = 0;
        this.refreshSelectLable();
        ServiceMgr.studyService.reqReviewPlanLongTimeWords(this._source, this._book_id);
    }
    /**关闭按钮点击 */
    onClickClose() {
        this.node.destroy();
    }
    /**学习按钮点击 */
    onClickStudy() {
        if (this._selectCount <= 0) return;
        let wordsdata: ReviewWordModel[] = [];
        for (let i = 0; i < this._data.length; i++) {
            if (!this._selectState[i]) continue;
            let value = this._data[i];
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
            wordsdata.push(word);
        }
        let showView = () => {
            ViewsMgr.showView(PrefabType.WordMeaningView, (node: Node) => {
                node.getComponent(WordMeaningView).initData(wordsdata, {
                    source_type: WordSourceType.reviewSpecial,
                    pass_num: 0, word_num: 0, error_num: 0, souceType: this._source, wordCount: wordsdata.length
                });
                this.node.destroy();
            });
        };
        showView();
    }
    /**加载list */
    onLoadList(node: Node, idx: number) {
        let data = this._data[idx];
        node.getChildByName("word").getComponent(Label).string = data.word;
        node.getChildByName("mean").getComponent(Label).string = data.cn;
        let toggle = node.getComponentInChildren(Toggle);
        toggle["idx"] = idx;
        toggle.isChecked = this._selectState[idx];
        toggle.node.off(Toggle.EventType.TOGGLE, this.checkToggleEvent, this);
        toggle.node.on(Toggle.EventType.TOGGLE, this.checkToggleEvent, this);
    }
    /**顺序十个 */
    onClickSelect1() {
        let count = this._selectState.length;
        let needCount = Math.min(maxSelectCount, count);
        if (needCount > 0) {
            this._selectState.fill(true, 0, needCount);
            if (needCount < count)
                this._selectState.fill(false, needCount);
            this._selectCount = needCount;
            this.list.updateAll();
        }
        this.refreshSelectLable();
    }
    /**随机十个 */
    onClickSelect2() {
        this._selectState.fill(false);
        this._selectCount = 0;
        let count = this._selectState.length;
        let needCount = Math.min(maxSelectCount, count);
        if (needCount > 0) {
            let tmpList = Array.from({ length: count }, (_, x) => x);
            for (let i = 0; i < needCount; i++) {
                let idx = ToolUtil.getRandomInt(0, tmpList.length - 1);
                this._selectState[tmpList[idx]] = true;
                this._selectCount++;
                tmpList.splice(idx, 1);
            }
        }
        this.refreshSelectLable();
        this.list.updateAll();
    }
    /**选中事件 */
    checkToggleEvent(toggle: Toggle) {
        let status = toggle.isChecked;
        let idx = toggle["idx"];
        if (status) {
            if (!this._selectState[idx]) {
                if (this._selectCount >= maxSelectCount) {
                    status = false;
                    toggle.isChecked = false;
                    ViewsMgr.showTip(TextConfig.ReviewPlan_Tip);
                } else {
                    this._selectCount++;
                }
            }
        } else {
            if (this._selectState[idx]) {
                this._selectCount--;
            }
        }
        this._selectState[idx] = status;
        this.refreshSelectLable();
    }
    /**更新选择显示 */
    refreshSelectLable() {
        this.label.string = ToolUtil.replace(TextConfig.ReviewPlan_Select, this._selectCount);
        this.btnStudy.getComponent(Sprite).grayscale = this._selectCount <= 0;
    }
    /**长时间未复习单词 */
    onRepReviewPlanLongTimeWords(data: s2cReviewPlanLongTimeWords) {
        if (200 != data.code) {
            return;
        }
        let list = data.not_planned_list;
        this._data = list;
        let count = list.length;
        this._selectState = Array.from({ length: count }, () => false);
        this.list.numItems = count;
    }
}

