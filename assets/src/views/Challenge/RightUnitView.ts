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
    private titleLabel: Label = null;

    @property(Label)
    private gradeLabel: Label = null;

    @property(Label)
    private studyLabel: Label = null;

    @property(Label)
    private totalLabel: Label = null;

    @property(Label)
    private planLabel: Label = null;

    @property(ProgressBar)
    private studyProgress: ProgressBar = null;

    @property(Node)
    private currentImage: Node = null;

    @property(Node)
    private changeTextbookButton: Node = null;

    @property(Node)
    private breakThroughButton: Node = null;

    @property(Node)
    private reviewButton: Node = null;

    @property(Node)
    private checkWordButton: Node = null;

    @property(Node)
    private modifyPlanButton: Node = null;

    @property(Label)
    private remainingLabel: Label = null;

    private callbacks: { [key in RightUnitCallbackType]?: () => void } = {};
    private currentBookStatus: CurrentBookStatus = null;

    start() {
        this.initializeEvents();
    }

    private initializeEvents() {
        const buttons = [
            { node: this.changeTextbookButton, type: RightUnitCallbackType.CHANGE_BOOK },
            { node: this.breakThroughButton, type: RightUnitCallbackType.BREAK_THROUGH },
            { node: this.reviewButton, type: RightUnitCallbackType.REVIEW },
            { node: this.checkWordButton, type: RightUnitCallbackType.CHECK_WORD },
            { node: this.modifyPlanButton, type: RightUnitCallbackType.MODIFY }
        ];

        buttons.forEach(({ node, type }) => this.bindEvent(node, type));
    }

    private bindEvent(node: Node, type: RightUnitCallbackType) {
        CCUtil.onBtnClick(node, () => {
            const callback = this.callbacks[type];
            if (callback) callback();
        });
    }

    public updateRightPlan(data: BookPlanDetail) {
        const remainingDays = TextbookUtil.calculateDays(data.gate_total - data.gate_pass_total, data.num);
        this.remainingLabel.string = `剩余${remainingDays}天`;
        this.planLabel.string = `${this.currentBookStatus.today_pay_num}/${data.num}`;
    }

    public updateUnitProps(unitData: CurrentBookStatus) {
        console.log("updateUnitProps", unitData);
        this.currentBookStatus = unitData;

        this.titleLabel.string = unitData.book_name;
        this.gradeLabel.string = unitData.grade;
        this.studyLabel.string = unitData.study_word_num.toString();
        this.totalLabel.string = unitData.total_word_num.toString();
        this.studyProgress.progress = unitData.study_word_num / unitData.total_word_num;

        const bookImgUrl = `${NetConfig.assertUrl}/imgs/bookcover/${unitData.book_name}/${unitData.grade}.jpg`;
        ImgUtil.loadRemoteImage(bookImgUrl, this.currentImage, 188.573, 255.636);
    }

    public setCallback(type: RightUnitCallbackType, callback: () => void) {
        this.callbacks[type] = callback;
    }

    onDestroy() {
        this.callbacks = {};
    }
}
