import { _decorator, instantiate, isValid, Label, Node, Prefab, Sprite, Vec3 } from 'cc';
import { EventType } from '../../../config/EventType';
import { PrefabType } from '../../../config/PrefabType';
import { DataMgr, ItemData } from '../../../manager/DataMgr';
import { PopMgr } from '../../../manager/PopupManager';
import { ViewsMgr } from '../../../manager/ViewsManager';
import { BossLevelData, GateData, MapLevelData, WordGameSubjectReply } from '../../../models/AdventureModel';
import { InterfacePath } from '../../../net/InterfacePath';
import { ServiceMgr } from '../../../net/ServiceManager';
import { BasePopRight } from '../../../script/BasePopRight';
import CCUtil from '../../../util/CCUtil';
import EventManager from '../../../util/EventManager';
import FileUtil from '../../../util/FileUtil';
import List from '../../../util/list/List';
import { ObjectUtil } from '../../../util/ObjectUtil';
import { CGConfig } from '../../Challenge/ChallengeConfig';
import { EducationDataInfos } from '../../TextbookVocabulary/TextbookInfo';
import { SubjectView } from '../../theme/SubjectView';
import { ReportItem } from '../sixModes/ReportItem';
import { MonsterModel } from './MonsterModel';

const { ccclass, property } = _decorator;

@ccclass('rightPanelchange')
export class rightPanelchange extends BasePopRight {
    @property(Node)
    public btn_close: Node = null;
    
    @property(Node)
    public monsterNode: Node = null;
    
    @property([Node])
    public stars: Node[] = [];
    
    @property([Node])
    public starConditions: Node[] = [];
    
    @property(Label)
    public levelTxt: Label = null;
    
    @property(Label)
    public monsterNameTxt: Label = null;
    
    @property(Node)
    public btn_start: Node = null;
    
    @property(Node)
    public btn_test: Node = null;
    
    @property(Prefab)
    public monsterPrefab: Prefab = null;
    
    @property(List)
    public rewardList: List = null;
    
    @property(Node)
    public subjectBtn: Node = null;

    private _data: MapLevelData | GateData = null;
    private _monsterAni: Node = null;
    private _rewardData: ItemData[] = [];
    private _isBossPanel: boolean = false;
    private _bossLevelData: BossLevelData = null;
    private _isWordGame: boolean = false;
    private _isGetSubject: boolean = false;

    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("stage_frame")]);
    }

    protected onInitModuleEvent(): void {
        this.addModelListeners([
            [EventType.Expand_the_level_page, this.openView.bind(this)],
            [InterfacePath.WordGame_Subject, this.onWordGameSubject.bind(this)],
        ]);
    }

    initEvent() {
        CCUtil.onBtnClick(this.btn_close, this.hideView.bind(this));
        CCUtil.onBtnClick(this.btn_start, this.levelClick.bind(this));
        CCUtil.onBtnClick(this.btn_test, this.startTest.bind(this));
    }

    private levelClick() {
        const eventType = this._isBossPanel ? EventType.Enter_Boss_Level : EventType.Enter_Island_Level;
        EventManager.emit(eventType, this._data);
    }

    private startTest() {
        if (this.btn_test.getComponent(Sprite).grayscale) {
            ViewsMgr.showTipSmall("通过本关后解锁", this.btn_test, new Vec3(0, 80, 0));
            return;
        }
        EventManager.emit(EventType.Enter_Level_Test, this._data);
    }

    openView(param: MapLevelData | GateData = null) {
        this._data = param;
        this._isWordGame = param?.game_modes !== "word";
        const data = param.game_modes === "word" 
            ? CGConfig.KeyMonsterInfo.classification_reward 
            : param;
        // 获取奖励数据，并设置每个奖励项的 `from` 属性
        this._rewardData  = ObjectUtil.extractRewardData(data);
        // this._rewardData = this._Eventlistener()
        console.log("openView....this._rewardData",this._rewardData);
        this.subjectBtn.active = this._isWordGame;
        this._isBossPanel = false;
        this.updateView();
        this.node.active = true;
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
        this._data.game_modes === "word"
            ? this.updateWordGameView(monsterModel)
            : this.updateNormalGameView(monsterModel);

        this.updateStarConditions();
        this.rewardList.numItems = this._rewardData.length;
    }

    private updateWordGameView(monsterModel: MonsterModel) {
        const bigId = ObjectUtil.extractId(this._data.big_id);
        this.levelTxt.string = `${bigId}-${this._data.small_id}`;
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
        if (isValid(this._data.flag_info) &&Object.keys(this._data.flag_info).length > 0) {
            const starStatuses = [
                isValid(this._data.flag_info.star_one),
                isValid(this._data.flag_info.star_two),
                isValid(this._data.flag_info.star_three)
            ];

            starStatuses.forEach((isGet, index) => {
                const condition = this.starConditions[index].getComponent(Sprite);
                condition.grayscale = !isGet;
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

    async onWordGameSubject(data: WordGameSubjectReply) {
        this._isGetSubject = false;
        let node = await PopMgr.showPopup(PrefabType.SubjectView);
        node.getComponent(SubjectView).setData(data);
    }

    onRewardItemRender(item: Node, idx: number) {
        item.getComponent(ReportItem).updateItemProps(this._rewardData[idx]);
    }

    hideView() {
        this.closePop();
    }
}
