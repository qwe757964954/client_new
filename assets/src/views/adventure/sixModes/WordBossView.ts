import { _decorator, Component, instantiate, Label, Node, NodePool, Prefab, SpriteFrame, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { BaseModeView } from './BaseModeView';
import { BossLevelData, BossLevelSubmitData, BossLevelTopicData, GameMode, TopicData } from '../../../models/AdventureModel';
import { MonsterModel } from '../common/MonsterModel';
import { DataMgr } from '../../../manager/DataMgr';
import { BossWordItem } from './items/BossWordItem';
import CCUtil from '../../../util/CCUtil';
import { ServiceMgr } from '../../../net/ServiceManager';
import { EventMgr } from '../../../util/EventManager';
import { InterfacePath } from '../../../net/InterfacePath';
import { ViewsManager } from '../../../manager/ViewsManager';
import { PrefabType } from '../../../config/PrefabType';
import { ExamReportView } from './ExamReportView';
import { PetModel } from '../../../models/PetModel';
import { EventType } from '../../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('WordBossView')
export class WordBossView extends BaseModeView {
    @property({ type: Prefab, tooltip: "选项item" })
    wordItem: Prefab = null;
    @property({ type: Node, tooltip: "选项节点" })
    itemNode: Node = null;
    @property({ type: Label, tooltip: "句子Label" })
    sentenceLabel: Label = null;
    @property({ type: Label, tooltip: "中文Label" })
    cnLabel: Label = null;
    @property({ type: SpriteFrame, tooltip: "正确图片" })
    rightSprite: SpriteFrame = null;
    @property({ type: SpriteFrame, tooltip: "错误图片" })
    wrongSprite: SpriteFrame = null;
    private _bossLevelData: BossLevelTopicData;
    private _topicsData: TopicData[] = [];

    private _selectLock: boolean = false;
    private _items: Node[] = [];
    protected _nodePool: NodePool = new NodePool("bossWordItem");
    private _isRight: boolean = false; //是否回答正确
    private _resultData: BossLevelSubmitData;

    private _currentTopic: TopicData; //当前题目
    async initData(levelData: BossLevelTopicData) {
        this.gameMode = GameMode.WordBoss;
        this._bossLevelData = levelData;
        this.initProgress();
        this.initTopic(levelData.exercises_list);
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
    initTopic(data: TopicData[]) {
        console.log('initTopic', data);
        this._topicsData = data;
        this.showCurrentWord();
    }

    showCurrentWord() {
        super.updateConstTime();
        this._selectLock = false;
        this._currentTopic = this._topicsData[this._wordIndex];
        this.sentenceLabel.string = this._currentTopic.content;
        this.cnLabel.string = this._currentTopic.cn;
        this.initItemNode();
    }

    //初始化拆分节点
    initItemNode() {
        this.clearSplitItems();
        let opts = [this._currentTopic.answer, this._currentTopic.opt1, this._currentTopic.opt2];
        opts.sort((a, b) => {
            return Math.random() > 0.5 ? 1 : -1;
        }); //乱序

        for (let i = 0; i < opts.length; i++) {
            let item = this.getSplitItem();
            item.getComponent(BossWordItem).init(opts[i], i);
            item.parent = this.itemNode;
            CCUtil.onTouch(item, this.onItemClick, this);
            this._items.push(item);
        }
    }

    onItemClick(e: any) {
        if (this._selectLock) return;
        this._selectLock = true;
        let item = e.target;
        let wordItem = item.getComponent(BossWordItem);
        this._wordIndex++;
        this._isRight = wordItem.word == this._currentTopic.answer;
        let status = this._isRight ? 1 : 2;
        let costTime = Date.now() - this._costTime;
        ServiceMgr.studyService.submitBossLevelTopic(this._bossLevelData.big_id, this._bossLevelData.challenge_info.bl_id, this._currentTopic.be_id, status, wordItem.word, costTime);
        if (this._isRight) { //正确
            wordItem.showResult(true);
            this._rightNum++;
        } else {
            wordItem.showResult(false);
            this._errorNum++;
        }
        this.timeLabel.string = "当前进度:" + this._wordIndex + "/" + this._bossLevelData.challenge_info.need_num;
        this.errorNumLabel.string = "错误次数:" + this._errorNum;
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

    getSplitItem() {
        let item = this._nodePool.get();
        if (!item) {
            item = instantiate(this.wordItem);
        }
        return item;
    }

    clearSplitItems() {
        for (let i = 0; i < this._items.length; i++) {
            CCUtil.offTouch(this._items[i], this.onItemClick, this);
            this._items[i].parent = null;
            this._nodePool.put(this._items[i]);
        }

        this._items = [];
    }

    protected initEvent(): void {
        EventMgr.addListener(InterfacePath.BossLevel_Submit, this.onSubmit, this);
        CCUtil.onTouch(this.btn_close.node, this.closeView, this);
    }

    removeEvent() {
        EventMgr.removeListener(InterfacePath.BossLevel_Submit, this);
        CCUtil.offTouch(this.btn_close.node, this.closeView, this);
    }

    protected closeView() {
        ViewsManager.instance.showConfirm("确定退出学习吗?", () => {
            this.node.destroy();
        });
    }

    onDestroy(): void {
        super.onDestroy();
        for (let i = 0; i < this._items.length; i++) {
            CCUtil.offTouch(this._items[i], this.onItemClick, this);
        }
        this._items = [];
        this._nodePool.clear();
    }
}


