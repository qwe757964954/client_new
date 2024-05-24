import { _decorator, BlockInputEvents, Button, instantiate, Node, Prefab, Sprite, tween, UITransform, Vec3, view } from 'cc';
import { AdvLevelConfig, BookLevelConfig } from '../../../manager/DataMgr';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { s2cAdventureResult, WordsDetailData } from '../../../models/AdventureModel';
import { PetModel } from '../../../models/PetModel';
import { RoleBaseModel } from '../../../models/RoleBaseModel';
import { GameSubmitModel, UnitWordModel } from '../../../models/TextbookModel';
import { InterfacePath } from '../../../net/InterfacePath';
import { NetNotify } from '../../../net/NetNotify';
import { ServiceMgr } from '../../../net/ServiceManager';
import { BaseView } from '../../../script/BaseView';
import { TBServer } from '../../../service/TextbookService';
import CCUtil from '../../../util/CCUtil';
import EventManager, { EventMgr } from '../../../util/EventManager';
import { SmallMonsterModel } from '../../common/SmallMonsterModel';
import { MonsterModel } from '../common/MonsterModel';
import { ViewsManager } from '../../../manager/ViewsManager';
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

    protected gameMode: number = 0; //游戏模式
    start() {
        this.node.getChildByName("img_bg").addComponent(BlockInputEvents);
        this.initRole(); //初始化角色
        this.initPet(); //初始化精灵
        this._costTime = Date.now();
        let scaleNum = view.getVisibleSize().width / view.getDesignResolutionSize().width;
        this.topNode.setScale(scaleNum, scaleNum, 1);
    }
    onLoad(): void {

    }

    onInitModuleEvent() {
        this.addModelListener(NetNotify.Classification_ReportResult, this.onUpResult);
        this.addModelListener(NetNotify.Classification_Word, this.onClassificationWord);
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
            let len = this._wordsData.length - 1;
            if (len > 4) {
                len = 4;
            }
            for (let i = 0; i < len; i++) {
                let sPoint = this.monsterContainer.getChildByName("spoint" + (i + 1));
                let monster = instantiate(this.smallMonsterModel);
                sPoint.addChild(monster);
                let monsterModel = monster.getComponent(SmallMonsterModel);
                monsterModel.init("spine/monster/adventure/" + lvData.miniMonsterAni);
                this._smallMonsters.push(monster);
            }
        } else { //教材单词关卡
            this._monster = instantiate(this.monsterModel);
            this.monster.addChild(this._monster);
            let scale = this._monster.getScale();
            this._monster.scale = new Vec3(-scale.x, scale.y, 1);
            let monsterModel = this._monster.getComponent(MonsterModel);
            monsterModel.init("spine/TextbookVocabulary/" + "10018");
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
            let levelData = this._levelData as AdvLevelConfig;
            let costTime = Date.now() - this._costTime;
            ServiceMgr.studyService.submitAdventureResult(levelData.islandId, levelData.levelId, levelData.mapLevelData.micro_id, levelData.mapLevelData.current_mode, costTime);
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
            let data = {code:200};
            let levelData = this._levelData as BookLevelConfig;
            levelData.word_num = 1;
            EventMgr.dispatch(NetNotify.Classification_ReportResult, data);
            // TBServer.reqReportResult(data);
        }
    }

    //当前模式结束,跳转下一模式或结算
    protected modeOver() {

    }
    //单个单词学习情况上报
    onGameSubmit(word: string) {
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
            small_id:levelData.small_id,
            word_flag:1
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
    onUpResult(data: s2cAdventureResult) {
        console.log("大冒险上报结果", data);
        if (data.code == 200) {
            this._upResultSucce = true;
        } else {
        }
    }

    //获取单词详情
    initWordDetail(word: string) {
        if (this._levelData.hasOwnProperty('islandId')) { //大冒险关卡
            ServiceMgr.studyService.getAdventureWord(word);
        } else { //教材单词关卡
            let levelData: BookLevelConfig = this._levelData as BookLevelConfig;
            TBServer.reqWordDetail(word,levelData.id);
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
    }

    protected closeView() {
        ViewsManager.instance.showConfirm("确定退出学习吗?", () => {
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
    onClickCollectEvent(){
        console.log("onClickCollectEvent.....");
        let isAdventure = this._levelData.hasOwnProperty('islandId'); //是否是大冒险关卡
        let wordData = this._wordsData[this._wordIndex];
        console.log('word', wordData);
        if (isAdventure) { //大冒险关卡

        } else {
            //教材关卡
            
        }

    }
}

