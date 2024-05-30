import { _decorator, Button, Component, instantiate, Node, Prefab, ScrollView, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { DataMgr } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { GameMode, IslandProgressData, IslandProgressModel, IslandStatusData, MapLevelData } from '../../models/AdventureModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { StudyModeView } from './sixModes/StudyModeView';
import { WordMeaningView } from './sixModes/WordMeaningView';
import { WordPracticeView } from './sixModes/WordPracticeView';
import { WordSpellView } from './sixModes/WordSpellView';
import { WorldIsland } from './WorldIsland';
const { ccclass, property } = _decorator;
/**大冒险 世界地图 何存发 2024年4月8日14:45:44 */
@ccclass('WorldMapView')
export class WorldMapView extends Component {


    @property({ type: [Node], tooltip: "地图" })
    public mapView: Node[] = [];
    @property({ type: Prefab, tooltip: "岛屿" })
    public islandPref: Prefab = null;
    @property({ type: Button, tooltip: "返回按钮" })
    public btn_back: Button = null!;
    @property({ type: Node, tooltip: "岛屿地图容器" })
    public islandContainer: Node = null;
    @property({ type: ScrollView, tooltip: "滚动容器" })
    public scrollView: ScrollView = null;

    private _openlevels: number = 0;//开放到第几关

    private _currentIsland: Node = null;//当前岛屿

    private _islandStatusId: string; //岛屿状态
    private _islandProgressId: string; //岛屿进度
    private _exitIslandEveId: string; //退出岛屿
    private _enterLevelEveId: string; //进入关卡
    private _getWordsEveId: string; //获取单词

    private _currentIslandID: number = 0;//当前岛屿id
    private _currentLevelData: MapLevelData = null;//当前关卡数据
    private _currentIslandProgress: IslandProgressData = null;//当前岛屿进度

    private _getingIslandStatus: boolean = false;//是否正在获取岛屿状态
    private _getingWords: boolean = false;//是否正在获取单词
    start() {
        let winssize = GlobalConfig.WIN_SIZE;
        this.islandContainer.position = v3(-winssize.width / 2, 0, 0);
        WorldIsland.initMapPoints();
        this.scrollView.scrollToLeft();
    }

    onLoad(): void {
        this.initData()
    }
    /**初始化数据 */
    private async initData() {
        await DataMgr.instance.getAdventureLevelConfig();
        this.initEvent();
    }
    /**切换岛屿 */
    private switchLevels(i: number) {
        console.log('切换岛屿', i);
        this.showIsland(i);
    }

    showIsland(id: number) {
        if (this._getingIslandStatus) {
            console.log('正在获取岛屿状态中', id);
            return;
        }
        this._currentIslandID = +id + 1;
        this._getingIslandStatus = true;
        ServiceMgr.studyService.getIslandProgress(this._currentIslandID);
    }

    //获取岛屿进度
    onGetIslandProgress(data: IslandProgressModel) {
        if (data.code != 200) {
            console.error('获取岛屿进度失败', data.msg);
            return;
        }
        console.log('获取岛屿进度', data);
        let process = data[4].process; //暂时取朗读模式进度
        this._currentIslandProgress = new IslandProgressData();
        this._currentIslandProgress.small_id = process.small_id;
        this._currentIslandProgress.micro_id = process.micro_id;
        this._currentIslandProgress.game_mode = 0;
        ServiceMgr.studyService.getIslandStatus(this._currentIslandID);
    }

    //获取岛屿状态
    onGetIslandStatus(data: IslandStatusData) {
        this._getingIslandStatus = false;
        if (data.code != 200) {
            console.error('获取岛屿状态失败', data.msg);
            return;
        }
        let mapPoints: MapLevelData[] = [];
        let levelStatus = data.data;
        for (let i = 0; i < levelStatus.length; i++) {
            let status = levelStatus[i];
            let micros = status.micros;
            for (let j = 0; j < micros.length; j++) {
                let mapLevelData = new MapLevelData();
                mapLevelData.big_id = this._currentIslandID;
                mapLevelData.small_id = status.small_id;
                mapLevelData.flag = status.flag;
                mapLevelData.small_type = status.small_type;
                mapLevelData.game_modes = micros[j].game_modes;
                mapLevelData.micro_id = micros[j].micro_id;
                mapPoints.push(mapLevelData);
            }
        }

        if (this._currentIsland) {
            this._currentIsland.removeFromParent();
        }
        let copynode = instantiate(this.islandPref);
        this._currentIsland = copynode;
        this.islandContainer.addChild(copynode);
        copynode.getComponent(WorldIsland).setPointsData(this._currentIslandID, mapPoints, this._currentIslandProgress);
    }

    /**隐藏视图 */
    hideIsland() {
        if (this._currentIsland) {
            this._currentIsland.removeFromParent();
        }
    }

    //进入关卡
    private enterLevel(data: MapLevelData) {
        if (this._getingWords) {
            console.log('正在获取单词中', data);
            return;
        }
        console.log('进入关卡', data);
        this._currentLevelData = data;
        this._currentLevelData.current_mode = GameMode.Spelling;
        this._getingWords = true;
        ServiceMgr.studyService.getWordGameWords(data.big_id, data.small_id, data.micro_id, data.current_mode);
    }

    //获取关卡单词回包
    onWordGameWords(data: any) {
        if (!this._getingWords) return;
        console.log('获取单词', data);
        this._getingWords = false;
        let gameMode = this._currentLevelData.current_mode;
        let levelData = DataMgr.instance.getAdvLevelConfig(this._currentIslandID, this._currentLevelData.small_id);
        levelData.mapLevelData = this._currentLevelData;
        switch (gameMode) {
            case GameMode.Study:
                ViewsManager.instance.showView(PrefabType.StudyModeView, (node: Node) => {
                    node.getComponent(StudyModeView).initData(data, levelData);
                });
                break;
            case GameMode.WordMeaning:
                ViewsManager.instance.showView(PrefabType.WordMeaningView, (node: Node) => {
                    node.getComponent(WordMeaningView).initData(data, levelData);
                });
                break;
            case GameMode.Practice:
                ViewsManager.instance.showView(PrefabType.WordPracticeView, (node: Node) => {
                    node.getComponent(WordPracticeView).initData(data, levelData);
                });
                break;
            case GameMode.Spelling:
                ViewsManager.instance.showView(PrefabType.WordSpellView, (node: Node) => {
                    node.getComponent(WordSpellView).initData(data, levelData);
                });
                break;
            default:
                break;
        }
    }

    /**初始化监听事件 */
    initEvent() {
        for (let i in this.mapView) {
            CCUtil.onTouch(this.mapView[i], this.switchLevels.bind(this, i), this)
        }
        this._exitIslandEveId = EventManager.on(EventType.Exit_World_Island, this.hideIsland.bind(this));
        this._enterLevelEveId = EventManager.on(EventType.Enter_Island_Level, this.enterLevel.bind(this));
        this._getWordsEveId = EventManager.on(EventType.WordGame_Words, this.onWordGameWords.bind(this));
        this._islandStatusId = EventManager.on(InterfacePath.Island_Status, this.onGetIslandStatus.bind(this));
        this._islandProgressId = EventManager.on(InterfacePath.Island_Progress, this.onGetIslandProgress.bind(this));
        CCUtil.onTouch(this.btn_back.node, this.onBtnBackClick, this)

    }
    /**移除监听 */
    removeEvent() {
        for (let i in this.mapView) {
            CCUtil.offTouch(this.mapView[i], this.switchLevels.bind(this, i), this)
        }
        EventManager.off(EventType.Exit_World_Island, this._exitIslandEveId);
        EventManager.off(EventType.Enter_Island_Level, this._enterLevelEveId);
        EventManager.off(EventType.WordGame_Words, this._getWordsEveId);
        EventManager.off(InterfacePath.Island_Status, this._islandStatusId);
        EventManager.off(InterfacePath.Island_Progress, this._islandProgressId);
        CCUtil.offTouch(this.btn_back.node, this.onBtnBackClick, this)

    }
    /**点击返回按钮 */
    onBtnBackClick() {
        // EventManager.emit(EventType.Study_Page_Switching, [0])
        this.node.destroy();
    }

    /**打开帮助页面 */
    private openHelp() {
        console.log('帮助页面!')
    }

    update(deltaTime: number) {
    }
    onDestroy() {
        this.removeEvent()
    }




}


