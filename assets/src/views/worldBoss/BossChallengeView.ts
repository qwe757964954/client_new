import { Label, Layers, Node, Prefab, Widget, _decorator, error, instantiate, isValid } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import { NodeUtil } from '../../util/NodeUtil';
import { MonsterModel } from '../adventure/common/MonsterModel';
import WordBossArray, { BossGameInfo, BossInfo } from './BossInfo';
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
        NodeUtil.setLayerRecursively(this._monster,Layers.Enum.UI_2D);
        this._monster.setScale(bossData.challengeScale, bossData.challengeScale, bossData.challengeScale);
        let monsterModel = this._monster.getComponent(MonsterModel);
        const filePathWithoutExtension: string = bossData.skeleton.replace(".json", "");
        monsterModel.init(filePathWithoutExtension);
    }
    
    start() {
        
    }
    onInitModuleEvent(){
        // this.addModelListener(EventType.Challenge_WorldBoss,this.onChallengeWorldBoss);
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
        ViewsManager.instance.closeView(PrefabType.BossChallengeView);
    }

    onDestroy() {
        super.onDestroy();
		this.removeEvent();
	};
}


