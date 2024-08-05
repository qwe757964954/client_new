import { _decorator, Component, instantiate, isValid, Label, Node, Prefab, Sprite, tween, UITransform, Vec3 } from 'cc';
import { EventType } from '../../../config/EventType';
import { PrefabType } from '../../../config/PrefabType';
import { DataMgr, ItemData } from '../../../manager/DataMgr';
import { ViewsMgr } from '../../../manager/ViewsManager';
import { BossLevelData, GateData, MapLevelData, WordGameSubjectReply } from '../../../models/AdventureModel';
import { InterfacePath } from '../../../net/InterfacePath';
import { ServiceMgr } from '../../../net/ServiceManager';
import CCUtil from '../../../util/CCUtil';
import EventManager, { EventMgr } from '../../../util/EventManager';
import FileUtil from '../../../util/FileUtil';
import List from '../../../util/list/List';
import { ObjectUtil } from '../../../util/ObjectUtil';
import { EducationDataInfo, EducationDataInfos } from '../../TextbookVocabulary/TextbookInfo';
import { SubjectView } from '../../theme/SubjectView';
import { ReportItem } from '../sixModes/ReportItem';
import { MonsterModel } from './MonsterModel';
const { ccclass, property } = _decorator;

export interface LevelConfig {
    small_id: number;
    big_id: number;
}
/**右边选择关卡界面 何存发 2024年4月12日14:21:29 */
@ccclass('rightPanel')
export class rightPanelchange extends Component {
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
    monsterNameTxt: Label = null;
    @property(Node)
    btn_start: Node = null;
    @property(Node)
    btn_test: Node = null;
    @property({ type: Prefab, tooltip: "怪物预制" })
    public monsterPrefab: Prefab = null;
    @property({ type: List, tooltip: "奖励列表" })
    public rewardList: List = null;
    @property({ type: Node, tooltip: "主题按钮" })
    public subjectBtn: Node = null;

    private _data: MapLevelData | GateData = null;
    private _eveId: string;
    private _monsterAni: Node = null;
    private _rewardData: ItemData[] = []; //奖励数据

    private _isTweening: boolean = false;
    private _isBossPanel: boolean = false; //是否是boss关
    private _bossLevelData: BossLevelData = null;
    private _isWordGame: boolean = false; //是否是大冒险关卡
    private _isGetSubject: boolean = false; //是否正在获取主题内容

    /** 更新 */
    update(deltaTime: number) {

    }

    onLoad() {
        this.initEvent();
        this.initUI()
    }

    private initUI() {
    }

    //点击跳转到闯关界面 TODO
    private levelClick() {
        console.log("levelClick");
        if (this._isBossPanel) {
            EventMgr.dispatch(EventType.Enter_Boss_Level);
        } else {
            EventManager.emit(EventType.Enter_Island_Level, this._data);
        }
    }

    private startTest() {
        if (this.btn_test.getComponent(Sprite).grayscale) {
            ViewsMgr.showTipSmall("通过本关后解锁", this.btn_test, new Vec3(0, 80, 0));
            return;
        }
        EventManager.emit(EventType.Enter_Level_Test, this._data);
    }

    initEvent() {
        CCUtil.onTouch(this.btn_close, this.hideView, this);
        CCUtil.onTouch(this.btn_start, this.levelClick, this);
        CCUtil.onBtnClick(this.btn_test, () => {
            this.startTest();
        });
        this._eveId = EventManager.on(EventType.Expand_the_level_page, this.openView.bind(this));
        EventMgr.addListener(InterfacePath.WordGame_Subject, this.onWordGameSubject, this);

    }
    /** 打开界面 */
    openView(param: MapLevelData | GateData = null) {
        console.log('接收到的参数=', param);
        this._data = param;
        this._isWordGame = false;
        if (!this._data.game_modes || this._data.game_modes != "word") {
            this._isWordGame = true;
            let awardInfo = this._data as GateData;
            this._rewardData = [];
            if (awardInfo.star_one_reward) { //一星奖励
                for (let i = 0; i < awardInfo.star_one_reward.length; i++) {
                    awardInfo.star_one_reward[i].from = "star_one_reward";
                }
                this._rewardData = [...awardInfo.star_one_reward];
            }
            if (awardInfo.star_two_reward) { //二星奖励
                for (let i = 0; i < awardInfo.star_two_reward.length; i++) {
                    awardInfo.star_two_reward[i].from = "star_two_reward";
                }
                this._rewardData = [...this._rewardData, ...awardInfo.star_two_reward];
            }
            if (awardInfo.star_three_reward) { //三星奖励
                for (let i = 0; i < awardInfo.star_three_reward.length; i++) {
                    awardInfo.star_three_reward[i].from = "star_three_reward";
                }
                this._rewardData = [...this._rewardData, ...awardInfo.star_three_reward];
            }
            if (awardInfo.pass_reward) { //固定奖励
                for (let i = 0; i < awardInfo.pass_reward.length; i++) {
                    awardInfo.pass_reward[i].from = "pass_reward";
                }
                this._rewardData = [...this._rewardData, ...awardInfo.pass_reward];
            }
            if (awardInfo.random_reward) { //随机奖励
                for (let i = 0; i < awardInfo.random_reward.length; i++) {
                    awardInfo.random_reward[i].from = "random_reward";
                }
                this._rewardData = [...this._rewardData, ...awardInfo.random_reward];
            }
        }
        this.subjectBtn.active = this._isWordGame;
        this._isBossPanel = false;
        this.updateView();
        this.node.active = true;
        if (this._isTweening) return;
        this._isTweening = true;
        let node_size = this.node.getComponent(UITransform);
        tween(this.node).by(0.3, { position: new Vec3(-node_size.width, 0, 0) }).call(() => {
            this._isTweening = false;
            // this.node.active = false
        }).start();
        // tween(this.node).to(0.3, { position: v3(178, 100, 0) }).call(() => {
        // }).start()

    }

    openBossView(levelData: BossLevelData) {
        this._bossLevelData = levelData;
        this._isBossPanel = true;
        if (!this._monsterAni) {
            this._monsterAni = instantiate(this.monsterPrefab);
            this.monsterNode.addChild(this._monsterAni);
        }
        let monsterModel = this._monsterAni.getComponent(MonsterModel);
        monsterModel.init("spine/monster/adventure/" + levelData.bossAni);
        this.monsterNameTxt.string = levelData.bossName;
        this.levelTxt.node.active = false;
        this.btn_test.active = false;
        this.monsterNode.setScale(1, 1, 1);

        this.node.active = true;
        if (this._isTweening) return;
        this._isTweening = true;
        let node_size = this.node.getComponent(UITransform);
        tween(this.node).by(0.3, { position: new Vec3(-node_size.width, 0, 0) }).call(() => {
            this._isTweening = false;
        }).start();
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
        let monsterModel = this._monsterAni.getComponent(MonsterModel);
        if (this._data.game_modes && this._data.game_modes === "word") {
            let big_id = ObjectUtil.extractId(this._data.big_id);
            this.levelTxt.string = big_id + '-' + this._data.small_id;
            let educationInfo:EducationDataInfo = EducationDataInfos.find(item=> item.id===this._data.monster_id);
            monsterModel.init(FileUtil.removeFileExtension(educationInfo.monster));
            this.monsterNameTxt.string = "宝箱怪";
            this.monsterNode.setScale(-0.8, 0.8, 1);
        } else {
            this.levelTxt.string = this._data.big_id + '-' + this._data.small_id;
            let monsterData = DataMgr.getMonsterData(this._data.monster_id);
            monsterModel.init("spine/monster/adventure/" + monsterData.monsterAni);
            this.monsterNameTxt.string = monsterData.monsterName;
        }
        let data = this._data;
        //有星星
        if (isValid(data.flag_info) && isValid(data.flag_info.star_one)) {
            let starnum = 0;
            let isGet = isValid(data.flag_info.star_one);
            if (isGet) starnum++;
            this.starConditions[0].getComponent(Sprite).grayscale = !isGet;
            this.starConditions[0].getChildByName("star").active = isGet;

            isGet = isValid(data.flag_info.star_two);
            if (isGet) starnum++;
            this.starConditions[1].getComponent(Sprite).grayscale = !isGet;
            this.starConditions[1].getChildByName("star").active = isGet;

            isGet = isValid(data.flag_info.star_three);
            if (isGet) starnum++;
            this.starConditions[2].getComponent(Sprite).grayscale = !isGet;
            this.starConditions[2].getChildByName("star").active = isGet;

            for (let i = 0; i < 3; i++) {
                this.stars[i].getComponent(Sprite).grayscale = i >= starnum;
            }

            this.btn_test.getComponent(Sprite).grayscale = false;
            // this.btn_test.getComponent(Button).enabled = true;
        } else {
            for (let i = 0; i < 3; i++) {
                this.stars[i].getComponent(Sprite).grayscale = true;
                this.starConditions[i].getComponent(Sprite).grayscale = true;
                this.starConditions[i].getChildByName("star").active = false;
            }
            this.btn_test.getComponent(Sprite).grayscale = true;
            // this.btn_test.getComponent(Button).enabled = false;
        }
        this.rewardList.numItems = this._rewardData.length;
        // this.btn_test.getComponent(Sprite).grayscale = true;
        // this.btn_test.getComponent(Button).enabled = false;
        // LoadManager.loadSprite("adventure/monster/" + this._data.bigId + "-" + this._data.smallId + "/spriteFrame", this.monster.getComponent(Sprite));
    }

    onSubjectBtnClick() {
        if (this._isGetSubject) return;
        this._isGetSubject = true;
        let gateData = this._data as GateData;
        ServiceMgr.studyService.getWordGameSubject(gateData.subject_id);
    }

    onWordGameSubject(data: WordGameSubjectReply) {
        this._isGetSubject = false;
        console.log("WordGameSubjectReply", data);
        ViewsMgr.showView(PrefabType.SubjectView, (node) => {
            node.getComponent(SubjectView).setData(data);
        })
    }

    onRewardItemRender(item: Node, idx: number) {
        item.getComponent(ReportItem).updateItemProps(this._rewardData[idx]);
    }

    hideView() {
        let node_size = this.node.getComponent(UITransform);
        tween(this.node).by(0.3, { position: new Vec3(node_size.width, 0, 0) }).call(() => {
            this.node.active = false
        }).start();
    }

    removeEvent() {
        CCUtil.offTouch(this.btn_close, this.hideView, this);
        CCUtil.offTouch(this.btn_start, this.levelClick, this);
        CCUtil.offTouch(this.btn_test, this.startTest, this);
        EventManager.off(EventType.Expand_the_level_page, this._eveId);

    }

    onDestroy() {

    }
}


