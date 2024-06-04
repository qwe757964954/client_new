import { Label, Layers, Node, Prefab, UITransform, Vec3, Widget, _decorator, error, instantiate, isValid, tween } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { PetModel } from '../../models/PetModel';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import { NodeUtil } from '../../util/NodeUtil';
import { MonsterModel } from '../adventure/common/MonsterModel';
import WordBossArray, { BossGameInfo, BossInfo } from './BossInfo';
import { AnswerType } from './ChallengeAnswerItem';
import { ChallengeFrameView } from './ChallengeFrameView';
const { ccclass, property } = _decorator;

@ccclass('BossChallengeView')
export class BossChallengeView extends BaseView {
    @property(Node)
    public content_layout:Node = null;

    @property(Node)
    public img_bg:Node = null;

    @property(Node)
    public btn_close:Node = null;

    @property(Prefab)
    public roleModel: Prefab = null;//角色动画
    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;
    @property({ type: Node, tooltip: "精灵容器" })
    public petContainer: Node = null;
    @property({ type: Prefab, tooltip: "精灵预制体" })
    public petModel: Prefab = null;
    @property(Prefab)
    public monsterModel: Prefab = null;//怪物动画
    @property({ type: Node, tooltip: "所有怪物容器" })
    public monsterContainer: Node = null;
    @property({ type: Node, tooltip: "主怪物容器" })
    public monster: Node = null;

    @property(Label)
    public remaining_challenge:Label = null;

    @property(Label)
    public remaining_word:Label = null;

    private _challengeFrame:ChallengeFrameView = null;
    protected _monster: Node = null; //主怪动画节点
    private _bossGame:BossGameInfo = null;
    protected _pet: Node = null; //精灵
    protected _role: Node = null; //人物
    private _monsterPos:Vec3 = null;
    onLoad(): void {
        this.initUI();
        this.initEvent();
    }
    initUI(){
        this.initChallengeFrame();
        this.initRole(); //初始化角色
        this.initPet(); //初始化精灵
    }
    async initData(bossGame: BossGameInfo) {
        let bossData:BossInfo =  WordBossArray[bossGame.BossNo];
        console.log(bossGame);
        this._bossGame = bossGame;
        this.initMonster(bossData); //初始化怪物
        this.updateRemainingInfo(bossGame);
    }
    updateRemainingInfo(bossGame: BossGameInfo){
        let remaining_num = 50 - this._bossGame.SubmitNum;
        this.remaining_challenge.string = `剩余挑战次数：${remaining_num}`;
        this.remaining_word.string = `剩余单词量：${this._bossGame.LastNum}`;
    }
    async initRole() {
        this._role = instantiate(this.roleModel);
        this.roleContainer.addChild(this._role);
        NodeUtil.setLayerRecursively(this._role,Layers.Enum.UI_2D);
        let roleModel = this._role.getComponent(RoleBaseModel);
        roleModel.init(101, 1, [9500, 9700, 9701, 9702, 9703]);
        roleModel.show(true);
    }
    async initPet() {
        this._pet = instantiate(this.petModel);
        this.petContainer.addChild(this._pet);
        NodeUtil.setLayerRecursively(this._pet,Layers.Enum.UI_2D);
        let roleModel = this._pet.getComponent(RoleBaseModel);
        roleModel.init(101, 1);
        roleModel.show(true);
    }
    
    initMonster(bossData:BossInfo){
        this._monster = instantiate(this.monsterModel);
        this.monster.addChild(this._monster);
        this._monsterPos = new Vec3(this._monster.position);
        NodeUtil.setLayerRecursively(this._monster,Layers.Enum.UI_2D);
        this._monster.setScale(bossData.challengeScale, bossData.challengeScale, bossData.challengeScale);
        let monsterModel = this._monster.getComponent(MonsterModel);
        const filePathWithoutExtension: string = bossData.skeleton.replace(".json", "");
        monsterModel.init(filePathWithoutExtension);
    }
    
    start() {
        
    }
    onInitModuleEvent(){
        this.addModelListener(EventType.Challenge_ReportResult,this.onChallengeReportResult);
    }
    initEvent(){
        CCUtil.onTouch(this.btn_close, this.onCloseView, this);
    }
    removeEvent(){
        CCUtil.offTouch(this.btn_close, this.onCloseView, this);
    }
    
    initChallengeFrame(){
        ResLoader.instance.load(`prefab/${PrefabType.ChallengeFrameView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.content_layout.addChild(node);
            this._challengeFrame = node.getComponent(ChallengeFrameView);
            this._challengeFrame.onLoadWordData(this._bossGame.Words);
            let widgetCom = node.getComponent(Widget);
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignBottom = true;
            }
            widgetCom.bottom = -280;
        });
    }
    onCloseView(){
        ViewsManager.instance.showView(PrefabType.WorldBossView, (node: Node) => {
            ViewsManager.instance.closeView(PrefabType.BossChallengeView);
        });
    }
    onChallengeReportResult(params:{result:AnswerType}){
        
        console.log(params);
        if(params.result == AnswerType.Correct){
            this.attackMonster().then(() => {
                this._challengeFrame.onLoadWordData(this._bossGame.Words);
            });
        }else{
            this.attackPet().then(() =>{
                this._challengeFrame.onLoadWordData(this._bossGame.Words);
            });
        }
    }
    onDestroy() {
        super.onDestroy();
		this.removeEvent();
	};

    //怪物攻击

    attackPet() {
        return new Promise((resolve, reject) => {
            let targetPet = this._pet;
            this.monsterAttackShow(targetPet).then(() => {
                this._pet.getComponent(PetModel).inHit().then(() => {
                    resolve(true);
                });
            });
        });
    }
    monsterAttackShow(target: Node) {
        return new Promise((resolve, reject) => {
            
            let spNode = this._monster.getChildByName("sp")
            let sp_real_width = spNode.getComponent(UITransform).width * spNode.scale.x * this._monster.scale.x*0.5;
            let targetTranform = target.parent.getComponent(UITransform);
            let monsterTransform = this.monsterContainer.getComponent(UITransform);
            let targetpos = monsterTransform.convertToNodeSpaceAR(targetTranform.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
            this._monster.getComponent(MonsterModel).move();
            tween(this._monster).to(1, { position: new Vec3(targetpos.x + sp_real_width, this._monsterPos.y, targetpos.z) }).call(() => { 
                this._monster.getComponent(MonsterModel).hit().then(() => { 
                    tween(this._monster).to(0.5, { position: this._monsterPos }).start(); 
                    resolve(true);
                });
                // this._monster.getComponent(MonsterModel).hit().then(() => { tween(this._monster).to(0.5, { position: monsterPos }).start(); resolve(true); 
            }).start();
        });
    }
    //精灵攻击
    attackMonster() {
        return new Promise((resolve, reject) => {
            let targetMonster = this._monster;
            this.petAttackShow(targetMonster).then(() => {
                this._monster.getComponent(MonsterModel).inHit().then(() => {
                    resolve(true);
                });
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
}


