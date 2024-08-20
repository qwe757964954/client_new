import { _decorator, Button, instantiate, Node, Prefab, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { KeyConfig } from '../../config/KeyConfig';
import { PrefabType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { DataMgr } from '../../manager/DataMgr';
import { PopMgr } from '../../manager/PopupManager';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { GameMode, GateData, IslandProgressModel, LandStatusResponse, LevelProgressData, LevelRestartData } from '../../models/AdventureModel';
import { UnitWordModel } from '../../models/TextbookModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ObjectUtil } from '../../util/ObjectUtil';
import StorageUtil from '../../util/StorageUtil';
import { GameStudyViewMap } from '../Challenge/ChallengeUtil';
import { ConfirmView } from '../common/ConfirmView';
import { WorldIsland } from './WorldIsland';
import { WorldMapItem } from './WorldMapItem';

const { ccclass, property } = _decorator;

@ccclass('WorldMapView')
export class WorldMapView extends BaseView {
    @property({ type: Prefab, tooltip: "岛屿" })
    public islandPref: Prefab = null;

    @property({ type: Button, tooltip: "返回按钮" })
    public btnBack: Button = null;

    @property({ type: Node, tooltip: "岛屿地图容器" })
    public islandContainer: Node = null;
    
    @property({ type: List, tooltip: "滚动容器" })
    public scrollView: List = null;

    @property(Node)
    public gradeSelectBtn: Node = null;

    private currentIsland: Node = null;
    private currentIslandID: number = 0;
    private currentLevelData: GateData = null;
    private levelProgressData: LevelProgressData = null;
    private gettingIslandStatus: boolean = false;
    private gettingWords: boolean = false;
    private currentPassIsland: LandStatusResponse = null;
    private _worldIsland:WorldIsland = null;
    protected initUI(): void {
        this.initData();
        this.offViewAdaptSize();
        this.islandContainer.position = v3(-GlobalConfig.WIN_SIZE.width / 2, 0, 0);
        WorldIsland.initMapPoints();
        if (StorageUtil.getData(KeyConfig.FIRST_WORLD_MAP, "1") === "1") {
            this.showFirstEnter();
        }
    }
    showFirstEnter(){
        this.gradeSelectEvent();
    }
    protected onInitModuleEvent() {
        this.addModelListeners([
            [EventType.Exit_World_Island, this.hideIsland.bind(this)],
            [EventType.Enter_Island_Level, this.enterLevel.bind(this)],
            [InterfacePath.Island_Status, this.onGetIslandStatus.bind(this)],
            [InterfacePath.Island_Progress, this.onGetIslandProgress.bind(this)],
            [InterfacePath.Adventure_LevelProgress, this.onGetLevelProgress.bind(this)],
            [EventType.Enter_Level_Test, this.enterTest.bind(this)],
            [EventType.Goto_Textbook_Next_Level, this.goNextLevel.bind(this)],
            [EventType.Goto_Exam_Mode, this.goExamMode.bind(this)],
            [InterfacePath.WordGame_LevelRestart, this.levelRestart.bind(this)],
        ]);
    }

    onLoadMapHorizontal(item: Node, idx: number): void {
        const itemScript = item.getComponent(WorldMapItem);
        itemScript.updateItemProps(idx, this.currentPassIsland);
    }

    onMapHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        let islandData = DataMgr.getIslandData(selectedId + 1);
        const isValid = ObjectUtil.isBigIdValid(islandData.big_id, this.currentPassIsland);
        if (!isValid) {
            ViewsMgr.showTip("请先通关前置岛屿");
            return;
        }
        // if (selectedId >= 1) {
        //     ViewsMgr.showTip("岛屿暂未开放");
        //     return;
        // }
        this.switchLevels(selectedId);
    }

    private async initData() {
        await DataMgr.instance.getAdventureLevelConfig();
        this.initEvent();
        ServiceMgr.studyService.getIslandStatus();
    }

    private switchLevels(id: number) {
        this.showIsland(id);
    }

    private showIsland(id: number) {
        if (this.gettingIslandStatus) {
            console.log('正在获取岛屿状态中', id);
            return;
        }
        this.currentIslandID = id + 1;
        this.gettingIslandStatus = true;
        ServiceMgr.studyService.getIslandProgress(this.currentIslandID);
    }

    private onGetIslandProgress(data: IslandProgressModel) {
        if (data.code !== 200) {
            console.error('获取岛屿进度失败', data.msg);
            return;
        }
        if (this.currentIsland) {
            this.currentIsland.destroy();
        }
        this.currentIsland = instantiate(this.islandPref);
        this._worldIsland = this.currentIsland.getComponent(WorldIsland);
        this.islandContainer.addChild(this.currentIsland);
        this._worldIsland.setPointsData(this.currentIslandID, data);
    }

    private onGetIslandStatus(data: LandStatusResponse) {
        this.gettingIslandStatus = false;
        if (data.code !== 200) {
            console.error('获取岛屿状态失败', data.msg);
            return;
        }
        this.currentPassIsland = data;
        this.scrollView.numItems = DataMgr.islandConfig.length;
    }

    private hideIsland() {
        if (this.currentIsland) {
            this.currentIsland.destroy();
        }
        this.gettingIslandStatus = false;
        this.levelProgressData = null;
        this.currentLevelData = null;
    }

    private enterLevel(data: GateData) {
        if (this.gettingWords) {
            console.log('正在获取单词中', data);
            return;
        }
        this.currentLevelData = data;
        this.gettingWords = true;
        ServiceMgr.studyService.getAdvLevelProgress(data.big_id, data.small_id, data.subject_id, 1);
    }

    private enterTest(data: GateData) {
        if (this.gettingWords) {
            console.log('正在获取单词中');
            return;
        }
        this.currentLevelData = data;
        this.currentLevelData.current_mode = GameMode.Exam;
        this.gettingWords = true;
        ServiceMgr.studyService.getAdvLevelProgress(this.currentLevelData.big_id, this.currentLevelData.small_id, this.currentLevelData.subject_id, 2);
    }

    private onGetLevelProgress(data: LevelProgressData) {
        if (data.code !== 200) {
            ViewsMgr.showTip(data.msg);
            return;
        }
        this.levelProgressData = data;
        this.currentLevelData.current_mode = data.game_mode;
        if (data.game_mode !== GameMode.Study || this.levelProgressData.pass_num !== 0) {
            ViewsMgr.showConfirm(
                "是否继续上次闯关进度?",
                () => this.onWordGameWords(data.word_list),
                () => ServiceMgr.studyService.wordGameLevelRestart(this.currentLevelData.big_id, this.currentLevelData.small_id),
                "延续上次",
                "重新开始",
                false
            ).then((confirmView: ConfirmView) => {
                confirmView.setCloseCall(() => {
                    this.gettingWords = false;
                });
            });
        } else {
            this.onWordGameWords(data.word_list);
        }
    }

    private levelRestart(data: LevelRestartData) {
        if (data.code === 200) {
            const category = this.currentLevelData.current_mode === GameMode.Exam ? 2 : 1;
            ServiceMgr.studyService.getAdvLevelProgress(this.currentLevelData.big_id, this.currentLevelData.small_id, this.currentLevelData.subject_id, category);
        } else {
            ViewsManager.showTip(data.msg);
            this.gettingWords = false;
        }
    }

    private goNextLevel() {
        if (!this.currentIsland) return;
        this.gettingIslandStatus = false;
        this.currentLevelData = null;
        const nextLevel = this._worldIsland.getNextLevelData(this.levelProgressData.big_id, this.levelProgressData.small_id);
        if (nextLevel) {
            this.enterLevel(nextLevel);
        }
    }

    private goExamMode() {
        if (this.currentLevelData) {
            this.enterTest(this.currentLevelData);
        }
    }

    private async onWordGameWords(data: UnitWordModel[]) {
        if (!this.gettingWords) return;
        if (this.currentIsland) {
            this._worldIsland.hideRightPanel();
        }
        this.gettingWords = false;
        const gameMode = this.currentLevelData.current_mode;
        this.currentLevelData.progressData = this.levelProgressData;
        this.currentLevelData.error_num = this.levelProgressData.err_num;
        await this.openLearningView(data, this.currentLevelData, gameMode);
    }

    private async openLearningView(wordData: UnitWordModel[], bookLevelData: GateData, gameMode: GameMode) {
        const prefabType = GameStudyViewMap[gameMode];
        if (prefabType) {
            const node = await ViewsManager.instance.showLearnView(prefabType);
            let scpt: any = node.getComponent(prefabType.componentName); 
            scpt.initData(wordData, bookLevelData);
        }
    }

    initEvent() {
        CCUtil.onBtnClick(this.btnBack.node, this.onBtnBackClick.bind(this));
        CCUtil.onBtnClick(this.gradeSelectBtn, this.gradeSelectEvent.bind(this));
    }

    private onBtnBackClick() {
        this.node.destroy();
    }

    private async gradeSelectEvent() {
        // TODO: Implement grade select event
        let node = await PopMgr.showPopup(PrefabType.GradeSelectView);
    }

    private openHelp() {
        console.log('帮助页面!');
    }


}
