import { _decorator, Label, Node } from 'cc';
import { BasePopup } from '../../script/BasePopup';
import CCUtil from '../../util/CCUtil';
import { ScrollViewExtra } from './picker/ScrollViewExtra';
import { TextbookUtil } from './TextbookUtil';

const { ccclass, property } = _decorator;

export interface PlanSaveData {
    left: string;
    right: string;
    isSave: boolean;
}

export interface SettingDataParam {
    bookName: string;
    totalLevel: number;
    totalWords: number;
    saveListener: (data: PlanSaveData) => void;
}

@ccclass('SettingPlanView')
export class SettingPlanView extends BasePopup {
    @property(ScrollViewExtra)
    public levelScroll: ScrollViewExtra = null;

    @property(ScrollViewExtra)
    public dayScroll: ScrollViewExtra = null;

    @property(Label)
    public bookTitle: Label = null;

    @property(Node)
    public saveButton: Node = null;

    @property(Node)
    public cancelButton: Node = null;

    @property(Label)
    public totalWordLabel: Label = null;

    @property(Label)
    public timeTip: Label = null;

    @property(Label)
    public dateTip: Label = null;

    private _selectedLevel: number = 0;
    private _selectedDay: number = 0;
    private _settingData: SettingDataParam = null;

    private static readonly NORMAL_DAY_LEVEL: number = 1;

    initUI() {
        this.enableClickBlankToClose([this.node.getChildByName("small_dialog_bg")]);
    }

    initEvent() {
        CCUtil.onBtnClick(this.saveButton, this._onSaveClick.bind(this));
        CCUtil.onBtnClick(this.cancelButton, this._onCancelClick.bind(this));
    }

    setLeftRightDatePick() {
        this.levelScroll.initSelectCallFunc(this._onLevelSelect.bind(this));
        this.dayScroll.initSelectCallFunc(this._onDaySelect.bind(this));
    }

    private _onLevelSelect(selectedLevel: number): void {
        if (this._selectedLevel === selectedLevel) {
            this._updateDays(selectedLevel);
            return;
        }
        this._selectedLevel = selectedLevel;
        this._updateDays(selectedLevel);
        this._updatePlanDate();
    }

    private _onDaySelect(selectedDay: number): void {
        if (this._selectedDay === selectedDay) {
            return;
        }
        this._selectedDay = selectedDay;
        this._updateLevels(selectedDay);
        this._updatePlanDate();
    }

    private _updatePlanDate(): void {
        this.dateTip.string = TextbookUtil.getFormattedDate(this._selectedDay);
        this.timeTip.string = TextbookUtil.formatTotalMinutes(this._selectedLevel);
    }

    private _updateDays(selectedLevel: number): void {
        const days = TextbookUtil.calculateDays(this._settingData.totalLevel, selectedLevel);
        console.log("_updateDays.....",this._settingData.totalLevel,selectedLevel,days);
        this.dayScroll.scrollToNumber(`${days}`);
    }

    private _updateLevels(selectedDay: number): void {
        const levels = TextbookUtil.calculateLevels(this._settingData.totalLevel, selectedDay);
        console.log("_updateLevels.....",this._settingData.totalLevel,selectedDay,levels);
        this.levelScroll.scrollToNumber(`${levels}`);
    }

    updateTitleName(param: SettingDataParam): void {
        this._settingData = param;
        this.bookTitle.string = this._settingData.bookName;
        this.totalWordLabel.string = `词书总单词数 = ${this._settingData.totalWords}`;
        this.levelScroll.setTotalLevel(this._settingData.totalLevel);
        this.dayScroll.setTotalLevel(this._settingData.totalLevel);
        this.dateTip.string = TextbookUtil.getFormattedDate(this._settingData.totalLevel);
        
        this.setLeftRightDatePick();
        this.scheduleOnce(() => {
            const days = TextbookUtil.calculateDays(this._settingData.totalLevel, SettingPlanView.NORMAL_DAY_LEVEL);
            this._selectedLevel = SettingPlanView.NORMAL_DAY_LEVEL;
            this.dayScroll.scrollToNumber(`${days}`);
        }, 0.2);
    }

    onLoadLeftVerticalList(item: Node, idx: number): void {
        const label = item.getComponent(Label);
        label.string = `${idx}`;
    }

    onLoadRightVerticalList(item: Node, idx: number): void {
        const label = item.getComponent(Label);
        label.string = `${idx}`;
    }

    private _onCancelClick(): void {
        this.closePop();
    }

    private _onSaveClick(): void {
        this.closePop();
        this._sendPlan();
    }

    private _sendPlan(): void {
        const data: PlanSaveData = {
            left: `${this._selectedLevel}`,
            right: `${this._selectedDay}`,
            isSave: true
        };
        this._settingData.saveListener?.(data);
    }
}
