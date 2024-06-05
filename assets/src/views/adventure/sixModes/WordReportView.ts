import { _decorator, instantiate, Layers, Node, Prefab } from 'cc';
import { EventType } from '../../../config/EventType';
import { GameRes } from '../../../GameRes';
import { inf_SpineAniCreate } from '../../../manager/InterfaceDefines';
import { AdventureResult } from '../../../models/AdventureModel';
import { RoleBaseModel } from '../../../models/RoleBaseModel';
import { GameSubmitResponse } from '../../../models/TextbookModel';
import { BaseView } from '../../../script/BaseView';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';
import List from '../../../util/list/List';
import { NodeUtil } from '../../../util/NodeUtil';
import { ConditionItem } from './ConditionItem';
import { ReportItem } from './ReportItem';
const { ccclass, property } = _decorator;

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
    public reward_line: Node = null;

    private _resultSubmitResponse: GameSubmitResponse | AdventureResult = null;

    start() {
        this.initUI();
        this.initEvents();
    }

    initUI() {
        this.initRolePlayer();
    }

    initData(data: GameSubmitResponse) {
        this._resultSubmitResponse = data;
        console.log("initData___________000", this._resultSubmitResponse)
        console.log("initData___________", this._resultSubmitResponse.award)
        if (this._resultSubmitResponse.pass_flag == 1) {
            let startAnim = ["sta", "sta2", "sta3"]
            let curAnim = startAnim[this._resultSubmitResponse.flag_star_num - 1];
            let idleAnim = `${curAnim}_idle`;
            this.showResultSpAni(curAnim, idleAnim);
            this.reward_scroll.numItems = Object.keys(this._resultSubmitResponse.award).length;
            this.condition_scroll.numItems = this._resultSubmitResponse.flag_star_num;
            this.showRewardSpAni();
        } else {
            this.showResultSpAni("def", "def_idle");
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

    initEvents() {
        CCUtil.onBtnClick(this.evaluation_btn, () => {
            this.gotoEvaluation();
        });
        CCUtil.onBtnClick(this.level_list_btn, () => {
            this.gotoLevelList();
        });
        CCUtil.onBtnClick(this.next_level_btn, () => {
            this.gotoNextLevel();
        });

    }
    gotoEvaluation() {
        console.log("测评模式")
    }

    gotoNextLevel() {
        console.log("下一关卡")
        // ViewsManager.instance.closeView(PrefabType.WordReportView);
        this.node.destroy();
        EventMgr.dispatch(EventType.Goto_Textbook_Next_Level);
    }

    gotoLevelList() {
        console.log("关卡列表")
        EventMgr.dispatch(EventType.Exit_Island_Level);
        this.node.destroy();
        // ViewsManager.instance.closeView(PrefabType.WordReportView);
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
        let keys = Object.keys(this._resultSubmitResponse.award);
        let key: string = keys[idx];
        let item_script = item.getComponent(ReportItem);
        item_script.updateItemProps(key, this._resultSubmitResponse.award[key]);
        // let unitStatus:UnitItemStatus = this._unitListArr[idx];
        // item_sript.updateRewardStatus(unitStatus.studywordnum >=unitStatus.totalwordnum);
    }

    onLoadConditionVertical(item: Node, idx: number) {
        let item_script = item.getComponent(ConditionItem);
    }
}


