import { _decorator, JsonAsset, Label, Node, sys } from 'cc';
import { EventType } from '../../../config/EventType';
import { NetConfig } from '../../../config/NetConfig';
import { PrefabType } from '../../../config/PrefabType';
import { AdvLevelConfig, BookLevelConfig } from '../../../manager/DataMgr';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { ResLoader } from '../../../manager/ResLoader';
import { ViewsManager } from '../../../manager/ViewsManager';
import { AdventureResultModel, GameMode } from '../../../models/AdventureModel';
import { GameSubmitModel, UnitWordModel } from '../../../models/TextbookModel';
import { ServiceMgr } from '../../../net/ServiceManager';
import { TBServer } from '../../../service/TextbookService';
import { RecordApi } from '../../../util/third/RecordApi';
import { RecordResponseData } from '../../../util/third/RecordModel';
import { BaseModeView } from './BaseModeView';
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

    private _wrongMode: boolean = false; //错误重答模式
    private _rightWordData: UnitWordModel = null; //正确单词数据
    private _wrongWordList: any[] = []; //错误单词列表
    async initData(wordsdata: UnitWordModel[], levelData: any) {
        this.gameMode = GameMode.Reading;
        super.initData(wordsdata, levelData);
        this.initWords(wordsdata);
        this.initEvent();
        this.initMonster(); //初始化怪物
        RecordApi.checkRecordPermission();
    }
    onInitModuleEvent(){
        super.onInitModuleEvent();
        this.addModelListener(EventType.Get_Record_Result,this.getRecordResult); 
    }
    getRecordResult(response:RecordResponseData){
        console.log('getRecordResult  RecordResponseData', response);
        let isRight:boolean = response.result.overall > 80 ? true : false;
        this.gameSubmit(response,isRight);
        if (isRight) {
            this._rightNum++;
            if (this._wrongMode) {
                if (this._wrongWordList.length == 0) {
                    this._wrongMode = false;
                    this._wordIndex++;
                }
            } else {
                this._wordIndex++;
            }

            this.attackMonster().then(() => {
                if (this._wordIndex >= this._wordsData.length) {
                    if (this._wrongWordList.length > 0) {
                        this._wrongMode = true;
                        this.showCurrentWord();
                    } else {
                        this.monsterEscape();
                    }
                } else {
                    this.showCurrentWord();
                }
            });

        } else {
            if (this._wrongWordList.indexOf(this._rightWordData) == -1 && !this._wrongMode) {
                this._errorNum++;
                this.errorNumLabel.string = "错误次数：" + this._errorNum;
            }
            this._wrongWordList.push(this._rightWordData);
            if (!this._wrongMode && this._wrongWordList.length >= 3) {
                this._wrongMode = true;
            }
            if (!this._wrongMode) {
                this._wordIndex++;
                if (this._wordIndex >= this._wordsData.length) {
                    this._wrongMode = true;
                }
            }
            this.scheduleOnce(() => {
                this.showCurrentWord();
            }, 1);
        }
    }

    gameSubmit(response:RecordResponseData,isRight?:boolean) {
        let word = this._wordsData[this._wordIndex].word;
        if (this._levelData.hasOwnProperty('islandId')) {
            let levelData = this._levelData as AdvLevelConfig;
            let costTime = Date.now() - this._costTime;
            let params:AdventureResultModel = {
                big_id:levelData.islandId,
                small_id:levelData.levelId,
                micro_id:levelData.mapLevelData.micro_id,
                game_mode:levelData.mapLevelData.current_mode,
                cost_time:costTime,
                status:isRight ? 1 : 0,
                score:response.result.overall,
                word:word
            }
            ServiceMgr.studyService.submitAdventureResult(params);
            return;
        }
        let levelData: BookLevelConfig = this._levelData as BookLevelConfig;
        let costTime = Date.now() - this._costTime;
        let data: GameSubmitModel = {
            type_name: levelData.type_name,
            book_name: levelData.book_name,
            grade: levelData.grade,
            unit: levelData.unit,
            game_mode: this.gameMode,
            cost_time: costTime,
            word: word,
            score:response.result.overall,
            small_id: levelData.small_id,
            status: isRight ? 1 : 0
        }
        TBServer.reqGameSubmit(data);
    }

    //获取关卡单词回包
    initWords(data: UnitWordModel[]) {
        console.log('initWords', data);
        this._wordsData = data;
        this.showCurrentWord();
    }

    //显示当前单词
    showCurrentWord() {
        this._rightWordData = this._wrongMode ? this._wrongWordList.shift() : this._wordsData[this._wordIndex];
        console.log('word', this._rightWordData);
        let word = this._rightWordData.word;
        this.wordLabel.string = word;
        this.symbolLabel.string = this._rightWordData.symbol;
        this.initWordDetail(word);
    }

    //初始化单词详情
    playWordSound() {
        let word = this._wordsData[this._wordIndex].word;
        let wordSoundUrl = "";
        wordSoundUrl = "/sounds/glossary/words/en/" + word + ".wav";
        return RemoteSoundMgr.playSound(NetConfig.assertUrl + wordSoundUrl);
    }

    protected initEvent(): void {
        super.initEvent();
    }
    protected removeEvent(): void {
        super.removeEvent();
    }
    /**录音按钮事件 */
    soundRecordEvent(){
        console.log('soundRecordEvent');
        this.img_corrugation.active = true;
        this.btn_sound_recording.active = false;
        let word = this._wordsData[this._wordIndex].word;
        if (sys.isNative) {
            RecordApi.onRecord(word);
        }
        
    }
    /**波浪线结束录音 */
    corrugationEvent(){
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
    protected modeOver(): void {
        console.log('朗读模式完成');
        ViewsManager.instance.showView(PrefabType.WordReportView, (node: Node) => {
            ViewsManager.instance.closeView(PrefabType.WordReadingView);
            //跳转到下一场景
            /*
            node.getComponent(TransitionView).setTransitionCallback(() => {
                ViewsManager.instance.showView(PrefabType.WordPracticeView, (node: Node) => {
                    node.getComponent(WordPracticeView).initData(wordData, levelData);
                    ViewsManager.instance.closeView(PrefabType.WordMeaningView);
                });
            });
            */
        });
    }
    onDestroy(): void {
        super.onDestroy();
    }
}


