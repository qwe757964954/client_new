import { _decorator, Component, JsonAsset, Label, Node, sys } from 'cc';
import { BaseView } from '../../../script/BaseView';
import { UnitData, UnitWord } from '../../../models/AdventureModel';
import CCUtil from '../../../util/CCUtil';
import { RecordApi } from '../../../util/third/RecordApi';
import { ResLoader } from '../../../manager/ResLoader';
import { RecordResponseData } from '../../../util/third/RecordModel';
import { EventType } from '../../../config/EventType';
import { ViewsManager } from '../../../manager/ViewsManager';
import { TextConfig } from '../../../config/TextConfig';
import { EventMgr } from '../../../util/EventManager';
import { WordBaseData } from '../../../models/SubjectModel';
const { ccclass, property } = _decorator;

@ccclass('WordReadingSubject')
export class WordReadingSubject extends BaseView {
    @property({ type: Label, tooltip: "单词Label" })
    wordLabel: Label = null;
    @property({ type: Label, tooltip: "音标Label" })
    symbolLabel: Label = null;
    @property({ type: Label, tooltip: "中文Label" })
    cnLabel: Label = null;

    @property({ type: Node, tooltip: "录音按钮" })
    btn_sound_recording: Node = null;

    @property({ type: Node, tooltip: "结束录音波浪线" })
    img_corrugation: Node = null;

    private _turnIsBegin: boolean = false;
    private _rightWordData: WordBaseData;

    setData(word: WordBaseData) {
        this._rightWordData = word;
        this.wordLabel.string = word.word;
        this.symbolLabel.string = this._rightWordData.symbol;
        this.cnLabel.string = this._rightWordData.cn;
    }

    /**录音按钮事件 */
    soundRecordEvent() {
        console.log('soundRecordEvent');
        if (this._turnIsBegin) {
            return;
        }
        this._turnIsBegin = true;
        this.img_corrugation.active = true;
        this.btn_sound_recording.active = false;
        let word = this._rightWordData.word;
        if (sys.isNative) {
            RecordApi.onRecord(word);
        }

    }
    /**波浪线结束录音 */
    corrugationEvent() {
        console.log('corrugationEvent');
        this.img_corrugation.active = false;
        this.btn_sound_recording.active = true;
        if (!sys.isNative) {
            ResLoader.instance.load(`adventure/sixModes/study/ReadData`, JsonAsset, async (err: Error | null, jsonData: JsonAsset) => {
                if (err) {
                    console.error(err);
                } else {
                    let response = jsonData.json as RecordResponseData;
                    this.getRecordResult(response);
                }
            });
            return;
        }
        RecordApi.stopRecord();
    }

    getRecordResult(response: RecordResponseData) {
        let isRight: boolean = response.result.overall > 60 ? true : false;
        if (!isRight) {
            ViewsManager.showTip(TextConfig.Reading_Error_Tip);
        }
        EventMgr.dispatch(EventType.GradeSkip_Subject_Result, isRight);
    }

    onInitModuleEvent() {
        super.onInitModuleEvent();
        this.addModelListener(EventType.Get_Record_Result, this.getRecordResult);
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.btn_sound_recording, this.soundRecordEvent, this);
        CCUtil.onTouch(this.img_corrugation, this.corrugationEvent, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.btn_sound_recording, this.soundRecordEvent, this);
        CCUtil.offTouch(this.img_corrugation, this.corrugationEvent, this);
    }
}


