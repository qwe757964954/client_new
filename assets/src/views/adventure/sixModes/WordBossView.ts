import { _decorator, Component, instantiate, Label, Node, NodePool, Prefab, SpriteFrame, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { BaseModeView } from './BaseModeView';
import { BossLevelData, BossLevelSubmitData, BossLevelTopicData, GameMode, BossTopicData } from '../../../models/AdventureModel';
import { MonsterModel } from '../common/MonsterModel';
import { DataMgr } from '../../../manager/DataMgr';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';
import { InterfacePath } from '../../../net/InterfacePath';
import { ViewsManager, ViewsMgr } from '../../../manager/ViewsManager';
import { PrefabType } from '../../../config/PrefabType';
import { ExamReportView } from './ExamReportView';
import { PetModel } from '../../../models/PetModel';
import { SubjectType, UnitSubject } from '../../theme/GradeSkipSubjectManager';
import { WordMeanSubject } from '../../theme/subject/WordMeanSubject';
import { WordSpellSubject } from '../../theme/subject/WordSpellSubject';
import { WordReadingSubject } from '../../theme/subject/WordReadingSubject';
import { WordExamSubject } from '../../theme/subject/WordExamSubject';
import { EventType } from '../../../config/EventType';
import { SoundMgr } from '../../../manager/SoundMgr';
import { ServiceMgr } from '../../../net/ServiceManager';
const { ccclass, property } = _decorator;

@ccclass('WordBossView')
export class WordBossView extends BaseModeView {
    @property(Node)
    public subjectNode: Node = null;
    @property(Prefab)
    public wordMeanSubject: Prefab = null;
    @property(Prefab)
    public wordSpellSubject: Prefab = null;
    @property(Prefab)
    public wordReadingSubject: Prefab = null;
    @property(Prefab)
    public wordExamSubject: Prefab = null;
    private _bossLevelData: BossLevelTopicData;
    private _topicsData: BossTopicData[] = [];
    private _isRight: boolean = false; //是否回答正确
    private _resultData: BossLevelSubmitData;
    private _w_id_list: string[];

    private _currentSubjectView: Node;
    private _currentTopic: BossTopicData; //当前题目
    async initData(levelData: BossLevelTopicData) {
        this.gameMode = GameMode.WordBoss;
        this._bossLevelData = levelData;
        this._w_id_list = levelData.challenge_info.w_id_list;
        this._topicsData = levelData.challenge_info.word_list;
        this.initProgress();
        this.initTopic();
        this.initMonster(); //初始化怪物
    }

    async initMonster() {
        this._monster = instantiate(this.monsterModel);
        this.monster.addChild(this._monster);
        let monsterModel = this._monster.getComponent(MonsterModel);
        let levelData: BossLevelData = DataMgr.getIslandBossConfig(this._bossLevelData.big_id);
        monsterModel.init("spine/monster/adventure/" + levelData.bossAni);
        if (this.gameMode == GameMode.Exam) {
            this.monster.getComponent(UIOpacity).opacity = 125;
        }
    }

    //初始化进度
    initProgress() {
        let progressData = this._bossLevelData.challenge_info;
        this._wordIndex = progressData.word_num;
        this._errorNum = progressData.err_num;
        this.timeLabel.string = "当前进度:" + this._wordIndex + "/" + progressData.need_num;
        this.errorNumLabel.string = "错误次数:" + this._errorNum;
    }

    //初始化题目
    initTopic() {
        this.showCurrentWord();
    }

    showCurrentWord() {
        super.updateConstTime();
        let currentWid = this._w_id_list[this._wordIndex];
        this._currentTopic = this.getTopicDataByWid(currentWid);
        if (!this._currentTopic) {
            ViewsMgr.showTip("题目不存在");
            return;
        }
        if (this._currentSubjectView) {
            this._currentSubjectView.destroy();
        }
        let subjetType = Math.floor(Math.random() * 4); //单词题目模式随机
        switch (subjetType) {
            case SubjectType.WordMeaning:
                this._currentSubjectView = instantiate(this.wordMeanSubject);
                this._currentSubjectView.getComponent(WordMeanSubject).setData(this._currentTopic, this._topicsData);
                break;
            case SubjectType.WordSpelling:
                this._currentSubjectView = instantiate(this.wordSpellSubject);
                this._currentSubjectView.getComponent(WordSpellSubject).setData(this._currentTopic, this._currentTopic);
                break;
            case SubjectType.WordReading:
                this._currentSubjectView = instantiate(this.wordReadingSubject);
                this._currentSubjectView.getComponent(WordReadingSubject).setData(this._currentTopic);
                break;
            case SubjectType.WordExam:
                this._currentSubjectView = instantiate(this.wordExamSubject);
                this._currentSubjectView.getComponent(WordExamSubject).setData(this._currentTopic);
                break;
        }
        this._currentSubjectView.parent = this.subjectNode;
    }

    getTopicDataByWid(wid: string) {
        return this._topicsData.find(item => item.w_id == wid);
    }

    onSubjectResult(isRight: boolean) {
        this._isRight = isRight;
        if (isRight) {
            this._comboNum++;
            this.showRightSpAni();
        } else {
            this._comboNum = 0;
            this._errorNum++;
            SoundMgr.wrong();
        }
        this._wordIndex++;
        this.timeLabel.string = "当前进度:" + this._wordIndex + "/" + this._bossLevelData.challenge_info.need_num;
        this.errorNumLabel.string = "错误次数:" + this._errorNum;

        let status = this._isRight ? 1 : 2;
        let costTime = Date.now() - this._costTime;
        ServiceMgr.studyService.submitBossLevelTopic(this._bossLevelData.big_id, this._bossLevelData.challenge_info.bl_id, this._currentTopic.w_id, status, "", costTime);
    }

    onSubmit(data: BossLevelSubmitData) {
        this._resultData = data;
        if (this._isRight) { //正确
            this.attackMonster().then(() => {
                if (this._resultData.flag == 1) { //胜利
                    this.monsterDie();
                } else {
                    this.showCurrentWord();
                }
            });
        } else {
            this.monsterAttack().then(() => {
                if (this._resultData.flag != 0) { //失败
                    this.showResult();
                } else {
                    this.showCurrentWord();
                }
            });
        }
    }

    //怪物攻击精灵
    monsterAttack() {
        return new Promise((resolve, reject) => {
            if (!this._monster) {
                resolve(true);
                return;
            }
            let action = "attack";
            this._monster.getComponent(MonsterModel).hit(action).then(() => {
                this._pet.getComponent(PetModel).inHit().then(() => {
                    resolve(true);
                });
            });
        })
    }

    attackMonster() {
        return new Promise((resolve, reject) => {
            let targetMonster: Node;
            targetMonster = this._monster;
            this.petAttackShow(targetMonster).then(() => {
                // this._monster.getComponent(MonsterModel).inHit().then(() => {
                resolve(true);
                // });
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
            tween(this._pet).to(0.5, { position: new Vec3(startPosx, petPos.y, targetpos.z) }).call(() => {
                this._pet.getComponent(PetModel).hit().then(() => {
                    tween(this._pet).to(0.5, { position: petPos }).start();
                    resolve(true);
                });
            }).start();
        });
    }

    //怪物死亡
    monsterDie() {
        this._monster.getComponent(MonsterModel).die().then(() => {
            this.showResult();
        })
    }

    //显示结果
    showResult() {
        if (this._resultData.flag == 1 || this._resultData.flag == 2) { //成功或失败
            ViewsManager.instance.showView(PrefabType.ExamReportView, (node: Node) => {
                let nodeScript = node.getComponent(ExamReportView);
                nodeScript.initBossLevel(this._resultData);
                ViewsManager.instance.closeView(PrefabType.WordBossView);
            });
        }
    }

    protected initEvent(): void {
        EventMgr.addListener(InterfacePath.BossLevel_Submit, this.onSubmit, this);
        EventMgr.addListener(EventType.GradeSkip_Subject_Result, this.onSubjectResult, this);
        CCUtil.onTouch(this.btn_close.node, this.closeView, this);
    }

    removeEvent() {
        EventMgr.removeListener(InterfacePath.BossLevel_Submit, this);
        EventMgr.removeListener(EventType.GradeSkip_Subject_Result, this);
        CCUtil.offTouch(this.btn_close.node, this.closeView, this);
    }

    protected closeView() {
        ViewsManager.instance.showConfirm("确定退出学习吗?", () => {
            this.node.destroy();
        });
    }
}


