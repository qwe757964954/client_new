import { _decorator, isValid, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType, SceneType } from '../../config/PrefabType';
import { PopMgr } from '../../manager/PopupManager';
import { SceneMgr } from '../../manager/SceneMgr';
import { ViewsManager, ViewsMgr } from '../../manager/ViewsManager';
import { BossLevelData, BossLevelTopicData, GateData, GradeSkipExercisesListReply, IslandProgressModel, MapLevelData, Subject, UnitData, UnitListData, WordGameSubjectReply, WordGameUnitWordReply } from '../../models/AdventureModel';
import { BaseRepPacket } from '../../models/NetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ScrollWordMapView } from '../Challenge/scrollMap/ScrollWordMapView';
import { GradeSkipSubjectMgr } from '../theme/GradeSkipSubjectManager';
import { SubjectView } from '../theme/SubjectView';
import { UnitExerciseView } from '../theme/UnitExerciseView';
import { rightPanelchange } from './common/RightPanelchange';
import { UnitItem } from './common/UnitItem';
import { LandTaskView } from './levelmap/LandTaskView';
import { WordBossView } from './sixModes/WordBossView';
const { ccclass, property } = _decorator;

/**魔法森林 何存发 2024年4月9日17:51:36 */
@ccclass('WorldIsland')
export class WorldIsland extends BaseView {

    @property({ type: Node, tooltip: "返回按钮" })
    public back: Node = null;
    @property({ type: Node, tooltip: "世界地图" })
    public btn_details: Node = null;
    @property({ type: Node, tooltip: "我的位置" })
    public btn_pos: Node = null;
    @property(List)
    public unitList: List = null;
    @property(ScrollWordMapView) scrollMap: ScrollWordMapView = null;
    @property(LandTaskView) landTask: LandTaskView = null;
    private _unitDatas: UnitData[] = [];
    private static mapPoints: Map<number, number[][]> = null; //各岛屿地图点坐标
    private _progressData: IslandProgressModel = null;
    private _isRequest: boolean = false; //是否请求中
    private _isGetUnitWords: boolean = false; //是否正在获取单元单词
    private currentIslandID: number = 0;
    private _rightChallenge: rightPanelchange = null;
    private _selectUnit: UnitData = null;
    protected initUI(): void {

    }

    protected onInitModuleEvent() {
        this.addModelListeners([
            [EventType.MapPoint_Click, this.mapPointClick.bind(this)],
            [EventType.MapPoint_Boss_Click, this.challangeBoss.bind(this)],
            [InterfacePath.BossLevel_Topic, this.onGetBossLevelTopic.bind(this)],
            [EventType.Enter_Boss_Level, this.enterBossLevel.bind(this)],
            [InterfacePath.WordGame_UnitList, this.onGetUnits.bind(this)],
            [InterfacePath.WordGame_UnitWords, this.onGetUnitWords.bind(this)],
            [EventType.GradeSkip_Challenge, this.onGradeSkipChallenge.bind(this)],
            [InterfacePath.GradeSkip_ExercisesList, this.onGradeSkipExercises.bind(this)],
            [InterfacePath.WordBossGame_Restart, this.onBossGameRestart.bind(this)],
            [InterfacePath.Island_Progress, this.onGetIslandProgress.bind(this)],
            [EventType.Exit_Island_Level, this.onExitIsland.bind(this)],
        ]);
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.back, this.onBtnBackClick.bind(this));
        CCUtil.onBtnClick(this.btn_details, this.onBtnDetailsClick.bind(this));
        CCUtil.onBtnClick(this.btn_pos, this.skipToCurrent.bind(this));
    }

    updateLandId(landId: number){
        this.currentIslandID = landId;
        ServiceMgr.studyService.getIslandProgress(landId);
    }

    setPointsData(progresssData: IslandProgressModel) {
        this._progressData = progresssData;
        this.scrollMap.initMap(progresssData);
        this.landTask.updateProps(progresssData);
        ServiceMgr.studyService.getWordGameUnits(this.currentIslandID);
    }

    async mapPointClick(data: MapLevelData) {
        let node = await PopMgr.showPopRight(PrefabType.RightPanelchange,"stage_frame");
        this._rightChallenge = node.getComponent(rightPanelchange);
        this._rightChallenge.openView(data);
    }

    getNextLevelData(big_id: number, small_id: number): GateData {
        let currentIdx = -1;
        let gateList = this._progressData.gate_list;
        let nextPoint: GateData = null;
        //找到当前地图点
        for (let i = 0; i < gateList.length; i++) {
            if (gateList[i].big_id == big_id && gateList[i].small_id == small_id) {
                currentIdx = i;
                break;
            }
        }
        if (currentIdx == -1) return null;
        if (currentIdx == gateList.length - 1) { //岛屿通关
            ViewsMgr.showTip("已通关第" + big_id + "岛屿");
            return null;
        } else {
            currentIdx++;
            nextPoint = gateList[currentIdx];
        }
        return nextPoint;
    }

    onUpdatePoint(data: { big_id: number, small_id: number, star: number }) {
        // this.updatePointData(data.big_id, data.small_id, data.star);
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

    async challangeBoss(levelData: BossLevelData) {
        console.log("challangeBoss");
        let node = await PopMgr.showPopRight(PrefabType.RightPanelchange,"stage_frame");
        this._rightChallenge = node.getComponent(rightPanelchange);
        this._rightChallenge.openBossView(levelData);
    }

    private onGetIslandProgress(data: IslandProgressModel) {
        if (data.code !== 200) {
            console.error('获取岛屿进度失败', data.msg);
            return;
        }
        console.log("onGetIslandProgress.......",data);
        this.setPointsData(data);
    }
    onExitIsland(){
        this._rightChallenge.hideView();
        ServiceMgr.studyService.getIslandProgress(this.currentIslandID);
    }
    onGetBossLevelTopic(data: BossLevelTopicData) {
        this._isRequest = false;
        console.log("onGetBossLevelTopic", data);
        data.big_id = this.currentIslandID;
        if (data.challenge_info.word_num > 0) {
            ViewsMgr.showConfirm("是否继续上次闯关进度?", () => {
                ViewsMgr.showView(PrefabType.WordBossView, (node: Node) => {
                    node.getComponent(WordBossView).initData(data);
                });
            }, () => {
                ServiceMgr.studyService.bossLevelRestart(this.currentIslandID, data.challenge_info.bl_id);
            }, "延续上次", "重新开始", false);
        } else {
            ViewsMgr.showView(PrefabType.WordBossView, (node: Node) => {
                node.getComponent(WordBossView).initData(data);
            });
        }
    }

    onBossGameRestart(data: BaseRepPacket) {
        this._isRequest = false;
        if (data.code != 200) {
            ViewsManager.showTip(data.msg);
            return;
        }
        this.enterBossLevel();
    }

    enterBossLevel() {
        if (this._isRequest) return;
        this._isRequest = true;
        ServiceMgr.studyService.getBossLevelTopic(this.currentIslandID);
    }

    onGetUnits(data: UnitListData) {
        console.log("onGetUnits", data);
        if (data.code != 200) {
            ViewsManager.showTip(data.msg);
            return;
        }
        this._unitDatas = [];
        for (let k in data.unit_info_dict) {
            this._unitDatas.push({
                big_id: data.unit_info_dict[k].big_id,
                status: data.unit_info_dict[k].status,
                unit: data.unit_info_dict[k].unit
            });
        }
        this.unitList.numItems = this._unitDatas.length;
    }

    onUnitItemRender(item: Node, index: number) {
        item.getComponent(UnitItem).setData(this._unitDatas[index]);
    }

    onUnitItemSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onUnitItemSelected",selectedId);
        this.onUnitClick(this._unitDatas[selectedId]);
    }

    onUnitClick(data: UnitData) {
        if (this._isGetUnitWords) return;
        this._isGetUnitWords = true;
        console.log("UnitData", data);
        this._selectUnit = data;
        ServiceMgr.studyService.getUnitWords(data.big_id, data.unit);
    }

    async onGetUnitWords(data: WordGameUnitWordReply) {
        this._isGetUnitWords = false;
        if (data.code != 200) {
            ViewsManager.showTip(data.msg);
            return;
        }
        console.log("WordGameUnitWordReply", data);
        let subjectData: WordGameSubjectReply = {
            word_list : data.word_list,
            subject : {
                big_id:this._selectUnit.big_id,
                subject_name:this._selectUnit.unit,
                sentence_knowledge:[],
                is_unit:true,
                status:this._selectUnit.status,
            }
        }
        
        let node = await PopMgr.showPopup(PrefabType.SubjectView);
        node.getComponent(SubjectView).setData(subjectData);
    }

    onGradeSkipChallenge(data: Subject) {
        let unitIdx: number = -1;
        for (let i = 0; i < this._unitDatas.length; i++) {
            if (this._unitDatas[i].unit == data.subject_name) {
                unitIdx = i;
                break;
            }
        }
        if (unitIdx > 0) {
            let challengeUnit = this._unitDatas[unitIdx - 1];
            ServiceMgr.studyService.getGradeSkipExercisesList(challengeUnit.big_id, challengeUnit.unit);
        }
    }

    onGradeSkipExercises(data: GradeSkipExercisesListReply) {
        if (data.code != 200) {
            ViewsManager.showTip(data.msg);
            return;
        }
        console.log("onGradeSkipExercises", data);
        GradeSkipSubjectMgr.setData(data);
        ViewsMgr.showView(PrefabType.UnitExerciseView, (node: Node) => {
            node.getComponent(UnitExerciseView).setData(this._selectUnit);
        });
    }

    

    onBtnDetailsClick() {
        ViewsMgr.closeView(PrefabType.WorldIsland);
    }

    /**跳转到当前位置 */
    skipToCurrent() {
       
    }
    /**返回关卡模式 */
    private onBtnBackClick() {
        SceneMgr.loadScene(SceneType.MainScene);
    }
}


