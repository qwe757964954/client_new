import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import { NetConfig } from '../../config/NetConfig';
import { BookPlanDetail, CurrentBookStatus } from '../../models/TextbookModel';
import CCUtil from '../../util/CCUtil';
import ImgUtil from '../../util/ImgUtil';
import { TextbookUtil } from '../TextbookVocabulary/TextbookUtil';
const { ccclass, property } = _decorator;

// 枚举回调类型
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

    private _curUnitStatus: CurrentBookStatus = null;
    private _unitTotal: number = null;

    private _callbacks: { [key: string]: Function } = {};

    start() {
        this.initEvent();
    }

    // 初始化事件
    private initEvent() {
        this.bindEvent(this.change_textbook, RightUnitCallbackType.CHANGE_BOOK);
        this.bindEvent(this.break_through_btn, RightUnitCallbackType.BREAK_THROUGH);
        this.bindEvent(this.review_btn, RightUnitCallbackType.REVIEW);
        this.bindEvent(this.check_word_btn, RightUnitCallbackType.CHECK_WORD);
        this.bindEvent(this.modify_plan_btn, RightUnitCallbackType.MODIFY);
    }

    // 绑定事件
    private bindEvent(node: Node, type: RightUnitCallbackType) {
        CCUtil.onBtnClick(node, () => this._callbacks[type]?.());
    }

    // 更新右侧计划
    updateRightPlan(data: BookPlanDetail) {
        const level = TextbookUtil.calculateLevels(data.gate_total, data.num);
        this.plan_label.string = `${level}/${data.num}`;
    }

    // 更新单元总数
    updateUnitTotal(total_level: number) {
        this._unitTotal = total_level;
    }

    // 更新单元属性
    updateUnitProps(unitData: CurrentBookStatus) {
        console.log("updateUnitProps", unitData);
        this._curUnitStatus = unitData;
        this.title_label.string = unitData.book_name;
        this.grade_label.string = unitData.grade;
        this.study_label.string = unitData.study_word_num.toString();
        this.total_label.string = unitData.total_word_num.toString();
        this.study_progress.progress = unitData.study_word_num / unitData.total_word_num;

        const bookImgUrl = `${NetConfig.assertUrl}/imgs/bookcover/${unitData.book_name}/${unitData.grade}.jpg`;
        ImgUtil.loadRemoteImage(bookImgUrl, this.current_img, 188.573, 255.636);
    }

    // 设置回调
    setCallback(type: RightUnitCallbackType, callback: Function) {
        this._callbacks[type] = callback;
    }

    onDestroy(): void {
        // 清理回调
        this._callbacks = {};
    }
}
