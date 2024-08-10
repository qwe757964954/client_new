import { _decorator, instantiate, isValid, Label, Node, Prefab, Sprite, tween, UITransform, Vec3 } from 'cc';
import { EventType } from '../../../config/EventType';
import { PrefabType } from '../../../config/PrefabType';
import { DataMgr, ItemData } from '../../../manager/DataMgr';
import { ViewsMgr } from '../../../manager/ViewsManager';
import { BossLevelData, GateData, MapLevelData, WordGameSubjectReply } from '../../../models/AdventureModel';
import { InterfacePath } from '../../../net/InterfacePath';
import { ServiceMgr } from '../../../net/ServiceManager';
import { BaseView } from '../../../script/BaseView';
import CCUtil from '../../../util/CCUtil';
import EventManager from '../../../util/EventManager';
import FileUtil from '../../../util/FileUtil';
import List from '../../../util/list/List';
import { ObjectUtil } from '../../../util/ObjectUtil';
import { EducationDataInfos } from '../../TextbookVocabulary/TextbookInfo';
import { SubjectView } from '../../theme/SubjectView';
import { ReportItem } from '../sixModes/ReportItem';
import { MonsterModel } from './MonsterModel';
const { ccclass, property } = _decorator;

@ccclass('rightPanelchange')
export class rightPanelchange extends BaseView {
    @property({ type: Node, tooltip: "关闭按钮" })
    public btn_close: Node = null;
    
    @property({ type: Node, tooltip: "怪物容器" })
    public monsterNode: Node = null;
    
    @property({ type: [Node], tooltip: "星星" })
    public stars: Node[] = [];
    
    @property({ type: [Node], tooltip: "星星条件" })
    public starConditions: Node[] = [];
    
    @property(Label)
    public levelTxt: Label = null;
    
    @property(Label)
    public monsterNameTxt: Label = null;
    
    @property(Node)
    public btn_start: Node = null;
    
    @property(Node)
    public btn_test: Node = null;
    
    @property({ type: Prefab, tooltip: "怪物预制" })
    public monsterPrefab: Prefab = null;
    
    @property({ type: List, tooltip: "奖励列表" })
    public rewardList: List = null;
    
    @property({ type: Node, tooltip: "主题按钮" })
    public subjectBtn: Node = null;

    private _data: MapLevelData | GateData = null;
    private _monsterAni: Node = null;
    private _rewardData: ItemData[] = [];
    private _isTweening: boolean = false;
    private _isBossPanel: boolean = false;
    private _bossLevelData: BossLevelData = null;
    private _isWordGame: boolean = false;
    private _isGetSubject: boolean = false;

    protected initUI(): void {
        // this.offViewAdaptSize();
        this.node.setScale(0.8, 0.8, 0.8);
    }

    private levelClick() {
        console.log("levelClick");
        const eventType = this._isBossPanel ? EventType.Enter_Boss_Level : EventType.Enter_Island_Level;
        EventManager.emit(eventType, this._data);
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [EventType.Expand_the_level_page, this.openView.bind(this)],
            [InterfacePath.WordGame_Subject, this.onWordGameSubject.bind(this)],
        ]);
    }

    private startTest() {
        if (this.btn_test.getComponent(Sprite).grayscale) {
            ViewsMgr.showTipSmall("通过本关后解锁", this.btn_test, new Vec3(0, 80, 0));
            return;
        }
        EventManager.emit(EventType.Enter_Level_Test, this._data);
    }

    initEvent() {
        CCUtil.onBtnClick(this.btn_close, this.hideView.bind(this));
        CCUtil.onBtnClick(this.btn_start, this.levelClick.bind(this));
        CCUtil.onBtnClick(this.btn_test, this.startTest.bind(this));
    }

    openView(param: MapLevelData | GateData = null) {
        console.log('接收到的参数=', param);
        this._data = param;
        this._isWordGame = param && param.game_modes !== "word";
        this._rewardData = this.extractRewardData(param as GateData);

        this.subjectBtn.active = this._isWordGame;
        this._isBossPanel = false;
        this.updateView();
        this.node.active = true;

        if (this._isTweening) return;

        this._isTweening = true;
        const node_size = this.node.getComponent(UITransform);
        tween(this.node).by(0.3, { position: new Vec3(-node_size.width, 0, 0) })
            .call(() => this._isTweening = false)
            .start();
    }

    private extractRewardData(awardInfo: GateData): ItemData[] {
        const rewardData = [
            ...(awardInfo.star_one_reward || []),
            ...(awardInfo.star_two_reward || []),
            ...(awardInfo.star_three_reward || []),
            ...(awardInfo.pass_reward || []),
            ...(awardInfo.random_reward || [])
        ];

        rewardData.forEach(item => {
            item.from = item.from || "unknown_reward";
        });

        return rewardData;
    }

    openBossView(levelData: BossLevelData) {
        this._bossLevelData = levelData;
        this._isBossPanel = true;

        if (!this._monsterAni) {
            this._monsterAni = instantiate(this.monsterPrefab);
            this.monsterNode.addChild(this._monsterAni);
        }

        const monsterModel = this._monsterAni.getComponent(MonsterModel);
        monsterModel.init(`spine/monster/adventure/${levelData.bossAni}`);
        this.monsterNameTxt.string = levelData.bossName;
        this.levelTxt.node.active = false;
        this.btn_test.active = false;
        this.monsterNode.setScale(1, 1, 1);

        this.node.active = true;

        if (this._isTweening) return;

        this._isTweening = true;
        const node_size = this.node.getComponent(UITransform);
        const scale = this.node.getScale();
        tween(this.node).by(0.3, { position: new Vec3(-node_size.width * scale.x, 0, 0) })
            .call(() => this._isTweening = false)
            .start();

        this.rewardList.numItems = this._rewardData.length;
    }

    updateView() {
        if (!this._monsterAni) {
            this._monsterAni = instantiate(this.monsterPrefab);
            this.monsterNode.addChild(this._monsterAni);
        }

        this.levelTxt.node.active = true;
        this.btn_test.active = true;
        this.monsterNode.setScale(2, 2, 2);

        const monsterModel = this._monsterAni.getComponent(MonsterModel);
        if (this._data.game_modes === "word") {
            this.updateWordGameView(monsterModel);
        } else {
            this.updateNormalGameView(monsterModel);
        }

        this.updateStarConditions();
        this.rewardList.numItems = this._rewardData.length;
    }

    private updateWordGameView(monsterModel: MonsterModel) {
        const big_id = ObjectUtil.extractId(this._data.big_id);
        this.levelTxt.string = `${big_id}-${this._data.small_id}`;
        const educationInfo = EducationDataInfos.find(item => item.id === this._data.monster_id);
        monsterModel.init(FileUtil.removeFileExtension(educationInfo.monster));
        this.monsterNameTxt.string = "宝箱怪";
        this.monsterNode.setScale(-0.8, 0.8, 1);
    }

    private updateNormalGameView(monsterModel: MonsterModel) {
        this.levelTxt.string = `${this._data.big_id}-${this._data.small_id}`;
        const monsterData = DataMgr.getMonsterData(this._data.monster_id);
        monsterModel.init(`spine/monster/adventure/${monsterData.monsterAni}`);
        this.monsterNameTxt.string = monsterData.monsterName;
    }

    private updateStarConditions() {
        if (isValid(this._data.flag_info)) {
            const starStatuses = [
                isValid(this._data.flag_info.star_one),
                isValid(this._data.flag_info.star_two),
                isValid(this._data.flag_info.star_three)
            ];

            starStatuses.forEach((isGet, index) => {
                this.starConditions[index].getComponent(Sprite).grayscale = !isGet;
                this.starConditions[index].getChildByName("star").active = isGet;
                this.stars[index].getComponent(Sprite).grayscale = index >= starStatuses.filter(status => status).length;
            });

            this.btn_test.getComponent(Sprite).grayscale = false;
        } else {
            this.stars.forEach(star => star.getComponent(Sprite).grayscale = true);
            this.starConditions.forEach(condition => {
                condition.getComponent(Sprite).grayscale = true;
                condition.getChildByName("star").active = false;
            });
            this.btn_test.getComponent(Sprite).grayscale = true;
        }
    }

    onSubjectBtnClick() {
        if (this._isGetSubject) return;
        this._isGetSubject = true;
        const gateData = this._data as GateData;
        ServiceMgr.studyService.getWordGameSubject(gateData.subject_id);
    }

    onWordGameSubject(data: WordGameSubjectReply) {
        this._isGetSubject = false;
        console.log("WordGameSubjectReply", data);
        ViewsMgr.showView(PrefabType.SubjectView, node => {
            node.getComponent(SubjectView).setData(data);
        });
    }

    onRewardItemRender(item: Node, idx: number) {
        item.getComponent(ReportItem).updateItemProps(this._rewardData[idx]);
    }

    hideView() {
        const node_size = this.node.getComponent(UITransform);
        const scale = this.node.getScale();
        tween(this.node).by(0.3, { position: new Vec3(node_size.width * scale.x, 0, 0) })
            .call(() => { this.node.active = false; })
            .start();
    }
}
