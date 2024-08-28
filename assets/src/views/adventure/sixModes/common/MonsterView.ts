import { _decorator, instantiate, Node, Prefab, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { EventType } from '../../../../config/EventType';
import { GameBundle } from '../../../../GameRes';
import { BookLevelConfig, DataMgr } from '../../../../manager/DataMgr';
import { inf_SpineAniCreate } from '../../../../manager/InterfaceDefines';
import { ViewsManager } from '../../../../manager/ViewsManager';
import { GameMode, GateData } from '../../../../models/AdventureModel';
import { PetModel } from '../../../../models/PetModel';
import { UnitWordModel } from '../../../../models/TextbookModel';
import { BaseView } from '../../../../script/BaseView';
import CCUtil from '../../../../util/CCUtil';
import { EventMgr } from '../../../../util/EventManager';
import FileUtil from '../../../../util/FileUtil';
import ImgUtil from '../../../../util/ImgUtil';
import { SmallMonsterModel } from '../../../common/SmallMonsterModel';
import { TbConfig } from '../../../TextbookVocabulary/TextbookInfo';
import { MonsterModel } from '../../common/MonsterModel';
import { GameSourceType } from '../BaseModeView';

const { ccclass, property } = _decorator;

@ccclass('MonsterView')
export class MonsterView extends BaseView {
    @property({ type: Node, tooltip: "角色容器" }) roleContainer: Node = null;
    @property({ type: Node, tooltip: "精灵容器" }) petContainer: Node = null;
    @property({ type: Node, tooltip: "所有怪物容器" }) monsterContainer: Node = null;
    @property({ type: Prefab, tooltip: "小怪物预制体" }) smallMonsterModel: Prefab = null;
    @property({ type: Node, tooltip: "主怪物容器" }) monster: Node = null;
    @property(Prefab) monsterModel: Prefab = null;

    private _sourceType: GameSourceType = null;
    private _role: Node = null;
    private _pet: Node = null;
    private _petAttackView: Node = null;
    private _monster: Node = null;
    private _smallMonsters: Node[] = [];
    private _wordsData: UnitWordModel[] = null;
    private _levelData: any = null;
    private _rightNum: number = 0;
    private _errorWords: any = {};
    private _hpLevels = { 0: 0, 7: 1, 3: 2, 1: 3, 4: 4, 2: 0 };

    private gameMode: number = 0;

    protected initUI(): void {
        this.offViewAdaptSize();
    }

    updateSourceType(type: GameSourceType) {
        this._sourceType = type;
        this.initRole();
        this.initPet();
        this.initPetAttack();
    }

    private async initRole() {
        if ([GameSourceType.review, GameSourceType.reviewSpecial, GameSourceType.errorWordbook, GameSourceType.collectWordbook].includes(this._sourceType)) return;
        this._role = await ViewsManager.addRoleToNode(this.roleContainer);
    }

    private async initPet() {
        this._pet = await ViewsManager.addPetToNode(this.petContainer);
    }

    private initPetAttack() {
        this._petAttackView = ImgUtil.create_2DNode("petAttackView");
        this._petAttackView.setScale(-0.5, 0.5, 0.5);
        this.petContainer.addChild(this._petAttackView);
    }

    async initMonster(wordsData: UnitWordModel[], levelData: any, rightNum: number, errorWords: any,mode: GameMode) {
        this._wordsData = wordsData;
        this._levelData = levelData;
        this._rightNum = rightNum;
        this._errorWords = errorWords;
        this.gameMode = mode;
        if (this._sourceType === GameSourceType.word_game) {
            await this.initWordGameMonster();
        } else if (this._sourceType === GameSourceType.classification) {
            await this.initClassificationMonster();
        } else {
            await this.initReviewMonster();
        }
    }

    private async initWordGameMonster() {
        const lvData = this._levelData as GateData;
        this._monster = instantiate(this.monsterModel);
        this.monster.addChild(this._monster);
        const monsterModel = this._monster.getComponent(MonsterModel);
        const monsterData = DataMgr.getMonsterData(lvData.monster_id);
        await monsterModel.init("spine/monster/adventure/" + monsterData.monsterAni, true);

        const totalHp = this.gameMode === GameMode.Exam ? this._wordsData.length : this._wordsData.length * 5;
        monsterModel.setHp(this._wordsData.length * this._hpLevels[this.gameMode] + this._rightNum, totalHp);

        if (this.gameMode === GameMode.Exam) {
            this.monster.getComponent(UIOpacity).opacity = 125;
            return;
        }

        this.initSmallMonsters(lvData);
    }

    private async initClassificationMonster() {
        const levelData = this._levelData as BookLevelConfig;
        this._monster = instantiate(this.monsterModel);
        this.monster.addChild(this._monster);
        const sp = this._monster.getChildByName("sp");
        const scale = sp.getScale();
        sp.scale = new Vec3(-scale.x * 0.4, scale.y * 0.4, 1);

        const monsterModel = this._monster.getComponent(MonsterModel);
        await monsterModel.init(FileUtil.removeFileExtension(TbConfig.getMasterAniName(levelData.monster_id)), true);

        if (this.gameMode === GameMode.Exam) {
            this.monster.getComponent(UIOpacity).opacity = 125;
        }

        const pass = levelData.word_num - 1;
        const totalHp = this.gameMode === GameMode.Exam ? this._wordsData.length : this._wordsData.length * 5;
        monsterModel.setHp(this._wordsData.length * this._hpLevels[this.gameMode] + pass, totalHp);
    }

    private async initReviewMonster() {
        this._monster = instantiate(this.monsterModel);
        this.monster.addChild(this._monster);
        const scale = this._monster.getScale();
        this._monster.scale = new Vec3(-scale.x * 0.4, scale.y * 0.4, 1);

        const monsterModel = this._monster.getComponent(MonsterModel);
        await monsterModel.init(FileUtil.removeFileExtension(TbConfig.getMasterAniName(this._levelData.monster_id)), true);
        monsterModel.setHp(this._rightNum, this._levelData.wordCount);

        CCUtil.setNodeCamera2DUI(this._monster);
    }

    private async initSmallMonsters(lvData: GateData) {
        const errNum = Object.keys(this._errorWords).length;
        const len = Math.min(this._wordsData.length - errNum - 1, 4);

        for (let i = 0; i < len; i++) {
            const sPoint = this.monsterContainer.getChildByName("spoint" + (i + 1));
            const monster = instantiate(this.smallMonsterModel);
            sPoint.addChild(monster);
            const monsterModel = monster.getComponent(SmallMonsterModel);
            const monsterData = DataMgr.getMonsterData(lvData.monster_id);

            await monsterModel.init("spine/monster/adventure/" + monsterData.miniMonsterAni);
            if (i < this._rightNum) {
                monsterModel.die();
            }
            this._smallMonsters.push(monster);
        }
    }

    monsterAttack() {
        return new Promise((resolve) => {
            if (!this._monster) {
                resolve(true);
                return;
            }

            const target = this._pet;
            const monsterPos = new Vec3(this._monster.position);
            const targetTransform = target.parent.getComponent(UITransform);
            const transform = this.monster.getComponent(UITransform);
            const targetPos = transform.convertToNodeSpaceAR(targetTransform.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
            const startPosX = targetPos.x + 100;

            tween(this._monster)
                .to(0.5, { position: new Vec3(startPosX, targetPos.y, targetPos.z) })
                .call(async () => {
                    await this._monster.getComponent(MonsterModel).hit();
                    tween(this._monster).to(0.5, { position: monsterPos }).start();
                    await this._pet.getComponent(PetModel).inHit();
                    resolve(true);
                })
                .start();

            this.showMonsterEffect();
        });
    }

    private showMonsterEffect(callback?: () => void) {
        if (this._sourceType === GameSourceType.word_game) {
            callback?.();
            return;
        }

        const levelData = this._levelData as BookLevelConfig;
        const resConf = { bundle: GameBundle.NORMAL, path: TbConfig.getMasterEffectName(levelData.monster_id) };
        const spinePrams: inf_SpineAniCreate = {
            resConf,
            aniName: "attack",
            trackIndex: 0,
            parentNode: this._petAttackView,
            isLoop: false,
            callEndFunc: () => {
                callback?.();
                this._petAttackView.removeAllChildren();
            }
        };

        EventMgr.dispatch(EventType.Sys_Ani_Play, spinePrams);
    }

    attackMonster(rightNum: number, mode: GameMode) {
        this._rightNum = rightNum;
        this.gameMode = mode;

        return new Promise(async (resolve) => {
            let targetMonster: Node;
            if (this._sourceType === GameSourceType.word_game) {
                targetMonster = this._rightNum === this._wordsData.length ? this._monster : this._smallMonsters[this._rightNum - 1] || this._monster;
            } else {
                targetMonster = this._monster;
            }

            await this.petAttackShow(targetMonster);

            const monsterModel = this._monster.getComponent(MonsterModel);
            const totalHp = this.gameMode === GameMode.Exam ? this._wordsData.length : this._wordsData.length * 5;

            if (this._sourceType === GameSourceType.word_game) {
                if (this._rightNum === this._wordsData.length) {
                    await monsterModel.injury();
                } else {
                    if (this._smallMonsters[this._rightNum - 1]) {
                        this._smallMonsters[this._rightNum - 1].getComponent(SmallMonsterModel).hit();
                    } else {
                        await monsterModel.injury();
                    }
                }
                monsterModel.setHp(this._wordsData.length * this._hpLevels[this.gameMode] + this._rightNum, totalHp);
            } else if (this._sourceType === GameSourceType.classification) {
                const pass = this._rightNum;
                monsterModel.setHp(this._wordsData.length * this._hpLevels[this.gameMode] + pass, totalHp);
                await monsterModel.inHit();
            } else if ([GameSourceType.review, GameSourceType.reviewSpecial, GameSourceType.errorWordbook, GameSourceType.collectWordbook].includes(this._sourceType)) {
                monsterModel.setHp(this._rightNum, this._levelData.wordCount);
                await monsterModel.inHit();
            }

            resolve(true);
        });
    }

    private petAttackShow(target: Node) {
        return new Promise<void>(async (resolve) => {
            const petPos = new Vec3(this._pet.position);
            const targetTransform = target.parent.getComponent(UITransform);
            const petTransform = this.petContainer.getComponent(UITransform);
            const targetPos = petTransform.convertToNodeSpaceAR(targetTransform.convertToWorldSpaceAR(new Vec3(0, 0, 0)));
            const startPosX = Math.max(targetPos.x - 600, petPos.x);

            tween(this._pet)
                .to(0.5, { position: new Vec3(startPosX, targetPos.y, targetPos.z) })
                .call(async () => {
                    await this._pet.getComponent(PetModel).hit();
                    tween(this._pet).to(0.5, { position: petPos }).start();
                    resolve();
                })
                .start();
        });
    }

    monsterEscape(callback?: () => void) {
        const pos = this.monster.position;
        const scale = this.monster.getScale();
        this.monster.scale = new Vec3(-scale.x, scale.y, 1);

        tween(this.monster)
            .to(1, { position: new Vec3(pos.x + 1000, pos.y, pos.z) })
            .call(() => {
                callback?.();
            })
            .start();
    }
    monsterDie(){
        return this._monster.getComponent(MonsterModel).die();
    }
}
