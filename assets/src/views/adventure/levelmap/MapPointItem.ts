import { _decorator, instantiate, Node, Prefab, Sprite } from 'cc';
import { EventType } from '../../../config/EventType';
import { PrefabType } from '../../../config/PrefabType';
import { DataMgr } from '../../../manager/DataMgr';
import { LoadManager } from '../../../manager/LoadManager';
import { ResLoader } from '../../../manager/ResLoader';
import { BossLevelData, GateData } from '../../../models/AdventureModel';
import { RoleBaseModel } from '../../../models/RoleBaseModel';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';
import { MonsterModel } from '../common/MonsterModel';
import { BaseMapPointItem } from './BaseMapPointItem';

const { ccclass, property } = _decorator;

@ccclass('MapPointItem')
export class MapPointItem extends BaseMapPointItem {
    @property(Node)
    public player: Node = null;

    @property(Node)
    public pet: Node = null;

    @property(Node)
    public monster: Node = null;

    @property(Node)
    public boss: Node = null;

    

    protected initEvent() {
        super.initEvent();
        CCUtil.onBtnClick(this.boss, this.onBossClick.bind(this),true);
    }

    private onBossClick() {
        const levelData: BossLevelData = DataMgr.getIslandBossConfig(this.data.big_id);
        EventMgr.emit(EventType.MapPoint_Boss_Click, levelData);
    }

    initUnitData(data: GateData) {
        this.clearAni();
        this.data = data;
        this.levelLabel.string = `${data.big_id}-${data.small_id}`;
        const bgSp = this.bgNode.getComponent(Sprite);
        const framePath = `adventure/forest/img_mappoint_${data.big_id}/spriteFrame`;
        LoadManager.loadSprite(framePath, bgSp);

        if (!data.can_play) {
            bgSp.grayscale = true;
            this.clearPointStars();
            return;
        }
        bgSp.grayscale = false;
        this.initStars(data.flag_info);
    }
    showPlayerAndPet(){
        this.initRole();
        this.initPet();
        this.initMonter();
    }
    async initRole() {
        const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.RoleModel.path}`, Prefab);
        const node = instantiate(prefab);
        this.player.addChild(node);
        const roleModel = node.getComponent(RoleBaseModel);
        roleModel.initSelf();
        roleModel.show(true);
    }

    async initPet() {
        const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.PetModel.path}`, Prefab);
        const node = instantiate(prefab);
        this.pet.addChild(node);
        const roleModel = node.getComponent(RoleBaseModel);
        roleModel.initSelf();
        roleModel.show(true);
    }

    async initMonter() {
        const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.MonsterModel.path}`, Prefab);
        const node = instantiate(prefab);
        this.monster.addChild(node);
        const monsterData = DataMgr.getMonsterData(this.data.monster_id);
        const monsterModel = node.getComponent(MonsterModel);
        monsterModel.init(`spine/monster/adventure/${monsterData.monsterAni}`);
    }

    async initBoss() {
        this.monster.active = false;
        const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.MonsterModel.path}`, Prefab);
        const node = instantiate(prefab);
        this.boss.addChild(node);
        const monsterModel = node.getComponent(MonsterModel);
        const islandData = DataMgr.getIslandData(this.data.big_id);
        monsterModel.init(`spine/monster/adventure/${islandData.bossAni}`);
    }

    clearAni() {
        this.player.removeAllChildren();
        this.pet.removeAllChildren();
        this.monster.removeAllChildren();
        this.boss.removeAllChildren();
    }
}
