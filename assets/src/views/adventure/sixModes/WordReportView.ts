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
import { ConditionItem } from './ConditionItem';
import { ReportItem } from './ReportItem';

const { ccclass, property } = _decorator;

export const ClearanceConditionsConfig = {
    star_one: "完成本关卡",
    star_two: "在5分钟内完成通关",
    star_three: "错误次数低于5",
};

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
    public roleModel: Prefab = null; //角色

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

        if (this._resultSubmitResponse.pass_flag === 1) {
            const anims = ["sta", "sta2", "sta3"];
            const numFlags = Object.keys(this._resultSubmitResponse.flag_info).length;
            const currentAnim = anims[numFlags - 1];
            const idleAnim = `${currentAnim}_idle`;

            this.showResultSpAni(currentAnim, idleAnim);
            this._propsData = this.extractRewardData(data.award_info);
            this.reward_scroll.numItems = this._propsData.length;
            this.condition_scroll.numItems = numFlags;

            this.showRewardSpAni();
            SoundMgr.victory();
        } else {
            this.showResultSpAni("def", "def_idle");
            SoundMgr.fail();
        }
    }

    private extractRewardData(awardInfo: any): ItemData[] {
        const rewardTypes = [
            { key: 'star_one_reward', from: 'star_one_reward' },
            { key: 'star_two_reward', from: 'star_two_reward' },
            { key: 'star_three_reward', from: 'star_three_reward' },
            { key: 'pass_reward', from: 'pass_reward' },
            { key: 'random_reward', from: 'random_reward' },
        ];

        return rewardTypes.reduce((acc: ItemData[], { key, from }) => {
            if (awardInfo[key]) {
                const rewards = awardInfo[key].map((item: ItemData) => ({ ...item, from }));
                acc.push(...rewards);
            }
            return acc;
        }, []);
    }

    private showResultSpAni(aniName: string, idleName: string) {
        const changeAni = (aniName: string, isLoop: boolean = false) => {
            const spinePrams: inf_SpineAniCreate = {
                resConf: GameRes.Spine_Result,
                aniName:aniName,
                trackIndex: 0,
                parentNode: this.result_sp,
                isLoop:isLoop,
                callEndFunc: () => {
                    if (aniName === aniName) {
                        changeAni(idleName, true);
                    }
                }
            };
            this.result_sp.removeAllChildren();
            EventMgr.dispatch(EventType.Sys_Ani_Play, spinePrams);
        };
        changeAni(aniName);
    }

    private showRewardSpAni() {
        const spinePrams: inf_SpineAniCreate = {
            resConf: GameRes.Spine_Reward,
            aniName: "animation_1",
            trackIndex: 0,
            parentNode: this.reward_sp,
            isLoop: false,
            callEndFunc: () => {
                this.reward_line.active = true;
            }
        };
        this.reward_sp.removeAllChildren();
        EventMgr.dispatch(EventType.Sys_Ani_Play, spinePrams);
    }

    initEvent() {
        CCUtil.onBtnClick(this.evaluation_btn, this.gotoEvaluation.bind(this));
        CCUtil.onBtnClick(this.level_list_btn, this.gotoLevelList.bind(this));
        CCUtil.onBtnClick(this.next_level_btn, this.gotoNextLevel.bind(this));
        CCUtil.onBtnClick(this.closeIcon, this.onCloseClick.bind(this));
    }

    private gotoEvaluation() {
        console.log("测评模式");
        this.node.destroy();
        EventMgr.dispatch(EventType.Enter_Level_Test);
    }

    private onCloseClick() {
        EventMgr.dispatch(EventType.Exit_Island_Level);
        this.node.destroy();
    }

    private gotoNextLevel() {
        console.log("下一关卡");
        ViewsManager.instance.closeView(PrefabType.WordReportView);
        this.node.destroy();
        EventMgr.dispatch(EventType.Goto_Textbook_Next_Level);
    }

    private gotoLevelList() {
        console.log("关卡列表");
        EventMgr.dispatch(EventType.Exit_Island_Level);
        this.node.destroy();
    }

    onInitModuleEvent() {
        // Implement if needed
    }

    private async initRolePlayer() {
        console.log("initRolePlayer 关卡列表");
        const role = instantiate(this.roleModel);
        this.role_node.addChild(role);
        NodeUtil.setLayerRecursively(role, Layers.Enum.UI_2D);

        const roleModel = role.getComponent(RoleBaseModel);
        await roleModel.initSelf();
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
        const itemScript = item.getComponent(ConditionItem);
        const keys = Object.keys(this._resultSubmitResponse.flag_info);
        const key = keys[idx];
        itemScript.updateItemProps(key, this._resultSubmitResponse.flag_info[key]);
    }
}
