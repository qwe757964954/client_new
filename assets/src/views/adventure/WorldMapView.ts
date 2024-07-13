import { _decorator, Button, Component, instantiate, Node, Prefab, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { AdvLevelConfig, DataMgr } from '../../manager/DataMgr';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { GameMode, GateData, IslandProgressModel, IslandStatusData, LevelProgressData, LevelRestartData, MapLevelData } from '../../models/AdventureModel';
import { UnitWordModel } from '../../models/TextbookModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import CCUtil from '../../util/CCUtil';
import EventManager, { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { StudyModeView } from './sixModes/StudyModeView';
import { WordExamView } from './sixModes/WordExamView';
import { WordMeaningView } from './sixModes/WordMeaningView';
import { WordPracticeView } from './sixModes/WordPracticeView';
import { WordReadingView } from './sixModes/WordReadingView';
import { WordSpellView } from './sixModes/WordSpellView';
import { WorldIsland } from './WorldIsland';
import { WorldMapItem } from './WorldMapItem';
const { ccclass, property } = _decorator;
/**大冒险 世界地图 何存发 2024年4月8日14:45:44 */
@ccclass('WorldMapView')
export class WorldMapView extends Component {
    @property({ type: Prefab, tooltip: "岛屿" })
    public islandPref: Prefab = null;
    @property({ type: Button, tooltip: "返回按钮" })
    public btn_back: Button = null!;
    @property({ type: Node, tooltip: "岛屿地图容器" })
    public islandContainer: Node = null;
    @property({ type: List, tooltip: "滚动容器" })
    public scrollView: List = null;

    private _openlevels: number = 0;//开放到第几关

    private _currentIsland: Node = null;//当前岛屿

    private _islandStatusId: string; //岛屿状态
    private _islandProgressId: string; //岛屿进度
    private _exitIslandEveId: string; //退出岛屿
    private _enterLevelEveId: string; //进入关卡
    private _getWordsEveId: string; //获取单词
    private _getLevelProgressEveId: string; //获取关卡进度
    private _enterTestEveId: string; //进入测试

    private _currentIslandID: number = 0;//当前岛屿id
    private _currentLevelData: GateData = null;//当前关卡数据
    private _levelProgressData: LevelProgressData = null; //当前关卡进度

    private _getingIslandStatus: boolean = false;//是否正在获取岛屿状态
    private _getingWords: boolean = false;//是否正在获取单词

    private _currentPassIsland: number = 0;//当前所在岛屿id

    start() {
        let winssize = GlobalConfig.WIN_SIZE;
        this.islandContainer.position = v3(-winssize.width / 2, 0, 0);
        WorldIsland.initMapPoints();
    }

    onLoad(): void {
        this.initData()
    }

    onLoadMapHorizontal(item: Node, idx: number): void {
        let item_script: WorldMapItem = item.getComponent(WorldMapItem);
        item_script.updateItemProps(idx, this._currentPassIsland);
    }

    onMapHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        console.log("onMapHorizontalSelected", selectedId);
        if (selectedId > this._currentPassIsland - 1) {
            ViewsMgr.showTip("请先通关前置岛屿");
            return;
        }
        if (selectedId > 1) {
            ViewsMgr.showTip("岛屿暂未开放");
            return;
        }
        this.switchLevels(selectedId);
    }

    /**初始化数据 */
    private async initData() {
        await DataMgr.instance.getAdventureLevelConfig();
        this.initEvent();
        ServiceMgr.studyService.getIslandStatus();
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

        if (this._currentIsland) {
            this._currentIsland.destroy();
        }
        let copynode = instantiate(this.islandPref);
        this._currentIsland = copynode;
        this.islandContainer.addChild(copynode);
        copynode.getComponent(WorldIsland).setPointsData(this._currentIslandID, data);
    }

    //获取岛屿状态
    onGetIslandStatus(data: IslandStatusData) {
        console.log('onGetIslandStatus', data);
        this._getingIslandStatus = false;
        if (data.code != 200) {
            console.error('获取岛屿状态失败', data.msg);
            return;
        }
        this._currentPassIsland = data.num;
        this.scrollView.numItems = 7;
    }

    /**隐藏视图 */
    hideIsland() {
        if (this._currentIsland) {
            this._currentIsland.destroy();
        }
        this._getingIslandStatus = false;
        this._levelProgressData = null;
        this._currentLevelData = null;
    }

    //进入关卡
    private enterLevel(data: GateData) {
        if (this._getingWords) {
            console.log('正在获取单词中', data);
            return;
        }
        console.log('进入关卡', data);
        this._currentLevelData = data;
        this._getingWords = true;
        ServiceMgr.studyService.getAdvLevelProgress(data.big_id, data.small_id, data.subject_id, 1);
    }

    //进入关卡测试
    enterTest(data: GateData) {
        // ViewsMgr.showTip("测评模式暂未开放");
        // return;
        if (this._getingWords) {
            console.log('正在获取单词中');
            return;
        }
        if (!this._currentLevelData) {
            this._currentLevelData = data;
        }
        this._currentLevelData.current_mode = GameMode.Exam;
        this._getingWords = true;
        // if (this._levelProgressData) { //已有当前关数据
        //     this._levelProgressData.game_mode = GameMode.Exam;
        //     ServiceMgr.studyService.getWordGameWords(this._currentLevelData.big_id, this._currentLevelData.small_id, this._currentLevelData.micro_id);
        // } else {
        ServiceMgr.studyService.getAdvLevelProgress(this._currentLevelData.big_id, this._currentLevelData.small_id, this._currentLevelData.subject_id, 2);
        // }
    }

    onGetLevelProgress(data: LevelProgressData) {
        if (data.code != 200) {
            ViewsMgr.showTip(data.msg);
            return;
        }
        this._levelProgressData = data;
        if (this._currentLevelData.current_mode != GameMode.Exam) { //不是测试模式
            this._currentLevelData.current_mode = this._levelProgressData.game_mode;
        }
        if (this._levelProgressData.pass_num != 0) {
            ViewsMgr.showConfirm("是否继续上次闯关进度?", () => {
                ServiceMgr.studyService.getWordGameWords(this._currentLevelData.big_id, this._currentLevelData.small_id);
            }, () => {
                // this._getingWords = false;
                ServiceMgr.studyService.wordGameLevelRestart(this._currentLevelData.big_id, this._currentLevelData.small_id);
            }, "延续上次", "重新开始", false);
        } else {
            ServiceMgr.studyService.getWordGameWords(this._currentLevelData.big_id, this._currentLevelData.small_id);
        }
    }

    levelRestart(data: LevelRestartData) {
        console.log("LevelRestartData", data);
        if (data.code == 200) {
            let category = this._currentLevelData.current_mode == GameMode.Exam ? 2 : 1;
            ServiceMgr.studyService.getAdvLevelProgress(this._currentLevelData.big_id, this._currentLevelData.small_id, this._currentLevelData.subject_id, category);
        } else {
            ViewsManager.showTip(data.msg);
            this._getingWords = false;
        }
    }

    goNextLevel() {
        if (!this._currentIsland) return;
        this._getingIslandStatus = false;
        this._currentLevelData = null;
        let nextLevel = this._currentIsland.getComponent(WorldIsland).getNextLevelData(this._levelProgressData.big_id, this._levelProgressData.small_id);
        if (nextLevel) {
            this.enterLevel(nextLevel);
        }
    }

    //进入测试模式
    goExamMode() {
        if (this._currentLevelData) {
            this.enterTest(this._currentLevelData);
        }
    }

    //获取关卡单词回包
    onWordGameWords(data: UnitWordModel[]) {
        if (!this._getingWords) return;
        console.log('获取单词', data);
        if (this._currentIsland) {
            this._currentIsland.getComponent(WorldIsland).hideRightPanel();
        }
        this._getingWords = false;
        let gameMode = this._currentLevelData.current_mode;
        this._currentLevelData.progressData = this._levelProgressData;
        this._currentLevelData.error_num = this._levelProgressData.err_num;
        switch (gameMode) {
            case GameMode.Study:
                this.gotoTutoring(data, this._currentLevelData);
                break;
            case GameMode.WordMeaning:
                this.gotoMeaning(data, this._currentLevelData);
                break;
            case GameMode.Practice:
                this.gotoPractice(data, this._currentLevelData);
                break;
            case GameMode.Spelling:
                this.gotoSpell(data, this._currentLevelData);
                break;
            case GameMode.Reading:
                this.gotoReed(data, this._currentLevelData);
                break;
            case GameMode.Exam: //测试模式
                this.gotoAllSpelledOut(data, this._currentLevelData);
                break;
            default:
                break;
        }
    }
    async gotoSpell(data: UnitWordModel[], bookLevelData: GateData) {
        const node = await ViewsManager.instance.showLearnView(PrefabType.WordSpellView);
        node.getComponent(WordSpellView).initData(data, bookLevelData);
    }

    async gotoReed(data: UnitWordModel[], bookLevelData: GateData) {
        const node = await ViewsManager.instance.showLearnView(PrefabType.WordReadingView);
        node.getComponent(WordReadingView).initData(data, bookLevelData);
    }

    async gotoPractice(data: UnitWordModel[], bookLevelData: GateData) {
        const node = await ViewsManager.instance.showLearnView(PrefabType.WordPracticeView);
        node.getComponent(WordPracticeView).initData(data, bookLevelData);
    }

    async gotoMeaning(data: UnitWordModel[], bookLevelData: GateData) {
        const node = await ViewsManager.instance.showLearnView(PrefabType.WordMeaningView);
        node.getComponent(WordMeaningView).initData(data, bookLevelData);
    }

    async gotoAllSpelledOut(data: UnitWordModel[], bookLevelData: GateData) {
        const node = await ViewsManager.instance.showLearnView(PrefabType.WordExamView);
        node.getComponent(WordExamView).initData(data, bookLevelData);
    }

    async gotoTutoring(data: UnitWordModel[], bookLevelData: GateData) {
        const node = await ViewsManager.instance.showLearnView(PrefabType.StudyModeView);
        node.getComponent(StudyModeView).initData(data, bookLevelData);
    }


    /**初始化监听事件 */
    initEvent() {
        // for (let i in this.mapView) {
        //     CCUtil.onTouch(this.mapView[i], this.switchLevels.bind(this, i), this)
        // }
        this._exitIslandEveId = EventManager.on(EventType.Exit_World_Island, this.hideIsland.bind(this));
        this._enterLevelEveId = EventManager.on(EventType.Enter_Island_Level, this.enterLevel.bind(this));
        this._getWordsEveId = EventManager.on(EventType.WordGame_Words, this.onWordGameWords.bind(this));
        this._islandStatusId = EventManager.on(InterfacePath.Island_Status, this.onGetIslandStatus.bind(this));
        this._islandProgressId = EventManager.on(InterfacePath.Island_Progress, this.onGetIslandProgress.bind(this));
        this._getLevelProgressEveId = EventManager.on(InterfacePath.Adventure_LevelProgress, this.onGetLevelProgress.bind(this));
        // this._enterTestEveId = EventManager.on(EventType.Enter_Level_Test, this.enterTest.bind(this));
        EventMgr.addListener(EventType.Enter_Level_Test, this.enterTest, this);
        EventMgr.addListener(EventType.Goto_Textbook_Next_Level, this.goNextLevel, this);
        EventMgr.addListener(EventType.Goto_Exam_Mode, this.goExamMode, this);
        EventMgr.addListener(InterfacePath.WordGame_LevelRestart, this.levelRestart, this);
        CCUtil.onTouch(this.btn_back.node, this.onBtnBackClick, this)

    }
    /**移除监听 */
    removeEvent() {
        // for (let i in this.mapView) {
        //     CCUtil.offTouch(this.mapView[i], this.switchLevels.bind(this, i), this)
        // }
        EventManager.off(EventType.Exit_World_Island, this._exitIslandEveId);
        EventManager.off(EventType.Enter_Island_Level, this._enterLevelEveId);
        EventManager.off(EventType.WordGame_Words, this._getWordsEveId);
        EventManager.off(InterfacePath.Island_Status, this._islandStatusId);
        EventManager.off(InterfacePath.Island_Progress, this._islandProgressId);
        EventManager.off(InterfacePath.Adventure_LevelProgress, this._getLevelProgressEveId);
        // EventManager.off(EventType.Enter_Level_Test, this._enterTestEveId)
        EventMgr.removeListener(EventType.Enter_Level_Test, this);
        EventMgr.removeListener(EventType.Goto_Textbook_Next_Level, this);
        EventMgr.removeListener(EventType.Goto_Exam_Mode, this);
        EventMgr.removeListener(InterfacePath.WordGame_LevelRestart, this);
        CCUtil.offTouch(this.btn_back.node, this.onBtnBackClick, this)

    }
    /**点击返回按钮 */
    onBtnBackClick() {
        // EventManager.emit(EventType.Study_Page_Switching, [0])
        ResLoader.instance.releaseDir("adventure");
        ResLoader.instance.releaseDir("prefab/studyModes");
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


