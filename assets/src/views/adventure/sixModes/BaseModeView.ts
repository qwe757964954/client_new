import { _decorator, BlockInputEvents, Button, instantiate, isValid, Label, Node, Prefab, Sprite, tween, UIOpacity, UITransform, Vec3, view } from 'cc';
import { EventType } from '../../../config/EventType';
import { AdvLevelConfig, BookLevelConfig } from '../../../manager/DataMgr';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { ViewsManager } from '../../../manager/ViewsManager';
import { AdventureCollectWordModel, AdventureResult, AdventureResultModel, GameMode, WordsDetailData } from '../../../models/AdventureModel';
import { PetModel } from '../../../models/PetModel';
import { RoleBaseModel } from '../../../models/RoleBaseModel';
import { GameSubmitModel, GameSubmitResponse, ReqCollectWord, ReqWordDetail, UnitWordModel } from '../../../models/TextbookModel';
import { InterfacePath } from '../../../net/InterfacePath';
import { NetNotify } from '../../../net/NetNotify';
import { ServiceMgr } from '../../../net/ServiceManager';
import { BaseView } from '../../../script/BaseView';
import { TBServer } from '../../../service/TextbookService';
import CCUtil from '../../../util/CCUtil';
import EventManager, { EventMgr } from '../../../util/EventManager';
import { ToolUtil } from '../../../util/ToolUtil';
import { SmallMonsterModel } from '../../common/SmallMonsterModel';
import { MonsterModel } from '../common/MonsterModel';
const { ccclass, property } = _decorator;

/**学习模式公共部分 */
@ccclass('BaseModeView')
export class BaseModeView extends BaseView {
    @property({ type: Button, tooltip: "关闭按钮" })
    public btn_close: Button = null;
    @property({ type: Node, tooltip: "收藏按钮" })
    public btn_collect: Node = null;

    @property({ type: Node, tooltip: "主面板" })
    mainNode: Node = null;
    @property(Prefab)
    public roleModel: Prefab = null;//角色动画
    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;
    @property({ type: Node, tooltip: "精灵容器" })
    public petContainer: Node = null;
    @property({ type: Prefab, tooltip: "精灵预制体" })
    public petModel: Prefab = null;
    @property({ type: Node, tooltip: "所有怪物容器" })
    public monsterContainer: Node = null;
    @property({ type: Prefab, tooltip: "小怪物预制体" })
    public smallMonsterModel: Prefab = null;
    @property({ type: Node, tooltip: "主怪物容器" })
    public monster: Node = null;
    @property({ type: Node, tooltip: "顶部模式进度容器" })
    topNode: Node = null;
    @property(Prefab)
    public monsterModel: Prefab = null;//怪物动画
    @property({ type: Label, tooltip: "错误次数" })
    public errorNumLabel: Label = null;
    @property({ type: Label, tooltip: "剩余时间" })
    public timeLabel: Label = null;

    protected _pet: Node = null; //精灵
    protected _role: Node = null; //人物
    protected _smallMonsters: Node[] = []; //小怪物

    protected _wordsData: UnitWordModel[] = null;
    protected _wordIndex: number = 0; //当前单词序号
    protected _detailData: WordsDetailData = null; //当前单词详情数据
    protected _levelData: AdvLevelConfig | BookLevelConfig = null; //当前关卡配置
    protected _monster: Node = null; //主怪动画节点
    protected _errorNum: number = 0; //错误数量
    protected _rightNum: number = 0; //正确数量
    protected _costTime: number = 0; //花费时间

    protected _getResultEveId: string; //获取结果
    protected _wordDetailEveId: string; //获取单词详情

    private _upResultSucce: boolean = false; //上报结果成功
    protected _currentSubmitResponse: GameSubmitResponse | AdventureResult = null;

    protected gameMode: number = 0; //游戏模式
    protected _isAdventure: boolean;
    protected _remainTime: number = 0; //剩余时间
    protected _errorWords: any = {}; //错误单词
    start() {
        this.node.getChildByName("img_bg").addComponent(BlockInputEvents);
        this.initRole(); //初始化角色
        this.initPet(); //初始化精灵
        this._costTime = Date.now();
        let scaleNum = view.getVisibleSize().width / view.getDesignResolutionSize().width;
        this.topNode.setScale(scaleNum, scaleNum, 1);
        this.initEvents();
    }

    initEvents() {
        CCUtil.onBtnClick(this.btn_collect, () => {
            this.onClickCollectEvent();
        });
    }

    updateTextbookWords(wordsdata: UnitWordModel[], levelData: any) {
        this._levelData = levelData;
        let isAdventure = this._levelData.hasOwnProperty('islandId'); //是否是大冒险关卡
        this._isAdventure = isAdventure;
        /** 从关卡数据中获取单词学习到哪个单词*/
        if (!isAdventure) {
            let levelData = this._levelData as BookLevelConfig;
            this._wordIndex = levelData.word_num - 1;
            this._remainTime = Math.round(levelData.time_remaining);
            /**如果当前关卡有错词，自动放到最后 */
            if (isValid(levelData.error_word)) {
                if (levelData.cur_game_mode === this.gameMode) {
                    levelData.error_num = Object.keys(levelData.error_word).length;
                    this._errorWords = levelData.error_word;
                    for (const key in levelData.error_word) {
                        if (levelData.error_word.hasOwnProperty(key)) {
                            const found = wordsdata.find(item => item.word === key);
                            if (found) {
                                wordsdata.push(found);
                            }
                        }
                    }
                } else {
                    levelData.error_num = 0;
                    this._wordIndex = 0;
                    const uniqueWordList: UnitWordModel[] = Object["values"](wordsdata.reduce((acc, curr) => {
                        acc[curr.word] = curr;
                        return acc;
                    }, {} as Record<string, UnitWordModel>));
                    wordsdata = uniqueWordList;
                }
            }
        } else {
            let levelData = this._levelData as AdvLevelConfig;
            let progressData = levelData.progressData;
            this._remainTime = Math.round(progressData.time_remaining);
            /**如果当前关卡有错词，自动放到最后 */
            if (progressData.game_mode === this.gameMode) {
                this._wordIndex = progressData.word_num - 1;
                this._rightNum = progressData.pass_num;
                if (isValid(progressData.error_word)) {
                    levelData.error_num = Object.keys(progressData.error_word).length;
                    this._errorWords = progressData.error_word;
                    for (const key in progressData.error_word) {
                        if (progressData.error_word.hasOwnProperty(key)) {
                            const found = wordsdata.find(item => item.word === key);
                            if (found) {
                                wordsdata.push(found);
                            }
                        }
                    }
                } else {
                    levelData.error_num = 0;
                }
            } else {
                this._wordIndex = 0;
                levelData.mapLevelData.current_mode = this.gameMode;
                levelData.error_num = 0;
                levelData.progressData.error_word = null;
                const uniqueWordList: UnitWordModel[] = Object["values"](wordsdata.reduce((acc, curr) => {
                    acc[curr.word] = curr;
                    return acc;
                }, {} as Record<string, UnitWordModel>));
                wordsdata = uniqueWordList;
            }
            console.log("progressData", progressData);
        }
        this.timeLabel.string = "剩余时间:" + ToolUtil.secondsToTimeFormat(this._remainTime);
        if (this._remainTime > 0 && this.gameMode != GameMode.Exam) {
            this.schedule(this.onTimer, 1);
        }
        this._errorNum = levelData.error_num;
        this.errorNumLabel.string = "错误次数:" + this._errorNum;
        return wordsdata;
    }

    onTimer() {
        this._remainTime--;
        if (this._isAdventure) {
            let levelData = this._levelData as AdvLevelConfig;
            levelData.progressData.time_remaining = this._remainTime;
        } else {
            let levelData = this._levelData as BookLevelConfig;
            levelData.time_remaining = this._remainTime;
        }
        this.timeLabel.string = "剩余时间:" + ToolUtil.secondsToTimeFormat(this._remainTime);
    }
    onInitModuleEvent() {
        this.addModelListener(NetNotify.Classification_ReportResult, this.onUpResult);
        this.addModelListener(NetNotify.Classification_Word, this.onClassificationWord);
        this.addModelListener(NetNotify.Classification_CollectWord, this.onCollectWord);
        this.addModelListener(EventType.Classification_AdventureCollectWord, this.onAdventureCollectWord);
    }

    async initRole() {
        this._role = instantiate(this.roleModel);
        this.roleContainer.addChild(this._role);
        let roleModel = this._role.getComponent(RoleBaseModel);
        roleModel.init(101, 1, [9500, 9700, 9701, 9702, 9703]);
        roleModel.show(true);
    }
    async initPet() {
        this._pet = instantiate(this.petModel);
        this.petContainer.addChild(this._pet);
        let roleModel = this._pet.getComponent(RoleBaseModel);
        roleModel.init(101, 1);
        roleModel.show(true);
    }
    async initMonster() {
        //单词大冒险关卡
        if (this._levelData.hasOwnProperty('islandId')) {
            let lvData = this._levelData as AdvLevelConfig;
            this._monster = instantiate(this.monsterModel);
            this.monster.addChild(this._monster);
            let monsterModel = this._monster.getComponent(MonsterModel);
            monsterModel.init("spine/monster/adventure/" + lvData.monsterAni);
            if (this.gameMode == GameMode.Exam) {
                this.monster.getComponent(UIOpacity).opacity = 125;
                return;
            }
            let len = this._wordsData.length - this._errorNum - 1;
            if (len > 4) {
                len = 4;
            }
            console.log("wordIdx", this._wordIndex);
            for (let i = 0; i < len; i++) {
                let sPoint = this.monsterContainer.getChildByName("spoint" + (i + 1));
                let monster = instantiate(this.smallMonsterModel);
                sPoint.addChild(monster);
                let monsterModel = monster.getComponent(SmallMonsterModel);
                monsterModel.init("spine/monster/adventure/" + lvData.miniMonsterAni).then(() => {
                    if (i < this._rightNum) {
                        monsterModel.die();
                    }
                })
                this._smallMonsters.push(monster);
            }
        } else { //教材单词关卡
            this._monster = instantiate(this.monsterModel);
            this.monster.addChild(this._monster);
            let scale = this._monster.getScale();
            this._monster.scale = new Vec3(-scale.x, scale.y, 1);
            let monsterModel = this._monster.getComponent(MonsterModel);
            monsterModel.init("spine/TextbookVocabulary/" + "10018");
            if (this.gameMode == GameMode.Exam) {
                this.monster.getComponent(UIOpacity).opacity = 125;
            }
        }
    }

    //怪物逃跑
    monsterEscape() {
        this.reportResult();
        let pos = this.monster.position;
        let scale = this.monster.getScale();
        this.monster.scale = new Vec3(-scale.x, scale.y, 1);
        tween(this.monster).to(1, { position: new Vec3(pos.x + 1000, pos.y, pos.z) }).call(() => {
            if (this._upResultSucce) {
                this.modeOver();
            }
        }).start();
    }

    //上报结果
    reportResult() {
        console.log("上报结果");
        let isAdventure = this._levelData.hasOwnProperty('islandId'); //是否是大冒险关卡
        if (isAdventure) { //大冒险关卡
            // let levelData = this._levelData as AdvLevelConfig;
            // let costTime = Date.now() - this._costTime;
            // ServiceMgr.studyService.submitAdventureResult(levelData.islandId, levelData.levelId, levelData.mapLevelData.micro_id, levelData.mapLevelData.current_mode, costTime);
        } else {
            //教材关卡
            // let levelData: BookLevelConfig = this._levelData as BookLevelConfig;
            // let data: ReportResultModel = {
            //     type_name: levelData.type_name,
            //     book_name: levelData.book_name,
            //     grade: levelData.grade,
            //     unit: levelData.unit,
            //     game_mode: this.gameMode,
            // }
            // let data = { code: 200 };
            // let levelData = this._levelData as BookLevelConfig;
            // levelData.word_num = 1;
            // EventMgr.dispatch(NetNotify.Classification_ReportResult, data);
            // TBServer.reqReportResult(data);
            this._upResultSucce = true;
        }
    }
    //当前模式结束,跳转下一模式或结算
    protected modeOver() {

    }

    //单个单词学习情况上报
    onGameSubmit(word: string, isRight: boolean) {
        /**单词上报仅限教材单词 */
        if (this._levelData.hasOwnProperty('islandId')) {
            let levelData = this._levelData as AdvLevelConfig;
            let costTime = Date.now() - this._costTime;
            let params: AdventureResultModel = {
                big_id: levelData.islandId,
                small_id: levelData.levelId,
                micro_id: levelData.mapLevelData.micro_id,
                game_mode: levelData.mapLevelData.current_mode,
                cost_time: costTime,
                status: isRight ? 1 : 0,
                word: word
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
            small_id: levelData.small_id,
            status: isRight ? 1 : 0
        }
        TBServer.reqGameSubmit(data);
    }

    //精灵攻击
    attackMonster() {
        return new Promise((resolve, reject) => {
            let targetMonster: Node;
            let isAdventure = this._levelData.hasOwnProperty('islandId'); //是否是大冒险关卡
            if (isAdventure) {
                targetMonster = this._rightNum == this._wordsData.length ? this._monster : this._smallMonsters[this._rightNum - 1];
                if (!targetMonster)
                    targetMonster = this._monster;
            } else {
                targetMonster = this._monster;
            }
            this.petAttackShow(targetMonster).then(() => {
                //大冒险关卡
                if (isAdventure) {
                    if (this._rightNum == this._wordsData.length) { //最后一个单词攻击主怪
                        this._monster.getComponent(MonsterModel).injury().then(() => {
                            resolve(true);
                        });
                    } else { //小怪受到攻击
                        if (this._smallMonsters[this._rightNum - 1]) {
                            this._smallMonsters[this._rightNum - 1].getComponent(SmallMonsterModel).hit();
                        } else {
                            this._monster.getComponent(MonsterModel).injury();
                        }
                        resolve(true);
                    }
                } else {
                    this._monster.getComponent(MonsterModel).inHit().then(() => {
                        resolve(true);
                    });
                }
            });
        });
    }

    //精灵攻击目标
    petAttackShow(target: Node) {
        return new Promise((resolve, reject) => {
            let petPos = new Vec3(this._pet.position);
            let targetTranform = target.parent.getComponent(UITransform);
            let petTransform = this.petContainer.getComponent(UITransform);
            let targetpos = petTransform.convertToNodeSpaceAR(targetTranform.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
            let startPosx = targetpos.x - petPos.x > 650 ? (targetpos.x - 650) : petPos.x;
            tween(this._pet).to(0.5, { position: new Vec3(startPosx, targetpos.y, targetpos.z) }).call(() => {
                this._pet.getComponent(PetModel).hit().then(() => {
                    tween(this._pet).to(0.5, { position: petPos }).start();
                    resolve(true);
                });
            }).start();
        });
    }

    //获取大冒险上报结果
    onUpResult(data: AdventureResult) {
        console.log("大冒险上报结果", data);
        if (data.code == 200) {
            this._currentSubmitResponse = data;
            this._upResultSucce = true;
            if (data.pass_flag == 1 && this._isAdventure) { //大冒险关卡
                let levelData = this._levelData as AdvLevelConfig;
                let pointData: any = {};
                pointData.big_id = levelData.mapLevelData.big_id;
                pointData.small_id = levelData.mapLevelData.small_id;
                pointData.micro_id = levelData.mapLevelData.micro_id;
                pointData.star = data.flag_star_num;
                EventManager.emit(EventType.Update_MapPoint, pointData);
            }
        }
    }

    //获取单词详情
    initWordDetail(word: string) {
        if (this._levelData.hasOwnProperty('islandId')) { //大冒险关卡
            let levelData: AdvLevelConfig = this._levelData as AdvLevelConfig;
            ServiceMgr.studyService.getAdventureWord(word, levelData.mapLevelData.big_id, levelData.mapLevelData.small_id, levelData.mapLevelData.micro_id);
        } else { //教材单词关卡
            let levelData: BookLevelConfig = this._levelData as BookLevelConfig;
            let data: ReqWordDetail = {
                type_name: levelData.type_name,
                book_name: levelData.book_name,
                grade: levelData.grade,
                unit: levelData.unit,
                word: word,
            }
            TBServer.reqWordDetail(data);
        }
    }

    protected onClassificationWord(data: WordsDetailData) {
        if (data.code != 200) {
            console.error("获取单词详情失败", data.msg);
            this._detailData = null;
            return;
        }
        console.log("获取单词详情", data);
        this._detailData = data;
        this.setCollect(data.collect_flag ? true : false);
    }

    protected onCollectWord(data: any) {
        console.log("onCollectWord", data);
        this._detailData.collect_flag = this._detailData.collect_flag ? 0 : 1;
        this.setCollect(this._detailData.collect_flag ? true : false);
    }

    protected onAdventureCollectWord(data: any) {
        console.log("onAdventureCollectWord", data);
        this._detailData.collect_flag = this._detailData.collect_flag ? 0 : 1;
        this.setCollect(this._detailData.collect_flag ? true : false);
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.btn_close.node, this.closeView, this);
        this._getResultEveId = EventManager.on(InterfacePath.Adventure_Result, this.onUpResult.bind(this));
        EventManager.on(NetNotify.Classification_ReportResult, this.onUpResult.bind(this));
        this._wordDetailEveId = EventManager.on(InterfacePath.Adventure_Word, this.onClassificationWord.bind(this));
    }
    protected removeEvent(): void {
        CCUtil.offTouch(this.btn_close.node, this.closeView, this);
        EventManager.off(InterfacePath.Adventure_Result, this._getResultEveId);
        EventManager.off(NetNotify.Classification_ReportResult, this.onUpResult.bind(this));
        EventManager.off(InterfacePath.Adventure_Word, this._wordDetailEveId);
        this.unschedule(this.onTimer);
    }

    protected closeView() {
        ViewsManager.instance.showConfirm("确定退出学习吗?", () => {
            let isAdventure = this._levelData.hasOwnProperty('islandId'); //是否是大冒险关卡
            if (!isAdventure) {
                EventMgr.dispatch(EventType.Exit_Island_Level);
            }
            this.node.destroy();
        });
    }
    onDestroy(): void {
        this.removeEvent();
        RemoteSoundMgr.clearAudio();
    }

    update(deltaTime: number) {

    }
    /**是否收藏 */
    protected setCollect(isCollect: boolean) {
        this.btn_collect.getComponent(Sprite).grayscale = !isCollect
    }
    /**收藏单词 */
    onClickCollectEvent() {
        console.log("onClickCollectEvent.....");
        let isAdventure = this._levelData.hasOwnProperty('islandId'); //是否是大冒险关卡
        let wordData = this._wordsData[this._wordIndex];
        console.log('word', wordData);
        if (!isAdventure) { //教材关卡
            let levelData = this._levelData as BookLevelConfig;
            let reqParam: ReqCollectWord = {
                word: wordData.word,
                type_name: levelData.type_name,
                book_name: levelData.book_name,
                grade: levelData.grade,
                unit: levelData.unit,
                action: this._detailData.collect_flag ? 0 : 1,
            }
            TBServer.reqCollectWord(reqParam);
        } else {
            //大冒险关卡
            let levelData = this._levelData as AdvLevelConfig;
            let reqParam: AdventureCollectWordModel = {
                big_id: levelData.islandId,
                small_id: levelData.levelId,
                micro_id: levelData.mapLevelData.micro_id,
                action: this._detailData.collect_flag ? 0 : 1,
            }
            ServiceMgr.studyService.reqAdventureCollectWord(reqParam);
        }

    }
}

