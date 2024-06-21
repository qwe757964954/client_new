import { _decorator, BlockInputEvents, Button, instantiate, isValid, Label, Node, Prefab, Sprite, tween, UIOpacity, UITransform, Vec3, view } from 'cc';
import { EventType } from '../../../config/EventType';
import GlobalConfig from '../../../GlobalConfig';
import { AdvLevelConfig, BookLevelConfig } from '../../../manager/DataMgr';
import { LoadManager } from '../../../manager/LoadManager';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { ViewsMgr } from '../../../manager/ViewsManager';
import { AdventureCollectWordModel, AdventureResult, AdventureResultModel, GameMode, WordsDetailData } from '../../../models/AdventureModel';
import { s2cReviewPlanSubmit } from '../../../models/NetModel';
import { PetModel } from '../../../models/PetModel';
import { RoleBaseModel } from '../../../models/RoleBaseModel';
import { GameSubmitModel, GameSubmitResponse, ReqCollectWord, UnitWordModel } from '../../../models/TextbookModel';
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

export enum WordSourceType {
    classification = 1,//教材单词
    word_game = 2,//单词大冒险
    review = 3,//复习规划
}

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
    // protected _levelData: AdvLevelConfig | BookLevelConfig = null; //当前关卡配置
    protected _levelData: any = null; //当前关卡配置
    protected _monster: Node = null; //主怪动画节点
    protected _errorNum: number = 0; //错误数量
    protected _rightNum: number = 0; //正确数量
    protected _costTime: number = 0; //花费时间

    protected _getResultEveId: string; //获取结果
    protected _wordDetailEveId: string; //获取单词详情
    protected _getReviewResultEveId: string; //获取复习规划结果

    private _upResultSucce: boolean = false; //上报结果成功
    // protected _currentSubmitResponse: GameSubmitResponse | AdventureResult = null;
    protected _currentSubmitResponse: any = null;

    protected gameMode: number = 0; //游戏模式
    protected _sourceType: WordSourceType = null;//单词来源类型
    protected _remainTime: number = 0; //剩余时间
    protected _errorWords: any = {}; //错误单词
    protected _hpLevels = { 0: 0, 7: 1, 3: 2, 1: 3, 4: 4, 2: 0 }; //各模式对应的已扣除血量
    start() {
        super.start();
        this.node.getChildByName("img_bg").addComponent(BlockInputEvents);
        this.initRole(); //初始化角色
        this.initPet(); //初始化精灵

        let scaleNum = view.getVisibleSize().width / view.getDesignResolutionSize().width;
        this.topNode.setScale(scaleNum, scaleNum, 1);
    }
    updateTextbookWords(wordsdata: UnitWordModel[], levelData: any) {
        this._levelData = levelData;
        if (null != this._levelData.source_type) {
            this._sourceType = this._levelData.source_type;
        } else {
            let isAdventure = this._levelData.hasOwnProperty('bigId'); //是否是大冒险关卡
            this._sourceType = isAdventure ? WordSourceType.word_game : WordSourceType.classification;
        }

        /** 从关卡数据中获取单词学习到哪个单词*/
        if (WordSourceType.classification == this._sourceType) {
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
        } else if (WordSourceType.word_game == this._sourceType) {
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
        } else if (WordSourceType.review == this._sourceType) {
            this._wordIndex = this._levelData.word_num;
            this._rightNum = this._levelData.pass_num;
            this._errorNum = this._levelData.error_num;
            this.topNode.active = false;
            this.btn_collect.active = false;
            let bg = this.node.getChildByName("img_bg");
            LoadManager.loadSprite("adventure/sixModes/study/img_bg2/spriteFrame", bg.getComponent(Sprite)).then(() => {
                CCUtil.fillNodeScale(bg, GlobalConfig.WIN_SIZE.width, GlobalConfig.WIN_SIZE.height);
            });
            console.log("updateTextbookWords", this._levelData.ws_id, this._levelData);
        }
        this.timeLabel.string = "剩余时间:" + ToolUtil.secondsToTimeFormat(this._remainTime);
        if (this._remainTime > 0 && this.gameMode != GameMode.Exam) {
            this.schedule(this.onTimer, 1);
        }
        this._errorNum = levelData.error_num;
        this.errorNumLabel.string = "错误次数:" + this._errorNum;
        return wordsdata;
    }

    updateConstTime() {
        this._costTime = Date.now();
    }

    onTimer() {
        this._remainTime--;
        if (this._remainTime <= 0) {
            this.unschedule(this.onTimer);
            this._remainTime = 0;
        }
        if (WordSourceType.word_game == this._sourceType) {
            let levelData = this._levelData as AdvLevelConfig;
            levelData.progressData.time_remaining = this._remainTime;
        } else if (WordSourceType.classification == this._sourceType) {
            let levelData = this._levelData as BookLevelConfig;
            levelData.time_remaining = this._remainTime;
        }
        this.timeLabel.string = "剩余时间:" + ToolUtil.secondsToTimeFormat(this._remainTime);
    }
    onInitModuleEvent() {
        console.log("onInitModuleEvent..base");
        this.addModelListener(NetNotify.Classification_ReportResult, this.onUpResult);
        this.addModelListener(NetNotify.Classification_Word, this.onClassificationWord);
        this.addModelListener(NetNotify.Classification_CollectWord, this.onCollectWord);
        this.addModelListener(EventType.Classification_AdventureCollectWord, this.onAdventureCollectWord);
        this.addModelListener(NetNotify.Classification_GameSubmit, this.onGameSubmitResponse);
    }
    onGameSubmitResponse(data: GameSubmitResponse) {
        console.log("onGameSubmitResponse....", data);
        this._currentSubmitResponse = data;
        this._currentSubmitResponse as GameSubmitResponse;
        this.checkResult();
    }

    async initRole() {
        if (WordSourceType.review == this._sourceType) return;
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
        if (WordSourceType.word_game == this._sourceType) {
            let lvData = this._levelData as AdvLevelConfig;
            this._monster = instantiate(this.monsterModel);
            this.monster.addChild(this._monster);
            let monsterModel = this._monster.getComponent(MonsterModel);
            monsterModel.init("spine/monster/adventure/" + lvData.monsterAni, true);
            let totalHp = this.gameMode == GameMode.Exam ? this._wordsData.length : this._wordsData.length * 5;
            monsterModel.setHp(this._wordsData.length * this._hpLevels[this.gameMode] + this._rightNum, totalHp);
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
        } else if (WordSourceType.classification == this._sourceType) { //教材单词关卡
            this._monster = instantiate(this.monsterModel);
            this.monster.addChild(this._monster);
            let scale = this._monster.getScale();
            this._monster.scale = new Vec3(-scale.x, scale.y, 1);
            let monsterModel = this._monster.getComponent(MonsterModel);
            monsterModel.init("spine/TextbookVocabulary/" + "10018", true);
            if (this.gameMode == GameMode.Exam) {
                this.monster.getComponent(UIOpacity).opacity = 125;
            }
            let levelData = this._levelData as BookLevelConfig;
            let pass = levelData.word_num - levelData.error_num;
            let totalHp = this.gameMode == GameMode.Exam ? this._wordsData.length : this._wordsData.length * 5;
            monsterModel.setHp(this._wordsData.length * this._hpLevels[this.gameMode] + pass, totalHp);
        } else if (WordSourceType.review == this._sourceType) { //复习规划
            this._monster = instantiate(this.monsterModel);
            this.monster.addChild(this._monster);
            let scale = this._monster.getScale();
            this._monster.scale = new Vec3(-scale.x, scale.y, 1);
            let monsterModel = this._monster.getComponent(MonsterModel);
            monsterModel.init("spine/TextbookVocabulary/" + "10018", true);
            monsterModel.setHp(this._rightNum, this._levelData.wordCount);
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
        if (WordSourceType.classification == this._sourceType) {
            this._upResultSucce = true;
        }
    }
    //当前模式结束,跳转下一模式或结算
    protected modeOver() {

    }

    //单个单词学习情况上报
    onGameSubmit(word: string, isRight: boolean, wordData?: any, answer?: string) {
        /**单词上报仅限教材单词 */
        if (WordSourceType.word_game == this._sourceType) {
            let levelData = this._levelData as AdvLevelConfig;
            let costTime = Date.now() - this._costTime;
            let params: AdventureResultModel = {
                big_id: levelData.bigId,
                small_id: levelData.smallId,
                micro_id: levelData.mapLevelData.micro_id,
                game_mode: levelData.mapLevelData.current_mode,
                cost_time: costTime,
                status: isRight ? 1 : 0,
                word: word
            }
            ServiceMgr.studyService.submitAdventureResult(params);
            return;
        }
        if (WordSourceType.classification == this._sourceType) {
            let levelData: BookLevelConfig = this._levelData as BookLevelConfig;
            let costTime = Date.now() - this._costTime;
            console.log("costTime.....", costTime, this._costTime);
            let data: GameSubmitModel = {
                book_id: levelData.book_id,
                unit_id: levelData.unit_id,
                game_mode: this.gameMode,
                cost_time: costTime,
                word: word,
                small_id: levelData.small_id,
                status: isRight ? 1 : 0
            }
            TBServer.reqGameSubmit(data);
            return;
        }
        if (WordSourceType.review == this._sourceType) {
            let costTime = Date.now() - this._costTime;
            ServiceMgr.studyService.reqReviewPlanSubmit(this._levelData.ws_id, wordData["wp_id"], word, answer, isRight ? 1 : 0, costTime);
            return;
        }
    }

    //精灵攻击
    attackMonster() {
        return new Promise((resolve, reject) => {
            let targetMonster: Node;
            if (WordSourceType.word_game == this._sourceType) {
                targetMonster = this._rightNum == this._wordsData.length ? this._monster : this._smallMonsters[this._rightNum - 1];
                if (!targetMonster)
                    targetMonster = this._monster;
            } else {
                targetMonster = this._monster;
            }
            this.petAttackShow(targetMonster).then(() => {
                let monsterModel = this._monster.getComponent(MonsterModel);
                //大冒险关卡
                if (WordSourceType.word_game == this._sourceType) {
                    if (this._rightNum == this._wordsData.length) { //最后一个单词攻击主怪
                        monsterModel.injury().then(() => {
                            resolve(true);
                        });
                    } else { //小怪受到攻击
                        if (this._smallMonsters[this._rightNum - 1]) {
                            this._smallMonsters[this._rightNum - 1].getComponent(SmallMonsterModel).hit();
                        } else {
                            monsterModel.injury();
                        }
                        resolve(true);
                    }
                    let totalHp = this.gameMode == GameMode.Exam ? this._wordsData.length : this._wordsData.length * 5;
                    monsterModel.setHp(this._wordsData.length * this._hpLevels[this.gameMode] + this._rightNum, totalHp);
                } else if (WordSourceType.classification == this._sourceType) {
                    let totalHp = this.gameMode == GameMode.Exam ? this._wordsData.length : this._wordsData.length * 5;
                    let pass = this._wordIndex - this._errorNum;
                    monsterModel.setHp(this._wordsData.length * this._hpLevels[this.gameMode] + pass, totalHp);
                    monsterModel.inHit().then(() => {
                        resolve(true);
                    });
                } else if (WordSourceType.review == this._sourceType) {
                    monsterModel.setHp(this._rightNum, this._levelData.wordCount);
                    monsterModel.inHit().then(() => {
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
            let startPosx = targetpos.x - petPos.x > 600 ? (targetpos.x - 600) : petPos.x;
            tween(this._pet).to(0.5, { position: new Vec3(startPosx, targetpos.y, targetpos.z) }).call(() => {
                this._pet.getComponent(PetModel).hit().then(() => {
                    tween(this._pet).to(0.5, { position: petPos }).start();
                    resolve(true);
                });
            }).start();
        });
    }

    //怪物攻击精灵
    monsterAttack() {
        return new Promise((resolve, reject) => {
            if (!this._monster) {
                resolve(true);
                return;
            }
            let target = this._pet;
            let monsterPos = new Vec3(this._monster.position);
            let targetTranform = target.parent.getComponent(UITransform);
            let transform = this.monster.getComponent(UITransform);
            let targetpos = transform.convertToNodeSpaceAR(targetTranform.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
            let startPosx = targetpos.x + 100;
            tween(this._monster).to(0.5, { position: new Vec3(startPosx, targetpos.y, targetpos.z) }).call(() => {
                let action = (WordSourceType.word_game == this._sourceType) ? "attack" : "atk1";
                this._monster.getComponent(MonsterModel).hit(action).then(() => {
                    tween(this._monster).to(0.5, { position: monsterPos }).start();
                    this._pet.getComponent(PetModel).inHit().then(() => {
                        resolve(true);
                    });
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
            if (data.pass_flag == 1 && WordSourceType.word_game == this._sourceType) { //大冒险关卡
                let levelData = this._levelData as AdvLevelConfig;
                let pointData: any = {};
                pointData.big_id = levelData.mapLevelData.big_id;
                pointData.small_id = levelData.mapLevelData.small_id;
                pointData.micro_id = levelData.mapLevelData.micro_id;
                pointData.star = data.flag_star_num;
                EventManager.emit(EventType.Update_MapPoint, pointData);
            }
            // this.checkResult();
        }
    }
    /**获取复习规划上报结果 */
    onRepReviewSubmit(data: s2cReviewPlanSubmit) {
        console.log("onRepReviewSubmit", data);
        this._currentSubmitResponse = data;
        this._upResultSucce = true;
    }

    //检测上报结果是否失败
    checkResult() {

    }

    //获取单词详情
    initWordDetail(word: UnitWordModel) {
        if (WordSourceType.word_game == this._sourceType) { //大冒险关卡
            ServiceMgr.studyService.getAdventureWord(word.w_id);
        } else if (WordSourceType.classification == this._sourceType) { //教材单词关卡
            TBServer.reqWordDetail(word.w_id);
        } else if (WordSourceType.review == this._sourceType) {
            // TBServer.reqWordDetail(word.w_id);
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
        console.log("initEvent");
        CCUtil.onTouch(this.btn_close.node, this.closeView, this);
        this._getResultEveId = EventManager.on(InterfacePath.Adventure_Result, this.onUpResult.bind(this));
        this._wordDetailEveId = EventManager.on(InterfacePath.Adventure_Word, this.onClassificationWord.bind(this));
        this._getReviewResultEveId = EventMgr.on(InterfacePath.c2sReviewPlanSubmit, this.onRepReviewSubmit.bind(this));
        CCUtil.onBtnClick(this.btn_collect, () => {
            this.onClickCollectEvent();
        });
    }
    protected removeEvent(): void {
        CCUtil.offTouch(this.btn_close.node, this.closeView, this);
        EventManager.off(InterfacePath.Adventure_Result, this._getResultEveId);
        EventManager.off(InterfacePath.Adventure_Word, this._wordDetailEveId);
        EventMgr.off(InterfacePath.c2sReviewPlanSubmit, this._getReviewResultEveId);
        this.unschedule(this.onTimer);
    }

    protected closeView() {
        let str = "确定退出学习吗?";
        if (WordSourceType.review == this._sourceType) {
            str = "确定结束复习吗?\n完成复习可参与扭蛋机抽奖哦";
        }
        ViewsMgr.showConfirm(str, () => {
            if (WordSourceType.classification == this._sourceType) {
                EventMgr.dispatch(EventType.Exit_Island_Level);
            }
            this.node.destroy();
        });
    }
    onDestroy(): void {
        super.onDestroy();
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
        let wordData = this._wordsData[this._wordIndex];
        console.log('word', wordData);
        if (WordSourceType.classification == this._sourceType) { //教材关卡
            let levelData = this._levelData as BookLevelConfig;
            let reqParam: ReqCollectWord = {
                w_id: wordData.w_id,
                action: this._detailData.collect_flag ? 0 : 1,
            }
            TBServer.reqCollectWord(reqParam);
        } else if (WordSourceType.word_game == this._sourceType) {
            //大冒险关卡
            // let levelData = this._levelData as AdvLevelConfig;
            let reqParam: AdventureCollectWordModel = {
                w_id: wordData.w_id,
                action: this._detailData.collect_flag ? 0 : 1,
            }
            ServiceMgr.studyService.reqAdventureCollectWord(reqParam);
        }

    }
}

