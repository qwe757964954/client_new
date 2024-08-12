import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import { NetConfig } from '../../config/NetConfig';
import { BookPlanDetail, CurrentBookStatus } from '../../models/TextbookModel';
import CCUtil from '../../util/CCUtil';
import ImgUtil from '../../util/ImgUtil';
import { TextbookUtil } from '../TextbookVocabulary/TextbookUtil';

const { ccclass, property } = _decorator;

export enum RightUnitCallbackType {
    MODIFY = 'modify',
    BREAK_THROUGH = 'breakThrough',
    CHANGE_BOOK = 'changeBook',
    CHECK_WORD = 'checkWord',
    REVIEW = 'review',
}

@ccclass('RightUnitView')
export class RightUnitView extends Component {
    @property(Label)
    public title_label: Label = null;
    @property(Label)
    public grade_label: Label = null;
    @property(Label)
    public study_label: Label = null;
    @property(Label)
    public total_label: Label = null;
    @property(Label)
    public plan_label: Label = null;

    @property(ProgressBar)
    public study_progress: ProgressBar = null;

    @property(Node)
    public current_img: Node = null;

    @property(Node)
    public change_textbook: Node = null;
    @property(Node)
    public break_through_btn: Node = null;
    @property(Node)
    public review_btn: Node = null;
    @property(Node)
    public check_word_btn: Node = null;
    @property(Node)
    public modify_plan_btn: Node = null;
    private _callbacks: { [key: string]: Function } = {};

    start() {
        this.initEvent();
    }

    private initEvent() {
        this.bindEvent(this.change_textbook, RightUnitCallbackType.CHANGE_BOOK);
        this.bindEvent(this.break_through_btn, RightUnitCallbackType.BREAK_THROUGH);
        this.bindEvent(this.review_btn, RightUnitCallbackType.REVIEW);
        this.bindEvent(this.check_word_btn, RightUnitCallbackType.CHECK_WORD);
        this.bindEvent(this.modify_plan_btn, RightUnitCallbackType.MODIFY);
    }

    private bindEvent(node: Node, type: RightUnitCallbackType) {
        CCUtil.onBtnClick(node, () => this._callbacks[type]?.());
    }

    updateRightPlan(data: BookPlanDetail) {
        let Remaining =  data.gate_total - data.gate_pass_total
        const level = TextbookUtil.calculateLevels(Remaining, data.num);
        this.plan_label.string = `${level}/${Remaining}`;
    }
    updateUnitProps(unitData: CurrentBookStatus) {
        console.log("updateUnitProps", unitData);
        this.title_label.string = unitData.book_name;
        this.grade_label.string = unitData.grade;
        this.study_label.string = unitData.study_word_num.toString();
        this.total_label.string = unitData.total_word_num.toString();
        this.study_progress.progress = unitData.study_word_num / unitData.total_word_num;

        const bookImgUrl = `${NetConfig.assertUrl}/imgs/bookcover/${unitData.book_name}/${unitData.grade}.jpg`;
        ImgUtil.loadRemoteImage(bookImgUrl, this.current_img, 188.573, 255.636);
    }

    setCallback(type: RightUnitCallbackType, callback: Function) {
        this._callbacks[type] = callback;
    }

    onDestroy() {
        this._callbacks = {};
    }
}
