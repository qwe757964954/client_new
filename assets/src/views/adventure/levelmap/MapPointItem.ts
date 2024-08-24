import { _decorator, Component, instantiate, isValid, Label, Node, Prefab, Sprite } from 'cc';
import { EventType } from '../../../config/EventType';
import { PrefabType } from '../../../config/PrefabType';
import { DataMgr } from '../../../manager/DataMgr';
import { LoadManager } from '../../../manager/LoadManager';
import { ResLoader } from '../../../manager/ResLoader';
import { ViewsMgr } from '../../../manager/ViewsManager';
import { BossLevelData, GateData, MapLevelData, MicroListItem } from '../../../models/AdventureModel';
import { RoleBaseModel } from '../../../models/RoleBaseModel';
import CCUtil from '../../../util/CCUtil';
import EventManager from '../../../util/EventManager';
import { ObjectUtil } from '../../../util/ObjectUtil';
import { MonsterModel } from '../common/MonsterModel';
const { ccclass, property } = _decorator;

export enum StarType {
    star_one = "star_one",/**第一颗星星*/
    star_two = "star_two",/**第二颗星星*/
    star_three = "star_three",/**第三颗星星*/
}

@ccclass('MapPointItem')
export class MapPointItem extends Component {
    @property({ type: [Node], tooltip: "星星" })
    public stars: Node[] = [];
    @property({ type: Node, tooltip: "底盘" })
    public bgNode: Node = null;
    @property({ type: Label, tooltip: "关卡Label" })
    public levelLabel: Label = null;

    @property(Node)
    public player:Node = null;

    @property(Node)
    public pet:Node = null;

    @property(Node)
    public monster:Node = null;

    @property(Node)
    public boss:Node = null;

    public data: MapLevelData | MicroListItem = null;
    public gateData: GateData = null;

    public index: number = 0;



    start() {
        this.initEvent();
    }
    initEvent(){
        CCUtil.onBtnClick(this.bgNode,this.onItemClick.bind(this));
        CCUtil.onBtnClick(this.boss,this.onBossClick.bind(this));
    }
    private onBossClick(){
        let levelData: BossLevelData = DataMgr.getIslandBossConfig(this.gateData.big_id);
        EventManager.emit(EventType.MapPoint_Boss_Click, levelData);
    }
    private onItemClick() {
        const data = this.gateData;
        if (!data.can_play) {
            ViewsMgr.showTip("请先通过前置关卡");
            return;
        }
        EventManager.emit(EventType.MapPoint_Click, data);
    }
    //大冒险关卡点初始化
    initData(data: MicroListItem) {
        this.data = data;
        this.levelLabel.string = data.small_id + "-" + data.micro_id;
        let bgSp = this.bgNode.getComponent(Sprite);
        let framePath = `adventure/forest/img_mappoint_${data.big_id}/spriteFrame`;
        LoadManager.loadSprite(framePath, bgSp);
        if (!data.can_play) {
            for (let i = 0; i < this.stars.length; i++) {
                this.stars[i].active = false;
            }
            bgSp.grayscale = true;
            return;
        }
        bgSp.grayscale = false;
        this.clearPointStars();
        if (isValid(data.flag_info) && isValid(data.flag_info.star_one)) {
            let starnum = 0;
            if (isValid(data.flag_info.star_one)) {
                starnum++;
            }
            if (isValid(data.flag_info.star_two)) {
                starnum++;
            }
            if (isValid(data.flag_info.star_three)) {
                starnum++;
            }
            for (let i = 0; i < 3; i++) {
                this.stars[i].getComponent(Sprite).grayscale = i >= starnum;
            }
        }
    }

    initGateData(data: GateData) {
        this.gateData = data;
        this.levelLabel.string = data.big_id + "-" + data.small_id;
        let bgSp = this.bgNode.getComponent(Sprite);
        let framePath = `adventure/forest/img_mappoint_${data.big_id}/spriteFrame`;
        LoadManager.loadSprite(framePath, bgSp);
        if (!data.can_play) {
            for (let i = 0; i < this.stars.length; i++) {
                this.stars[i].active = false;
            }
            bgSp.grayscale = true;
            return;
        }
        bgSp.grayscale = false;
        this.clearPointStars();
        if (isValid(data.flag_info) && isValid(data.flag_info.star_one)) {
            let starnum = 0;
            if (isValid(data.flag_info.star_one)) {
                starnum++;
            }
            if (isValid(data.flag_info.star_two)) {
                starnum++;
            }
            if (isValid(data.flag_info.star_three)) {
                starnum++;
            }
            for (let i = 0; i < 3; i++) {
                this.stars[i].getComponent(Sprite).grayscale = i >= starnum;
            }
        }
    }

    clearPointStars() {
        for (let i = 0; i < this.stars.length; i++) {
            this.stars[i].getComponent(Sprite).grayscale = true;
        }
    }

    //教材单词关卡点初始化
    initSmallData(data: MapLevelData) {
        this.data = data;

        let big_id = ObjectUtil.extractId(data.big_id);
        this.levelLabel.string = big_id + "-" + data.small_id;
        this.clearPointStars();
        if (isValid(data.flag_info) && isValid(data.flag_info.star_one)) {
            if (isValid(data.flag_info.star_one)) {
                this.stars[0].getComponent(Sprite).grayscale = false;
            }
            if (isValid(data.flag_info.star_two)) {
                this.stars[1].getComponent(Sprite).grayscale = false;
            }
            if (isValid(data.flag_info.star_three)) {
                this.stars[2].getComponent(Sprite).grayscale = false;
            }
        }
    }

    showPlayerAndPet(){
        this.initRole();
        this.initPet();
        this.initMonter();
    }

    async initRole() {
        const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.RoleModel.path}`, Prefab);
        let node = instantiate(prefab);
        this.player.addChild(node);
        let roleModel = node.getComponent(RoleBaseModel);
        roleModel.initSelf();
        roleModel.show(true);
    }
    async initPet() {
        const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.PetModel.path}`, Prefab);
        let node = instantiate(prefab);
        this.pet.addChild(node);
        let roleModel = node.getComponent(RoleBaseModel);
        roleModel.initSelf();
        roleModel.show(true);
    }

    async initMonter(){
        const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.MonsterModel.path}`, Prefab);
        let node = instantiate(prefab);
        this.monster.addChild(node);
        let monsterData = DataMgr.getMonsterData(this.gateData.monster_id);
        let monsterModel = node.getComponent(MonsterModel);
        monsterModel.init("spine/monster/adventure/" + monsterData.monsterAni);
    }

    async initBoss(){
        this.monster.active = false;
        const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.MonsterModel.path}`, Prefab);
        let node = instantiate(prefab);
        this.boss.addChild(node);
        let monsterModel = node.getComponent(MonsterModel);
        console.log("initBoss.....",this.gateData);
        let islandData = DataMgr.getIslandData(this.gateData.big_id);
        monsterModel.init("spine/monster/adventure/" + islandData.bossAni);
    }

    clearAni(){
        this.player.removeAllChildren();
        this.pet.removeAllChildren();
        this.monster.removeAllChildren();
        this.boss.removeAllChildren();
    }
}


