import { _decorator, Button, Node, Prefab, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { KeyConfig } from '../../config/KeyConfig';
import { PrefabType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { DataMgr, IslandData } from '../../manager/DataMgr';
import { PopMgr } from '../../manager/PopupManager';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { GameMode, GateData, LandStatusResponse, LevelProgressData, LevelRestartData } from '../../models/AdventureModel';
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
import { EvaluationModel, phaseTips } from './AdventureInfo';
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
    private currentLevelData: GateData = null;
    private levelProgressData: LevelProgressData = null;
    private gettingWords: boolean = false;
    private currentPassIsland: LandStatusResponse = null;
    private _worldIsland:WorldIsland = null;

    private _mapLandDatas:(IslandData | EvaluationModel)[] = [];

    protected initUI(): void {
        this._mapLandDatas = this.insertEmptyObjects(DataMgr.islandConfig);
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
            [EventType.Enter_Island_Level, this.enterLevel.bind(this)],
            [InterfacePath.Island_Status, this.onGetIslandStatus.bind(this)],
            [InterfacePath.Adventure_LevelProgress, this.onGetLevelProgress.bind(this)],
            [EventType.Enter_Level_Test, this.enterTest.bind(this)],
            [EventType.Goto_Textbook_Next_Level, this.goNextLevel.bind(this)],
            [EventType.Goto_Exam_Mode, this.goExamMode.bind(this)],
            [InterfacePath.WordGame_LevelRestart, this.levelRestart.bind(this)],
        ]);
    }

    onLoadMapHorizontal(item: Node, idx: number): void {
        const itemScript = item.getComponent(WorldMapItem);
        let data = this._mapLandDatas[idx];
        itemScript.updateItemProps(data, this.currentPassIsland);
    }

    onMapHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        let data = this._mapLandDatas[selectedId];
        const isValidLandData = ObjectUtil.isIslandData(data);
        if(!isValidLandData){
            return;
        }
        const islandData = data as IslandData;
        const isValid = ObjectUtil.isBigIdValid(islandData.big_id, this.currentPassIsland);
        if (!isValid) {
            ViewsMgr.showTip("请先通关前置岛屿");
            return;
        }
        // if (selectedId >= 1) {
        //     ViewsMgr.showTip("岛屿暂未开放");
        //     return;
        // }
        this.showIsland(islandData);
    }

    private async initData() {
        await DataMgr.instance.getAdventureLevelConfig();
        ServiceMgr.studyService.getIslandStatus();
    }

    private async showIsland(data: IslandData) {
        let node = await ViewsMgr.showViewAsync(PrefabType.WorldIsland);
        node.getComponent(WorldIsland).updateLandId(data.big_id);
    }

    private onGetIslandStatus(data: LandStatusResponse) {
        if (data.code !== 200) {
            console.error('获取岛屿状态失败', data.msg);
            return;
        }
        this.currentPassIsland = data;
        this.scrollView.numItems = this._mapLandDatas.length;
    }

    insertEmptyObjects(data: IslandData[]): (IslandData | EvaluationModel)[] {
        const result: (IslandData | EvaluationModel)[] = [];
        let previousPhaseId: number | null = null;

        for (const item of data) {
            if (item.phase_id !== previousPhaseId && previousPhaseId !== null) {
                let evData:EvaluationModel = {
                    message:phaseTips[previousPhaseId]
                }
                result.push(evData);
            }
            result.push(item);
            previousPhaseId = item.phase_id;
        }

        return result;
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
        this.gettingWords = false;
        const gameMode = this.currentLevelData.current_mode;
        this.currentLevelData.progressData = this.levelProgressData;
        this.currentLevelData.error_num = this.levelProgressData.err_num;
        await this.openLearningView(data, this.currentLevelData, gameMode);
    }

    private async openLearningView(wordData: UnitWordModel[], bookLevelData: GateData, gameMode: GameMode) {
        const prefabType = GameStudyViewMap[gameMode];
        if (prefabType) {
            const node = await ViewsMgr.showLearnView(prefabType);
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
