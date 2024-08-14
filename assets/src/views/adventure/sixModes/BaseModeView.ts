import { _decorator, BlockInputEvents, Button, Color, instantiate, isValid, Label, Node, Prefab, Sprite, tween, UIOpacity, UITransform, Vec3, view } from 'cc';
import { EventType } from '../../../config/EventType';
import { TextConfig } from '../../../config/TextConfig';
import { GameBundle, GameRes } from '../../../GameRes';
import GlobalConfig from '../../../GlobalConfig';
import { BookLevelConfig, DataMgr } from '../../../manager/DataMgr';
import { inf_SpineAniCreate } from '../../../manager/InterfaceDefines';
import { LoadManager } from '../../../manager/LoadManager';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { SoundMgr } from '../../../manager/SoundMgr';
import { ViewsManager, ViewsMgr } from '../../../manager/ViewsManager';
import { AdventureCollectWordModel, AdventureResult, AdventureResultModel, GameMode, GateData, WordsDetailData } from '../../../models/AdventureModel';
import { s2cReviewPlanLongTimeWordSubmit, s2cReviewPlanSubmit, s2cWordbookWordSubmit } from '../../../models/NetModel';
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
import FileUtil from '../../../util/FileUtil';
import ImgUtil from '../../../util/ImgUtil';
import { ToolUtil } from '../../../util/ToolUtil';
import { SmallMonsterModel } from '../../common/SmallMonsterModel';
import { EducationDataInfo, EducationDataInfos } from '../../TextbookVocabulary/TextbookInfo';
import { MonsterModel } from '../common/MonsterModel';
import { TopLabel } from '../common/TopLabel';
const { ccclass, property } = _decorator;
/**游戏来源 */
export enum GameSourceType {
    classification = 1,//教材单词
    word_game = 2,//单词大冒险
    review = 3,//复习规划
    reviewSpecial = 4,//复习规划（长时间未复习单词）
    errorWordbook = 5,//错题本
    collectWordbook = 6,//收藏本
}
/**单词提交数据 */
class WordSubmitData {
    word: string;
    isRight: boolean;
    wordData?: any;
    answer?: string;
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

    private _rightAniNode: Node = null;

    protected _pet: Node = null; //精灵
    protected _petAttackView: Node = null; //精灵攻击
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

    private _upResultSucce: boolean = false; //上报结果成功
    protected _isModeOver: boolean = false; //是否模式结束
    protected _isDoModeOver: boolean = false; //是否执行模式结束
    // protected _currentSubmitResponse: GameSubmitResponse | AdventureResult = null;
    protected _currentSubmitResponse: any = null;

    protected gameMode: number = 0; //游戏模式
    protected _sourceType: GameSourceType = null;//游戏来源类型
    protected _remainTime: number = 0; //剩余时间
    protected _errorWords: any = {}; //错误单词
    protected _hpLevels = { 0: 0, 7: 1, 3: 2, 1: 3, 4: 4, 2: 0 }; //各模式对应的已扣除血量
    protected _totalTime: number = 5 * 60 * 1000;

    protected _comboNum: number = 0; //连击次数
    protected _rightWordData: UnitWordModel = null; //正确单词数据
    protected _curWordSubmitData: WordSubmitData = null; //当前单词提交数据
    start() {
        super.start();
        this.offViewAdaptSize();
        this.node.getChildByName("img_bg").addComponent(BlockInputEvents);
        this.initRole(); //初始化角色
        this.initPet(); //初始化精灵
        this.initPetAttack();//攻击被攻击特效view
        let scaleNum = view.getVisibleSize().width / view.getDesignResolutionSize().width;
        this.topNode.setScale(scaleNum, scaleNum, 1);

        this._rightAniNode = new Node();
        this._rightAniNode.parent = this.node;
        this._rightAniNode.active = false;
    }

    async addTransitionView() {

        if (!isValid(this.node.getChildByName("dark"))) {
            await ImgUtil.create_PureNode(this.node);
            let dark = this.node.getChildByName("dark");
            dark.addComponent(UIOpacity);
            dark.active = false;
        }
    }

    showTransitionView(callback: () => void) {
        let dark = this.node.getChildByName("dark");
        dark.active = true;
        let uiOpacity = dark.getComponent(UIOpacity);
        uiOpacity.opacity = 0;
        tween(uiOpacity).to(0.5, { opacity: 255 }).call(() => {
            // callback?.();
        }).to(0.5, { opacity: 0 }).call(() => {
            callback?.();
        }).start();
    }

    updateTextbookWords(wordsdata: UnitWordModel[], levelData: any) {
        this.addTransitionView();
        this._levelData = levelData;
        this._sourceType = this._levelData.source_type || (this._levelData.hasOwnProperty('big_id') ? GameSourceType.word_game : GameSourceType.classification);

        if (GameSourceType.classification === this._sourceType) {
            let levelData = this._levelData as BookLevelConfig;
            this._wordIndex = levelData.word_num - 1;
            this._remainTime = Math.round(levelData.time_remaining);

            if (isValid(levelData.error_word)) {
                if (levelData.cur_game_mode === this.gameMode) {
                    this._errorWords = levelData.error_word;
                    for (const key in levelData.error_word) {
                        if (levelData.error_word.hasOwnProperty(key)) {
                            const found = wordsdata.find(item => item.w_id === key);
                            if (found) {
                                wordsdata.push(found);
                            }
                        }
                    }
                } else {
                    this._wordIndex = 0;
                    const uniqueWordList: UnitWordModel[] = Object.values(wordsdata.reduce((acc, curr) => {
                        acc[curr.w_id] = curr;
                        return acc;
                    }, {}));
                    wordsdata = uniqueWordList;
                }
            }
            this._rightNum = this._wordIndex;
        } else if (GameSourceType.word_game == this._sourceType) {
            let levelData = this._levelData as GateData;
            let progressData = levelData.progressData;
            this._remainTime = Math.round((this._totalTime - progressData.cost_time) / 1000);

            if (progressData.game_mode === this.gameMode) {
                this._wordIndex = progressData.word_num - 1;
                this._rightNum = progressData.pass_num;
                if (isValid(progressData.error_word)) {
                    this._errorWords = progressData.error_word;
                    for (const key in progressData.error_word) {
                        if (progressData.error_word.hasOwnProperty(key)) {
                            const found = wordsdata.find(item => item.w_id === key);
                            if (found) {
                                wordsdata.push(found);
                            }
                        }
                    }
                }
            } else {
                this._wordIndex = 0;
                levelData.current_mode = this.gameMode;
                levelData.progressData.error_word = null;
                const uniqueWordList: UnitWordModel[] = Object.values(wordsdata.reduce((acc, curr) => {
                    acc[curr.word] = curr;
                    return acc;
                }, {}));
                wordsdata = uniqueWordList;
            }

        } else if (GameSourceType.review === this._sourceType || GameSourceType.reviewSpecial === this._sourceType ||
            GameSourceType.errorWordbook == this._sourceType || GameSourceType.collectWordbook == this._sourceType) {
            this._wordIndex = this._levelData.word_num;
            this._rightNum = this._levelData.pass_num;
            this._errorNum = this._levelData.error_num;
            this.topNode.active = false;
            this.btn_collect.active = false;
            let bg = this.node.getChildByName("img_bg");
            LoadManager.loadSprite("adventure/sixModes/study/img_bg2/spriteFrame", bg.getComponent(Sprite)).then(() => {
                CCUtil.fillNodeScale(bg, GlobalConfig.WIN_SIZE.width, GlobalConfig.WIN_SIZE.height);
            });
        }

        this.timeLabel.string = "剩余时间:" + ToolUtil.secondsToTimeFormat(this._remainTime);
        if (this._remainTime > 0 && this.gameMode !== GameMode.Exam) {
            this.schedule(this.onTimer, 1);
            this.timeLabel.color = Color.WHITE;
        } else {
            if (this.gameMode != GameMode.Exam) {
                this.timeLabel.string = "已超时";
                this.timeLabel.color = Color.RED;
            }
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
            this.timeLabel.string = "已超时";
            this.timeLabel.color = Color.RED;
        } else {
            this.timeLabel.string = "剩余时间:" + ToolUtil.secondsToTimeFormat(this._remainTime);
            if (this._remainTime <= 60) {
                this.topNode.getComponent(TopLabel).warnIcon.active = true;
            }
        }
        if (GameSourceType.word_game == this._sourceType) {
            let levelData = this._levelData as GateData;
            // levelData.progressData.time_remaining = this._remainTime;
            levelData.progressData.cost_time += 1000;
        } else if (GameSourceType.classification == this._sourceType) {
            let levelData = this._levelData as BookLevelConfig;
            levelData.time_remaining = this._remainTime;
        }

    }
    onInitModuleEvent() {
        console.log("onInitModuleEvent..base");
        this.addModelListener(NetNotify.Classification_ReportResult, this.onUpResult);
        this.addModelListener(NetNotify.Classification_Word, this.onClassificationWord);
        this.addModelListener(NetNotify.Classification_CollectWord, this.onCollectWord);
        this.addModelListener(EventType.Classification_AdventureCollectWord, this.onAdventureCollectWord);
        this.addModelListener(NetNotify.Classification_GameSubmit, this.onGameSubmitResponse);
        this.addModelListener(InterfacePath.Adventure_Result, this.onUpResult);
        this.addModelListener(InterfacePath.Adventure_Word, this.onClassificationWord);
        this.addModelListener(InterfacePath.c2sReviewPlanSubmit, this.onRepReviewSubmit);
        this.addModelListener(InterfacePath.c2sReviewPlanLongTimeWordSubmit, this.onRepReviewPlanLongTimeWordSubmit);
        this.addModelListener(InterfacePath.c2sWordbookWordSubmit, this.onRepWordbookWordSubmit);
    }
    onGameSubmitResponse(data: GameSubmitResponse) {
        console.log("onGameSubmitResponse....", data);
        this._currentSubmitResponse = data;
        this._currentSubmitResponse as GameSubmitResponse;
        // this.checkResult();
        this.netReqOver();
    }

    async initRole() {
        if (GameSourceType.review == this._sourceType || GameSourceType.reviewSpecial === this._sourceType ||
            GameSourceType.errorWordbook == this._sourceType || GameSourceType.collectWordbook == this._sourceType) return;
        this._role = instantiate(this.roleModel);
        this.roleContainer.addChild(this._role);
        let roleModel = this._role.getComponent(RoleBaseModel);
        roleModel.initSelf();
        roleModel.show(true);
    }
    async initPet() {
        this._pet = instantiate(this.petModel);
        this.petContainer.addChild(this._pet);
        let roleModel = this._pet.getComponent(RoleBaseModel);
        roleModel.initSelf();
        roleModel.show(true);
        CCUtil.setNodeCamera2DUI(this._pet);
    }

    initPetAttack() {
        this._petAttackView = ImgUtil.create_2DNode("petAttackView");
        this._petAttackView.setScale(-0.5, 0.5, 0.5);
        this.petContainer.addChild(this._petAttackView);
    }

    async initMonster() {
        //单词大冒险关卡
        if (GameSourceType.word_game == this._sourceType) {
            let lvData = this._levelData as GateData;
            this._monster = instantiate(this.monsterModel);
            this.monster.addChild(this._monster);
            let monsterModel = this._monster.getComponent(MonsterModel);
            let monsterData = DataMgr.getMonsterData(lvData.monster_id);
            monsterModel.init("spine/monster/adventure/" + monsterData.monsterAni, true);
            let totalHp = this.gameMode == GameMode.Exam ? this._wordsData.length : this._wordsData.length * 5;
            monsterModel.setHp(this._wordsData.length * this._hpLevels[this.gameMode] + this._rightNum, totalHp);
            if (this.gameMode == GameMode.Exam) {
                this.monster.getComponent(UIOpacity).opacity = 125;
                return;
            }
            let errNum = Object.keys(this._errorWords).length;
            let len = this._wordsData.length - errNum - 1;
            if (len > 4) {
                len = 4;
            }
            console.log("wordIdx", this._wordIndex);
            for (let i = 0; i < len; i++) {
                let sPoint = this.monsterContainer.getChildByName("spoint" + (i + 1));
                let monster = instantiate(this.smallMonsterModel);
                sPoint.addChild(monster);
                let monsterModel = monster.getComponent(SmallMonsterModel);
                let monsterData = DataMgr.getMonsterData(lvData.monster_id);
                monsterModel.init("spine/monster/adventure/" + monsterData.miniMonsterAni).then(() => {
                    if (i < this._rightNum) {
                        monsterModel.die();
                    }
                })
                this._smallMonsters.push(monster);
            }
        } else if (GameSourceType.classification == this._sourceType) { //教材单词关卡
            let levelData = this._levelData as BookLevelConfig;
            this._monster = instantiate(this.monsterModel);
            this.monster.addChild(this._monster);
            let sp = this._monster.getChildByName("sp");
            let scale = sp.getScale();
            sp.scale = new Vec3(-scale.x * 0.4, scale.y * 0.4, 1);
            // sp.setPosition(sp.getPosition().x, sp.getPosition().y - 20)
            let monsterModel = this._monster.getComponent(MonsterModel);
            let educationInfo: EducationDataInfo = EducationDataInfos.find(item => item.id === levelData.monster_id);
            monsterModel.init(FileUtil.removeFileExtension(educationInfo.monster), true);
            if (this.gameMode == GameMode.Exam) {
                this.monster.getComponent(UIOpacity).opacity = 125;
            }

            let pass = levelData.word_num - 1;
            console.log("this.gameMode = ", this.gameMode, this._wordsData);
            let totalHp = this.gameMode == GameMode.Exam ? this._wordsData.length : this._wordsData.length * 5;
            console.log("totalHp = ", totalHp, this._hpLevels[this.gameMode]);
            monsterModel.setHp(this._wordsData.length * this._hpLevels[this.gameMode] + pass, totalHp);
            // let hp_scale = monsterModel.hpNode.getScale();
            // monsterModel.hpNode.scale = new Vec3(-hp_scale.x, hp_scale.y, 1);
        } else if (GameSourceType.review == this._sourceType || GameSourceType.reviewSpecial === this._sourceType ||
            GameSourceType.errorWordbook == this._sourceType || GameSourceType.collectWordbook == this._sourceType) { //复习规划与单词本
            this._monster = instantiate(this.monsterModel);
            this.monster.addChild(this._monster);
            let scale = this._monster.getScale();
            this._monster.scale = new Vec3(-scale.x * 0.4, scale.y * 0.4, 1);
            let monsterModel = this._monster.getComponent(MonsterModel);
            let educationInfo: EducationDataInfo = EducationDataInfos.find(item => item.id === this._levelData.monster_id);
            monsterModel.init(FileUtil.removeFileExtension(educationInfo.monster), true);
            monsterModel.setHp(this._rightNum, this._levelData.wordCount);
            CCUtil.setNodeCamera2DUI(this._monster);
        }
    }

    //怪物逃跑
    monsterEscape() {
        this.reportResult();
        let pos = this.monster.position;
        let scale = this.monster.getScale();
        this.monster.scale = new Vec3(-scale.x, scale.y, 1);
        tween(this.monster).to(1, { position: new Vec3(pos.x + 1000, pos.y, pos.z) }).call(() => {
            this._isModeOver = true;
            if (this._upResultSucce) {
                this.modeOver();
            }
        }).start();
    }

    //上报结果
    reportResult() {
        console.log("上报结果");
        if (GameSourceType.classification == this._sourceType) {
            this._upResultSucce = true;
        }
    }
    //当前模式结束,跳转下一模式或结算
    protected modeOver() {
        this._isDoModeOver = true;
        if (GameSourceType.classification == this._sourceType) {
            let levelData = this._levelData as BookLevelConfig;
            levelData.word_num = 1;
        }
        // ViewsMgr.closeConfirmView();
    }

    //单个单词学习情况上报
    onGameSubmit(word: string, isRight: boolean, wordData?: any, answer?: string) {
        let submitData = new WordSubmitData();
        submitData.word = word;
        submitData.isRight = isRight;
        submitData.wordData = wordData;
        submitData.answer = answer;
        this._curWordSubmitData = submitData;

        /**单词上报仅限教材单词 */
        if (GameSourceType.word_game == this._sourceType) {
            let levelData = this._levelData as GateData;
            let costTime = Date.now() - this._costTime;
            let params: AdventureResultModel = {
                big_id: levelData.big_id,
                small_id: levelData.small_id,
                game_mode: levelData.current_mode,
                cost_time: costTime,
                status: isRight ? 1 : 0,
                word: word
            }
            ServiceMgr.studyService.submitAdventureResult(params);
            return;
        }
        if (GameSourceType.classification == this._sourceType) {
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
            console.log("reqGameSubmit.....", data);
            TBServer.reqGameSubmit(data);
            return;
        }
        if (GameSourceType.review == this._sourceType) {
            let costTime = Date.now() - this._costTime;
            ServiceMgr.studyService.reqReviewPlanSubmit(this._levelData.ws_id, wordData["wp_id"], word, answer, isRight ? 1 : 0, costTime);
            return;
        }
        if (GameSourceType.reviewSpecial === this._sourceType) {
            let costTime = Date.now() - this._costTime;
            ServiceMgr.studyService.reqReviewPlanLongTimeWordSubmit(wordData["wp_id"], word, answer, isRight ? 1 : 0, costTime);
            return;
        }
        if (GameSourceType.errorWordbook == this._sourceType || GameSourceType.collectWordbook == this._sourceType) {
            let costTime = Date.now() - this._costTime;
            let word_type = (GameSourceType.errorWordbook == this._sourceType) ? "err" : "collect";
            let m_id = (GameSourceType.errorWordbook == this._sourceType) ? wordData.e_id : wordData.cw_id;
            ServiceMgr.wordbookSrv.reqWordSubmit(m_id, word, answer, isRight ? 1 : 0, costTime, word_type);
            return;
        }
    }

    //精灵攻击
    attackMonster() {
        return new Promise((resolve, reject) => {
            let targetMonster: Node;
            if (GameSourceType.word_game == this._sourceType) {
                targetMonster = this._rightNum == this._wordsData.length ? this._monster : this._smallMonsters[this._rightNum - 1];
                if (!targetMonster)
                    targetMonster = this._monster;
            } else {
                targetMonster = this._monster;
            }
            this.petAttackShow(targetMonster).then(() => {
                let monsterModel = this._monster.getComponent(MonsterModel);
                //大冒险关卡
                if (GameSourceType.word_game == this._sourceType) {
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
                } else if (GameSourceType.classification == this._sourceType) {
                    let totalHp = this.gameMode == GameMode.Exam ? this._wordsData.length : this._wordsData.length * 5;
                    let pass = this._rightNum;
                    monsterModel.setHp(this._wordsData.length * this._hpLevels[this.gameMode] + pass, totalHp);
                    monsterModel.inHit().then(() => {
                        resolve(true);
                    });
                } else if (GameSourceType.review == this._sourceType || GameSourceType.reviewSpecial === this._sourceType ||
                    GameSourceType.errorWordbook == this._sourceType || GameSourceType.collectWordbook == this._sourceType) {
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
            let targetTransform = target.parent.getComponent(UITransform);
            let petTransform = this.petContainer.getComponent(UITransform);
            let targetPos = petTransform.convertToNodeSpaceAR(targetTransform.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
            let startPosX = targetPos.x - petPos.x > 600 ? (targetPos.x - 600) : petPos.x;
            tween(this._pet).to(0.5, { position: new Vec3(startPosX, targetPos.y, targetPos.z) }).call(() => {
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
            let targetTransform = target.parent.getComponent(UITransform);
            let transform = this.monster.getComponent(UITransform);
            let targetPos = transform.convertToNodeSpaceAR(targetTransform.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
            let startPosX = targetPos.x + 100;
            tween(this._monster).to(0.5, { position: new Vec3(startPosX, targetPos.y, targetPos.z) }).call(() => {
                // let action = (WordSourceType.word_game === this._sourceType) ? "attack" : "atk1";
                this._monster.getComponent(MonsterModel).hit().then(() => {
                    tween(this._monster).to(0.5, { position: monsterPos }).start();
                    this._pet.getComponent(PetModel).inHit().then(() => {
                        resolve(true);
                    });
                });
                this.showMonsterEffect(() => {

                });
            }).start();
        });
    }

    showMonsterEffect(callback: () => void) {
        if (this._sourceType === GameSourceType.word_game) {
            callback?.();
            return;
        }
        let resConf = { bundle: GameBundle.NORMAL, path: EducationDataInfos[0].monster_effect }
        let spinePrams: inf_SpineAniCreate = {
            resConf: resConf,
            aniName: "attack",
            trackIndex: 0,
            parentNode: this._petAttackView,
            isLoop: false,
            callEndFunc: () => {
                callback?.();
                this._petAttackView.removeAllChildren();
            }
        }
        EventMgr.dispatch(EventType.Sys_Ani_Play, spinePrams);
    }

    //获取大冒险上报结果
    onUpResult(data: AdventureResult) {
        console.log("大冒险上报结果", data);
        if (data.code == 200) {
            this._currentSubmitResponse = data;
            this._upResultSucce = true;
            if (data.pass_flag == 1 && GameSourceType.word_game == this._sourceType) { //大冒险关卡
                let levelData = this._levelData as GateData;
                let pointData: any = {};
                pointData.big_id = levelData.big_id;
                pointData.small_id = levelData.small_id;
                pointData.star = data.star_num;
                EventManager.emit(EventType.Update_MapPoint, pointData);
            }
            // this.checkResult();
            this.netReqOver();
        }
    }
    /**获取复习规划上报结果 */
    onRepReviewSubmit(data: s2cReviewPlanSubmit) {
        console.log("onRepReviewSubmit", data);
        this._currentSubmitResponse = data;
        this._upResultSucce = true;
        this.netReqOver();
    }
    onRepReviewPlanLongTimeWordSubmit(data: s2cReviewPlanLongTimeWordSubmit) {
        this._currentSubmitResponse = data;
        this._upResultSucce = true;
        this.netReqOver();
    }
    private onRepWordbookWordSubmit(data: s2cWordbookWordSubmit) {
        this._currentSubmitResponse = data;
        this._upResultSucce = true;
        this.netReqOver();
    }
    /**ui显示结束 */
    uiShowOver() {
    }
    /**网络请求结束 */
    netReqOver() {
    }

    //检测上报结果是否失败
    checkResult() {

    }

    showRightSpAni() {
        SoundMgr.correct();
        this._rightAniNode.active = true;
        let aniName = "";
        if (this._comboNum == 1) {
            aniName = "animation_2"
        } else if (this._comboNum == 2) {
            aniName = "animation_1"
        } else if (this._comboNum > 2) {
            aniName = Math.random() > 0.5 ? "animation_3" : "animation_4";
        }
        let spinePrams: inf_SpineAniCreate = {
            resConf: GameRes.Spine_Correct,
            aniName: aniName,
            trackIndex: 0,
            parentNode: this._rightAniNode,
            isLoop: false,
            callEndFunc: () => {
                this._rightAniNode.active = false;
            }
        }
        this._rightAniNode.removeAllChildren();
        EventMgr.dispatch(EventType.Sys_Ani_Play, spinePrams);
    }

    //获取单词详情
    initWordDetail(word: UnitWordModel) {
        if (GameSourceType.word_game == this._sourceType) { //大冒险关卡
            ServiceMgr.studyService.getAdventureWord(word.w_id);
        } else if (GameSourceType.classification == this._sourceType) { //教材单词关卡
            TBServer.reqWordDetail(word.w_id);
        } else if (GameSourceType.review == this._sourceType || GameSourceType.reviewSpecial === this._sourceType) {
            // TBServer.reqWordDetail(word.w_id);
        }
        this.setCollect(word.collect == 1 ? true : false);
    }

    protected onClassificationWord(data: WordsDetailData) {
        if (data.code != 200) {
            console.error("获取单词详情失败", data.msg);
            this._detailData = null;
            return;
        }
        console.log("获取单词详情", data);
        this._detailData = data;
        this.setCollect(this._detailData.collect_flag === 1);
    }

    protected onCollectWord(data: any) {
        console.log("onCollectWord", data);
        this.setCollect(this._rightWordData.collect === 1);
        if (this._rightWordData.collect) {
            ViewsMgr.showTipSmall(TextConfig.Collect_Succ, this.btn_collect, new Vec3(0, 80, 0));
        } else {
            ViewsMgr.showTipSmall(TextConfig.Collect_Cancel, this.btn_collect, new Vec3(0, 80, 0));
        }
    }

    protected onAdventureCollectWord(data: any) {
        if (data.code != 200) {
            ViewsManager.showTip(data.msg);
            return;
        }
        this.setCollect(this._rightWordData.collect === 1);
        if (this._rightWordData.collect) {
            ViewsMgr.showTipSmall(TextConfig.Collect_Succ, this.btn_collect, new Vec3(0, 80, 0));
        } else {
            ViewsMgr.showTipSmall(TextConfig.Collect_Cancel, this.btn_collect, new Vec3(0, 80, 0));
        }
    }

    protected initEvent(): void {
        console.log("initEvent");
        CCUtil.onTouch(this.btn_close.node, this.closeView, this);

        CCUtil.onBtnClick(this.btn_collect, () => {
            this.onClickCollectEvent();
        });
    }
    protected removeEvent(): void {
        CCUtil.offTouch(this.btn_close.node, this.closeView, this);
        this.unschedule(this.onTimer);
    }

    protected closeView() {
        let str = TextConfig.WordMeaning_Exit_Tip1;
        if (GameSourceType.review == this._sourceType || GameSourceType.reviewSpecial === this._sourceType) {
            str = TextConfig.WordMeaning_Exit_Tip2;
        }
        ViewsMgr.showConfirm(str, () => {
            if (!this.node) return;
            if (GameSourceType.classification == this._sourceType) {
                EventMgr.dispatch(EventType.Exit_Island_Level);
            } else if (GameSourceType.review == this._sourceType || GameSourceType.reviewSpecial === this._sourceType) {
                EventMgr.emit(EventType.Wordbook_List_Refresh);// 通知
                ServiceMgr.studyService.reqReviewPlan();//刷新复习规划
            } else if (GameSourceType.errorWordbook == this._sourceType || GameSourceType.collectWordbook == this._sourceType) {
                EventMgr.emit(EventType.Wordbook_List_Refresh);// 通知
            }
            this.node.destroy();
        }).then((confirmView) => {
            if (GameSourceType.word_game == this._sourceType || GameSourceType.classification == this._sourceType) {
                confirmView.showExtraLabel(TextConfig.Midway_Exit);
            }
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
        if (!this._rightWordData) return;
        let wordData = this._rightWordData;
        wordData.collect = wordData.collect == 1 ? 0 : 1;
        console.log('word', wordData);
        if (GameSourceType.classification == this._sourceType) { //教材关卡
            let reqParam: ReqCollectWord = {
                w_id: wordData.w_id,
                action: wordData.collect,
            }
            TBServer.reqCollectWord(reqParam);
        } else if (GameSourceType.word_game == this._sourceType) {
            //大冒险关卡
            let reqParam: AdventureCollectWordModel = {
                w_id: wordData.w_id,
                action: wordData.collect,
            }
            ServiceMgr.studyService.reqAdventureCollectWord(reqParam);
        }

    }
}

