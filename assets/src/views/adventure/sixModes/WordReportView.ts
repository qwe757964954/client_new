import { _decorator, instantiate, Layers, Node, Prefab, UITransform } from 'cc';
import { EventType } from '../../../config/EventType';
import { PrefabType } from '../../../config/PrefabType';
import { GameRes } from '../../../GameRes';
import { ItemData } from '../../../manager/DataMgr';
import { inf_SpineAniCreate } from '../../../manager/InterfaceDefines';
import { SoundMgr } from '../../../manager/SoundMgr';
import { ViewsManager } from '../../../manager/ViewsManager';
import { AdventureResult } from '../../../models/AdventureModel';
import { RoleBaseModel } from '../../../models/RoleBaseModel';
import { GameSubmitResponse } from '../../../models/TextbookModel';
import { BaseView } from '../../../script/BaseView';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';
import List from '../../../util/list/List';
import { NodeUtil } from '../../../util/NodeUtil';
import { ObjectUtil } from '../../../util/ObjectUtil';
import { WordSourceType } from './BaseModeView';
import { ConditionItem } from './ConditionItem';
import { ReportItem } from './ReportItem';
const { ccclass, property } = _decorator;



export const ClearanceConditionsConfig = {
    star_one: "完成本关卡",
    star_two: "在5分钟内完成通关",
    star_three: "错误次数低于5",
}


@ccclass('WordReportView')
export class WordReportView extends BaseView {

    @property(Node)
    public level_list_btn: Node = null;

    @property(Node)
    public evaluation_btn: Node = null;

    @property(Node)
    public next_level_btn: Node = null;

    @property(List)
    public reward_scroll: List = null;

    @property(List)
    public condition_scroll: List = null;

    @property(Prefab)
    public roleModel: Prefab = null;//角色

    @property(Node)
    public role_node: Node = null;

    @property(Node)
    public result_sp: Node = null;

    @property(Node)
    public reward_sp: Node = null;

    @property(Node)
    public closeIcon: Node = null;

    @property(Node)
    public reward_line: Node = null;
    private _propsData: ItemData[] = [];
    private _resultSubmitResponse: GameSubmitResponse | AdventureResult = null;

    initUI() {
        this.initRolePlayer();
    }

    initData(data: GameSubmitResponse, gameModel: number, source_type: number) {
        this.evaluation_btn.active = gameModel !== 2;
        this._resultSubmitResponse = data;
        if (this._resultSubmitResponse.pass_flag == 1) {
            let startAnim = ["sta", "sta2", "sta3"]
            let ket_length = Object.keys(this._resultSubmitResponse.flag_info).length;
            let curAnim = startAnim[ket_length - 1];
            let idleAnim = `${curAnim}_idle`;
            this.showResultSpAni(curAnim, idleAnim);
            this._propsData = [];
            let awardInfo = this._resultSubmitResponse.award_info;
            if (awardInfo.star_one_reward) { //一星奖励
                for (let i = 0; i < awardInfo.star_one_reward.length; i++) {
                    awardInfo.star_one_reward[i].from = "star_one_reward";
                }
                this._propsData = [...awardInfo.star_one_reward];
            }
            if (awardInfo.star_two_reward) { //二星奖励
                for (let i = 0; i < awardInfo.star_two_reward.length; i++) {
                    awardInfo.star_two_reward[i].from = "star_two_reward";
                }
                this._propsData = [...this._propsData, ...awardInfo.star_two_reward];
            }
            if (awardInfo.star_three_reward) { //三星奖励
                for (let i = 0; i < awardInfo.star_three_reward.length; i++) {
                    awardInfo.star_three_reward[i].from = "star_three_reward";
                }
                this._propsData = [...this._propsData, ...awardInfo.star_three_reward];
            }
            if (awardInfo.pass_reward) { //固定奖励
                for (let i = 0; i < awardInfo.pass_reward.length; i++) {
                    awardInfo.pass_reward[i].from = "pass_reward";
                }
                this._propsData = [...this._propsData, ...awardInfo.pass_reward];
            }
            if (awardInfo.random_reward) { //随机奖励
                for (let i = 0; i < awardInfo.random_reward.length; i++) {
                    awardInfo.random_reward[i].from = "random_reward";
                }
                this._propsData = [...this._propsData, ...awardInfo.random_reward];
            }
            if (source_type === WordSourceType.classification) {
                this._propsData = ObjectUtil.convertAwardsToItemData(this._resultSubmitResponse.award_info);
            }
            this.reward_scroll.numItems = this._propsData.length;
            this.condition_scroll.numItems = ket_length;
            this.showRewardSpAni();
            SoundMgr.victory();
        } else {
            this.showResultSpAni("def", "def_idle");
            SoundMgr.fail();
        }

    }

    showResultSpAni(aniName: string, idleName: string) {
        let self = this;
        let changeAni = function (aniName: string, isLoop: boolean = false) {
            let spinePrams: inf_SpineAniCreate = {
                resConf: GameRes.Spine_Result,
                aniName: aniName,
                trackIndex: 0,
                parentNode: self.result_sp,
                isLoop: isLoop,
                callEndFunc: () => {
                    if (aniName == aniName) {
                        changeAni(idleName, true);
                    }
                }
            }
            self.result_sp.removeAllChildren();
            EventMgr.dispatch(EventType.Sys_Ani_Play, spinePrams);
        }
        changeAni(aniName, false);
    }

    showRewardSpAni() {
        let spinePrams: inf_SpineAniCreate = {
            resConf: GameRes.Spine_Reward,
            aniName: "animation_1",
            trackIndex: 0,
            parentNode: this.reward_sp,
            isLoop: false,
            callEndFunc: () => {
                this.reward_line.active = true;
            }
        }
        this.reward_sp.removeAllChildren();
        EventMgr.dispatch(EventType.Sys_Ani_Play, spinePrams);
    }

    initEvent() {
        CCUtil.onBtnClick(this.evaluation_btn, this.gotoEvaluation.bind(this));
        CCUtil.onBtnClick(this.level_list_btn, this.gotoLevelList.bind(this));
        CCUtil.onBtnClick(this.next_level_btn, this.gotoNextLevel.bind(this));
        CCUtil.onBtnClick(this.closeIcon, this.onCloseClick.bind(this));

    }
    gotoEvaluation() {
        console.log("测评模式")
        this.node.destroy();
        EventMgr.dispatch(EventType.Enter_Level_Test);
    }

    onCloseClick() {
        EventMgr.dispatch(EventType.Exit_Island_Level);
        this.node.destroy();
    }

    gotoNextLevel() {
        console.log("下一关卡")
        ViewsManager.instance.closeView(PrefabType.WordReportView);
        this.node.destroy();
        EventMgr.dispatch(EventType.Goto_Textbook_Next_Level);
    }

    gotoLevelList() {
        console.log("关卡列表")
        EventMgr.dispatch(EventType.Exit_Island_Level);
        this.node.destroy();
    }
    onInitModuleEvent() {

    }
    async initRolePlayer() {
        console.log("initRolePlayer  关卡列表")
        let role = instantiate(this.roleModel);
        this.role_node.addChild(role);
        NodeUtil.setLayerRecursively(role, Layers.Enum.UI_2D);
        let roleModel = role.getComponent(RoleBaseModel);
        await roleModel.init(101, 1, [9500, 9700, 9701, 9702, 9703]);
        roleModel.show(true);
        roleModel.standby();
    }

    onLoadRewardHorizontal(item: Node, idx: number) {
        const rewardItem = item.getComponent(ReportItem);
        const uiTransform = item.getComponent(UITransform);
        const scale = 126.5 / uiTransform.height;
        item.setScale(scale, scale, scale);
        rewardItem.updateItemProps(this._propsData[idx]);
    }

    onLoadConditionVertical(item: Node, idx: number) {
        let item_script = item.getComponent(ConditionItem);
        let keys = Object.keys(this._resultSubmitResponse.flag_info);
        let key: string = keys[idx];
        item_script.updateItemProps(key, this._resultSubmitResponse.flag_info[key]);
    }
}


