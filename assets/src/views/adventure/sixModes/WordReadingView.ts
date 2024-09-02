import { _decorator, JsonAsset, Label, Node, sys } from 'cc';
import { EventType } from '../../../config/EventType';
import { NetConfig } from '../../../config/NetConfig';
import { PrefabType } from '../../../config/PrefabType';
import { TextConfig } from '../../../config/TextConfig';
import { BookLevelConfig } from '../../../manager/DataMgr';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { ResLoader } from '../../../manager/ResLoader';
import { ViewsManager, ViewsMgr } from '../../../manager/ViewsManager';
import { AdventureResultModel, GameMode, GateData } from '../../../models/AdventureModel';
import { GameSubmitModel, UnitWordModel } from '../../../models/TextbookModel';
import { ServiceMgr } from '../../../net/ServiceManager';
import { TBServer } from '../../../service/TextbookService';
import CCUtil from '../../../util/CCUtil';
import { RecordApi } from '../../../util/third/RecordApi';
import { RecordResponseData } from '../../../util/third/RecordModel';
import { BaseModeView, GameSourceType } from './BaseModeView';
import { WordReportView } from './WordReportView';

const { ccclass, property } = _decorator;

@ccclass('WordReadingView')
export class WordReadingView extends BaseModeView {
    @property({ type: Label, tooltip: "单词Label" })
    wordLabel: Label = null;

    @property({ type: Label, tooltip: "音标Label" })
    symbolLabel: Label = null;

    @property({ type: Label, tooltip: "中文Label" })
    cnLabel: Label = null;

    @property({ type: Node, tooltip: "单词读音" })
    wordSound: Node = null;

    @property({ type: Node, tooltip: "录音按钮" })
    btn_sound_recording: Node = null;

    @property({ type: Node, tooltip: "结束录音波浪线" })
    img_corrugation: Node = null;

    private _wrongMode: boolean = false; // 错误重答模式
    private _wrongWordList: UnitWordModel[] = []; // 错误单词列表
    private _turnIsBegin: boolean = false;
    private _finished: boolean = false;

    async initData(wordsdata: UnitWordModel[], levelData: any): Promise<void> {
        this.gameMode = GameMode.Reading;
        wordsdata = this.updateTextbookWords(wordsdata, levelData);
        console.log("WordReadingView...wordsdata....", wordsdata);
        this.initWords(wordsdata);
        this.initMonster(); // 初始化怪物
        RecordApi.checkRecordPermission();
    }

    onInitModuleEvent(): void {
        super.onInitModuleEvent();
        this.addModelListener(EventType.Get_Record_Result, this.getRecordResult.bind(this));
    }

    private async getRecordResult(response: RecordResponseData): Promise<void> {
        console.log('getRecordResult  RecordResponseData', response);
        const isRight = response.result.overall > 60;

        this.gameSubmit(response, isRight);

        if (isRight) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    private async handleCorrectAnswer(): Promise<void> {
        this._rightNum++;
        this._comboNum++;
        this.showRightSpAni();

        if (this._wrongMode && this._wrongWordList.length === 0) {
            this._wrongMode = false;
            this._wordIndex++;
        } else {
            this._wordIndex++;
        }

        await this.attackMonster();

        if (this._wordIndex >= this._wordsData.length) {
            if (this._wrongWordList.length > 0) {
                this._wrongMode = true;
                this.showCurrentWord();
            } else {
                this.monsterDie();
            }
        } else {
            this.showCurrentWord();
        }

        this._turnIsBegin = false;
    }

    private async handleIncorrectAnswer(): Promise<void> {
        ViewsManager.showTip(TextConfig.Reading_Error_Tip);
        this._comboNum = 0;
        this._errorNum++;
        this._levelData.error_num = this._errorNum;
        this.topNode.updateErrorNumber(this._errorNum);
        this._wrongWordList.push(this._rightWordData);

        if (!this._wrongMode) {
            this._wordIndex++;
            if (this._wordIndex >= this._wordsData.length) {
                this._wrongMode = true;
            }
        }

        await this.playWordSound();
        await this.playWordSound();
        this.showCurrentWord();
        this._turnIsBegin = false;
    }

    private monsterDie(): void {
        this.reportResult();
        this.monsterView.monsterDie().then(() => {
            if (this._currentSubmitResponse.pass_flag === 1) {
                this.gotoResult();
            }
        });
    }

    private async gameSubmit(response: RecordResponseData, isRight: boolean): Promise<void> {
        console.log("this._rightWordData.word______", this._rightWordData.word);
        const costTime = Date.now() - this._costTime;

        if (this._sourceType === GameSourceType.word_game) {
            const levelData = this._levelData as GateData;
            const params: AdventureResultModel = {
                big_id: levelData.big_id,
                small_id: levelData.small_id,
                game_mode: levelData.current_mode,
                cost_time: costTime,
                status: isRight ? 1 : 0,
                score: response.result.overall,
                word: this._rightWordData.word
            };
            await ServiceMgr.studyService.submitAdventureResult(params);
            return;
        }

        const levelData = this._levelData as BookLevelConfig;
        const data: GameSubmitModel = {
            book_id: levelData.book_id,
            unit_id: levelData.unit_id,
            game_mode: this.gameMode,
            cost_time: costTime,
            word: this._rightWordData.word,
            score: response.result.overall,
            small_id: levelData.small_id,
            status: isRight ? 1 : 0
        };
        await TBServer.reqGameSubmit(data);
    }

    private initWords(data: UnitWordModel[]): void {
        console.log('initWords', data);
        this._wordsData = data;
        this._finished = false;
        this.showCurrentWord();
    }

    private showCurrentWord(): void {
        this.img_corrugation.active = false;
        this.btn_sound_recording.active = true;
        super.updateConstTime();
        this._rightWordData = this._wrongMode ? this._wrongWordList.shift() : this._wordsData[this._wordIndex];
        console.log('word', this._rightWordData);
        this.wordLabel.string = this._rightWordData.word;
        this.symbolLabel.string = this._rightWordData.symbol;
        this.cnLabel.string = this._rightWordData.cn;
        this.initWordDetail(this._rightWordData);
    }

    private playWordSound(): Promise<void> {
        const word = this._rightWordData.word;
        const wordSoundUrl = `/sounds/glossary/words/en/${word}.wav`;
        return RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    protected initEvent(): void {
        super.initEvent();
        CCUtil.onBtnClick(this.btn_sound_recording, this.soundRecordEvent.bind(this));
        CCUtil.onBtnClick(this.img_corrugation, this.corrugationEvent.bind(this));
    }

    protected removeEvent(): void {
        super.removeEvent();
    }

    private soundRecordEvent(): void {
        console.log('soundRecordEvent');
        if (this._turnIsBegin) {
            return;
        }
        this._turnIsBegin = true;
        this.img_corrugation.active = true;
        this.btn_sound_recording.active = false;
        const word = this._rightWordData.word;
        if (sys.isNative) {
            RecordApi.onRecord(word);
        }
    }

    private corrugationEvent(): void {
        console.log('corrugationEvent');
        this.img_corrugation.active = false;
        this.btn_sound_recording.active = false;

        if (!sys.isNative) {
            ResLoader.instance.load(`adventure/sixModes/study/ReadData`, JsonAsset, (err: Error | null, jsonData: JsonAsset) => {
                if (err) {
                    console.error(err);
                } else {
                    const response = jsonData.json as RecordResponseData;
                    this.getRecordResult(response);
                }
            });
            return;
        }

        RecordApi.stopRecord();
    }

    public checkResult(): void {
        console.log('checkResult');
        const isAdventure = this._sourceType === GameSourceType.word_game;
        if (!isAdventure && !this._turnIsBegin && this._currentSubmitResponse?.pass_flag === 1 && !this._finished) {
            this.gotoResult();
        }
    }

    protected async gotoResult() {
        console.log('朗读模式完成');
        this._finished = true;
        let node = await ViewsMgr.showLearnView(PrefabType.WordReportView);
        const nodeScript = node.getComponent(WordReportView);
        console.log('朗读模式完成', this._currentSubmitResponse);
        nodeScript.initData(this._currentSubmitResponse, this.gameMode, this._sourceType);
        this.topNode.cancelTimeSchedule();
        this.node.destroy();
    }

    onDestroy(): void {
        super.onDestroy();
    }
}
