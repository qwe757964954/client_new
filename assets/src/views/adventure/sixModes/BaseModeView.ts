import { _decorator, Button, Component, instantiate, Node, Prefab, Sprite, tween, Vec3 } from 'cc';
import { AdvLevelConfig, BookLevelConfig } from '../../../manager/DataMgr';
import { RemoteSoundMgr } from '../../../manager/RemoteSoundManager';
import { PetModel } from '../../../models/PetModel';
import { RoleBaseModel } from '../../../models/RoleBaseModel';
import { UnitWordModel } from '../../../models/TextbookModel';
import CCUtil from '../../../util/CCUtil';
import { SmallMonsterModel } from '../../common/SmallMonsterModel';
import { MonsterModel } from '../common/MonsterModel';
const { ccclass, property } = _decorator;

/**学习模式公共部分 */
@ccclass('BaseModeView')
export class BaseModeView extends Component {
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
    @property(Prefab)
    public monsterModel: Prefab = null;//怪物动画

    protected _pet: Node = null; //精灵
    protected _role: Node = null; //人物
    protected _smallMonsters: Node[] = []; //小怪物

    protected _wordsData: UnitWordModel[] = null;
    protected _wordIndex: number = 0; //当前单词序号
    protected _detailData: any = null; //当前单词详情数据
    protected _levelData: AdvLevelConfig | BookLevelConfig = null; //当前关卡配置
    protected _monster: Node = null; //主怪动画节点
    protected _errorNum: number = 0; //错误数量
    protected _rightNum: number = 0; //正确数量
    start() {
        this.initRole(); //初始化角色
        this.initPet(); //初始化精灵
    }
    onLoad(): void {

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

        }
    }

    //怪物逃跑
    monsterEscape() {
        return new Promise((resolve, reject) => {
            let pos = this.monster.position;
            let scale = this.monster.getScale();
            this.monster.scale = new Vec3(-scale.x, scale.y, 1);
            tween(this.monster).to(1, { position: new Vec3(pos.x + 1000, pos.y, pos.z) }).call(() => {
                resolve(true);
            }).start();
        });
    }

    //精灵攻击
    attackMonster() {
        return new Promise((resolve, reject) => {
            this._pet.getComponent(PetModel).hit().then(() => {
                //大冒险关卡
                if (this._levelData.hasOwnProperty('islandId')) {
                    if (this._rightNum == this._wordsData.length) { //最后一个单词攻击主怪
                        this._monster.getComponent(MonsterModel).injury().then(() => {
                            resolve(true);
                        });
                    } else { //小怪受到攻击
                        this._smallMonsters[this._rightNum - 1].getComponent(SmallMonsterModel).hit();
                        resolve(true);
                    }
                } else {
                    resolve(true);
                }
            });
        });
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.btn_close.node, this.closeView, this);
    }
    protected removeEvent(): void {
        CCUtil.offTouch(this.btn_close.node, this.closeView, this);
    }

    protected closeView() {

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


}

