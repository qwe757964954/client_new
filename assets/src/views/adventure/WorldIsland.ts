import { _decorator, Button, Component, director, instantiate, Node, Prefab, UITransform, Vec2, Vec3 } from 'cc';
import { EventType } from '../../config/EventType';
import { BossLevelData, BossLevelTopicData, IslandProgressModel, MapLevelData, MicroListItem } from '../../models/AdventureModel';
import CCUtil from '../../util/CCUtil';
import EventManager, { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { rightPanelchange } from './common/RightPanelchange';
import { IslandMap } from './levelmap/IslandMap';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { PrefabType, SceneType } from '../../config/PrefabType';
import { ServiceMgr } from '../../net/ServiceManager';
import { InterfacePath } from '../../net/InterfacePath';
import { DataMgr } from '../../manager/DataMgr';
import { WordBossView } from './sixModes/WordBossView';
import { MonsterModel } from './common/MonsterModel';
import { MapRewardBoxItem } from './levelmap/MapRewardBoxItem';
const { ccclass, property } = _decorator;

/**魔法森林 何存发 2024年4月9日17:51:36 */
@ccclass('WorldIsland')
export class WorldIsland extends Component {

    @property({ type: Node, tooltip: "返回按钮" })
    public back: Node = null;
    @property({ type: Button, tooltip: "世界地图" })
    public btn_details: Button = null;
    @property({ type: Button, tooltip: "我的位置" })
    public btn_pos: Button = null;
    @property({ type: rightPanelchange, tooltip: "关卡选择页面" })
    public levelPanel: rightPanelchange = null;

    @property({ type: List, tooltip: "地图List" })
    public mapPointList: List = null;

    @property({ type: Node, tooltip: "地图容器" })
    public mapContent: Node = null;

    @property({ type: Prefab, tooltip: "角色模型" })
    public roleModel: Prefab = null;
    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;
    @property({ type: Node, tooltip: "精灵容器" })
    public petContainer: Node = null;
    @property({ type: Prefab, tooltip: "精灵预制体" })
    public petModel: Prefab = null;
    @property({ type: Node, tooltip: "人物精灵动画容器" })
    public roleAniContainer: Node = null;
    @property({ type: Node, tooltip: "岛屿boss容器" })
    public bossContainer: Node = null;
    @property({ type: Node, tooltip: "关卡怪物容器" })
    public monsterContainer: Node = null;
    @property({ type: Prefab, tooltip: "怪物模型" })
    public monsterModel: Prefab = null;

    protected _pet: Node = null; //精灵
    protected _role: Node = null; //人物
    protected _monster: Node = null; //当前关卡怪物
    protected _boss: Node = null; //岛屿boss

    private _bigId: number = 1; //岛屿id
    private _mapBaseCounts: number[] = [12, 9, 8]; //地图点数量
    private _mapLevelsData: MicroListItem[][] = [];
    private static mapPoints: Map<number, number[][]> = null; //各岛屿地图点坐标

    private _mapPointClickEvId: string;
    private _mapPointUpdateEvId: string;

    private _passNum: number;
    private _progressData: IslandProgressModel = null;

    private _isRequest: boolean = false; //是否请求中
    private _currentPos: MicroListItem;

    @property(List)
    rewardBoxList: List = null;
    private _progressRewards: any[] = [1, 2, 3, 4];
    start() {
        this.initUI();
        this.initEvent();
    }

    setPointsData(bigId: number, progresssData: IslandProgressModel) {
        this._progressData = progresssData;
        this._bigId = bigId;
        this._passNum = progresssData.micro_pass_num;
        this.initBoss();
        let pointsData = progresssData.micro_list;
        //分割数组
        this._mapLevelsData = [];
        let baseCount = this._mapBaseCounts[bigId - 1]
        for (let i = 0; i < pointsData.length; i += baseCount) {
            this._mapLevelsData.push(pointsData.slice(i, i + baseCount));
        }
        this.mapPointList.numItems = this._mapLevelsData.length;
        let transform = this.mapContent.getComponent(UITransform);
        transform.width = 0;
        for (let i = 0; i < this._mapLevelsData.length; i++) {
            if (this._mapLevelsData[i].length < baseCount) {
                let pos = WorldIsland.getMapPointsByBigId(this._bigId)[this._mapLevelsData[i].length - 1];
                transform.width += pos[0] + 250;
            } else {
                transform.width += 2145;
            }
        }
        console.log('地图宽度', transform.width);

        if (this._currentPos) {
            this.skipToMapPoint(this._bigId, this._currentPos.small_id, this._currentPos.micro_id);
        }

    }

    mapPointClick(data: MapLevelData) {
        this.levelPanel.node.active = true;
        let nodesize = this.levelPanel.node.getComponent(UITransform).contentSize;
        this.levelPanel.node.setPosition(nodesize.width, 100);
        console.log('点击了地图点', data);
        this.levelPanel.openView(data);
    }

    onMapPointRender(item: Node, idx: number) {
        let posData = item.getComponent(IslandMap).setData(this._bigId, this._mapLevelsData[idx], this._passNum);
        if (posData) {
            console.log('地图点坐标', posData);
            let pos: Vec3 = posData.position;
            this.roleAniContainer.position = new Vec3(pos.x - 150, pos.y, 0);
            posData.map.setAniNode(this.roleAniContainer);

            let levelData = DataMgr.instance.getAdvLevelConfig(+posData.pointData.big_id, +posData.pointData.small_id);
            if (!this._monster) {
                this.initMonster();
            }
            let monsterModel = this._monster.getComponent(MonsterModel);
            monsterModel.init("spine/monster/adventure/" + levelData.monsterAni);
            this.monsterContainer.position = new Vec3(pos.x + 100, pos.y, 0);
            posData.map.setMonsterNode(this.monsterContainer);

            this._currentPos = posData.pointData;
        }
        //最后一个地图添加岛屿boss
        if (idx == this._mapLevelsData.length - 1) {
            item.getComponent(IslandMap).setBossNode(this.bossContainer);
            let monsterModel = this._boss.getComponent(MonsterModel);
            monsterModel.idle();
        }
    }

    skipToMapPoint(big_id: number, small_id: number, micro_id: number) {
        let skipPosX = 0;
        let points = WorldIsland.getMapPointsByBigId(big_id);
        for (let i = 0; i < this._mapLevelsData.length; i++) {
            for (let j = 0; j < this._mapLevelsData[i].length; j++) {
                if (this._mapLevelsData[i][j].big_id == big_id && this._mapLevelsData[i][j].small_id == small_id && this._mapLevelsData[i][j].micro_id == micro_id) {
                    skipPosX = i * 2145 + points[j][0] - 250;
                    this.mapPointList.scrollView.scrollToOffset(new Vec2(skipPosX, 0));
                    return;
                }
            }
        }
    }

    updatePointData(big_id: number, small_id: number, micro_id: number, star: number) {
        let mapoint = null;
        let microList = this._progressData.micro_list;
        let currentIdx = -1;
        for (let i = 0; i < microList.length; i++) {
            if (microList[i].big_id == big_id && microList[i].small_id == small_id && microList[i].micro_id == micro_id) {
                currentIdx = i;
                mapoint = microList[i];
                break;
            }
        }
        if (mapoint) {
            if (!mapoint.flag_info) {
                mapoint.flag_info = {}
            }
            if (star == 1) {
                mapoint.flag_info.star_one = 1;
            } else if (star == 2) {
                mapoint.flag_info.star_one = 1;
                mapoint.flag_info.star_two = 1;
            } else if (star == 3) {
                mapoint.flag_info.star_one = 1;
                mapoint.flag_info.star_two = 1;
                mapoint.flag_info.star_three = 1;
            }
            mapoint.flag = 1;
            if (currentIdx == this._passNum) { //是否是当前进度关卡
                this._passNum++;
                if (this._passNum < microList.length) {
                    microList[this._passNum].can_play = 1;
                }
            }
            this.mapPointList.numItems = this._mapLevelsData.length;
            let transform = this.mapContent.getComponent(UITransform);
            transform.width = 0;
            for (let i = 0; i < this._mapLevelsData.length; i++) {
                if (this._mapLevelsData[i].length < this._mapBaseCounts[this._bigId - 1]) {
                    let pos = WorldIsland.getMapPointsByBigId(this._bigId)[this._mapLevelsData[i].length - 1];
                    transform.width += pos[0] + 250;
                } else {
                    transform.width += 2145;
                }
            }
            console.log('地图宽度', transform.width);
        }
    }

    getNextLevelData(big_id: number, small_id: number, micro_id: number): MicroListItem {
        let currentIdx = -1;
        let microList = this._progressData.micro_list;
        let nextPoint: MicroListItem = null;
        //找到当前地图点
        for (let i = 0; i < microList.length; i++) {
            if (microList[i].big_id == big_id && microList[i].small_id == small_id && microList[i].micro_id == micro_id) {
                currentIdx = i;
                break;
            }
        }
        if (currentIdx == -1) return null;
        if (currentIdx == microList.length - 1) { //岛屿通关
            ViewsMgr.showTip("已通关第" + big_id + "岛屿");
            return null;
        } else {
            currentIdx++;
            nextPoint = microList[currentIdx];
        }
        return nextPoint;
    }

    onUpdatePoint(data: { big_id: number, small_id: number, micro_id: number, star: number }) {
        this.updatePointData(data.big_id, data.small_id, data.micro_id, data.star);
    }

    static initMapPoints() {
        if (this.mapPoints) return;
        this.mapPoints = new Map<number, number[][]>();
        this.mapPoints.set(1, [[198, 250], [377, 58], [310, -131], [450, -288], [684, -266], [878, -138], [1106, -47], [1347, -166], [1594, -238], [1718, -42], [1582, 145], [1983, 275]]);
        this.mapPoints.set(2, [[190, 55], [391, 197], [662, 209], [810, 11], [940, -179], [1155, -308], [1482, -318], [1713, -207], [1917, -42]]);
        this.mapPoints.set(3, [[198, 133], [338, -64], [534, -260], [1013, -105], [1275, 31], [1502, -45], [1772, 21], [1947, 119]]);
        this.mapPoints.set(4, [[190, 243], [309, 64], [430, -127], [622, -295], [874, -178], [1135, -62], [1382, -176], [1643, -191], [1811, -23], [1935, 150]]);
        this.mapPoints.set(5, [[221, 244], [389, 96], [302, -89], [443, -289], [715, -242], [960, -100], [1265, -61], [1572, -257], [1735, -8], [1593, 151], [1821, 287], [2121, 266]]);
        this.mapPoints.set(6, [[221, 244], [389, 96], [302, -89], [443, -289], [715, -242], [960, -100], [1265, -61], [1572, -257], [1735, -8], [1593, 151], [1821, 287], [2121, 266]]);
        this.mapPoints.set(7, [[221, 244], [389, 96], [302, -89], [443, -289], [715, -242], [960, -100], [1265, -61], [1572, -257], [1735, -8], [1593, 151], [1821, 287], [2121, 266]]);
    }

    static getMapPointsByBigId(bigId: number) {
        return this.mapPoints.get(bigId);
    }

    /**初始化UI */
    private initUI() {
        let nodesize = this.levelPanel.node.getComponent(UITransform).contentSize;
        this.levelPanel.node.setPosition(-nodesize.width, 100);
        this.levelPanel.hideView();

        this.initPet();
        this.initRole();
        this.rewardBoxList.numItems = this._progressRewards.length;
        // this.initMonster();
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

    initMonster() {
        this._monster = instantiate(this.monsterModel);
        this.monsterContainer.addChild(this._monster);
    }

    initBoss() {
        this._boss = instantiate(this.monsterModel);
        this.bossContainer.addChild(this._boss);
        let monsterModel = this._boss.getComponent(MonsterModel);
        let levelData: BossLevelData = DataMgr.getIslandBossConfig(this._bigId);
        monsterModel.init("spine/monster/adventure/" + levelData.bossAni);
    }

    challangeBoss() {
        console.log("challangeBoss");
        this.levelPanel.node.active = true;
        let nodesize = this.levelPanel.node.getComponent(UITransform).contentSize;
        this.levelPanel.node.setPosition(nodesize.width, 100);
        let levelData: BossLevelData = DataMgr.getIslandBossConfig(this._bigId);
        this.levelPanel.openBossView(levelData);
    }

    onGetBossLevelTopic(data: BossLevelTopicData) {
        this._isRequest = false;
        console.log("onGetBossLevelTopic", data);
        data.big_id = this._bigId;
        ViewsManager.instance.showView(PrefabType.WordBossView, (node: Node) => {
            node.getComponent(WordBossView).initData(data);
        });
    }

    enterBossLevel() {
        if (this._isRequest) return;
        this._isRequest = true;
        ServiceMgr.studyService.getBossLevelTopic(this._bigId);
    }

    hideRightPanel() {
        // this.levelPanel.node.active = false;
    }

    onMapRewardBoxRender(item: Node, index: number) {
        item.getComponent(MapRewardBoxItem).setData(this._progressRewards[index]);
    }

    /**初始化监听事件 */
    private initEvent() {
        CCUtil.onTouch(this.back, this.onBtnBackClick, this);
        CCUtil.onTouch(this.btn_details, this.onBtnDetailsClick, this);
        CCUtil.onTouch(this.btn_pos, this.skipToCurrent, this);
        CCUtil.onTouch(this._boss, this.challangeBoss, this);

        this._mapPointClickEvId = EventManager.on(EventType.MapPoint_Click, this.mapPointClick.bind(this));
        this._mapPointUpdateEvId = EventManager.on(EventType.Update_MapPoint, this.onUpdatePoint.bind(this));
        EventMgr.addListener(InterfacePath.BossLevel_Topic, this.onGetBossLevelTopic, this);
        EventMgr.addListener(EventType.Enter_Boss_Level, this.enterBossLevel, this);
    }
    /**移除监听 */
    private removeEvent() {
        CCUtil.offTouch(this.back, this.onBtnBackClick, this);
        CCUtil.offTouch(this.btn_details, this.onBtnDetailsClick, this);
        CCUtil.offTouch(this.btn_pos, this.skipToCurrent, this);
        CCUtil.offTouch(this._boss, this.challangeBoss, this);
        EventManager.off(EventType.MapPoint_Click, this._mapPointClickEvId);
        EventManager.off(EventType.Update_MapPoint, this._mapPointUpdateEvId);
        EventMgr.removeListener(InterfacePath.BossLevel_Topic, this);
        EventMgr.removeListener(EventType.Enter_Boss_Level, this);
    }

    onBtnDetailsClick() {
        EventManager.emit(EventType.Exit_World_Island);
    }

    /**跳转到当前位置 */
    skipToCurrent() {
        if (this._currentPos) {
            let transform = this.mapContent.getComponent(UITransform);
            let width = 0;
            for (let i = 0; i < this._mapLevelsData.length; i++) {
                if (this._mapLevelsData[i].length < this._mapBaseCounts[this._bigId - 1]) {
                    let pos = WorldIsland.getMapPointsByBigId(this._bigId)[this._mapLevelsData[i].length - 1];
                    width += pos[0] + 250;
                } else {
                    width += 2145;
                }
            }
            this.skipToMapPoint(this._bigId, this._currentPos.small_id, this._currentPos.micro_id);
            this.mapPointList.updateAll();
            transform.width = width;
        }
    }
    /**返回关卡模式 */
    private onBtnBackClick() {
        // EventManager.emit(EventType.Exit_World_Island);
        director.loadScene(SceneType.MainScene);
    }

    protected onDestroy(): void {
        this.removeEvent()
        console.log('销毁')
    }

}


