import { _decorator, Component, Label, Node, sp } from 'cc';
import { BaseView } from '../../../script/BaseView';
import List from '../../../util/list/List';
import { inf_SpineAniCreate } from '../../../manager/InterfaceDefines';
import { GameRes } from '../../../GameRes';
import { EventMgr } from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
import CCUtil from '../../../util/CCUtil';
import { ViewsManager } from '../../../manager/ViewsManager';
import { PrefabType } from '../../../config/PrefabType';
import { ReportItem } from './ReportItem';
import { GameSubmitResponse } from '../../../models/TextbookModel';
import { AdventureResult, BossLevelSubmitData } from '../../../models/AdventureModel';
import { SoundMgr } from '../../../manager/SoundMgr';
const { ccclass, property } = _decorator;

@ccclass('ExamReportView')
export class ExamReportView extends BaseView {
    @property(Node)
    public level_list_btn: Node = null;
    @property(Node)
    public again_btn: Node = null;
    @property(Node)
    public next_level_btn: Node = null;
    @property(List)
    public reward_scroll: List = null;
    @property(Node)
    public result_sp: Node = null;
    @property(Node)
    public reward_sp: Node = null;
    @property(Node)
    public reward_line: Node = null;
    @property(sp.Skeleton)
    public result_spine: sp.Skeleton = null;
    @property(Node)
    public expBar: Node = null;
    @property(Label)
    public expLabel: Label = null;
    @property(Label)
    public levelLabel: Label = null;
    @property(Label)
    public timeLabel: Label = null;
    @property(Label)
    public rankLabel: Label = null;


    private _resultSubmitResponse: GameSubmitResponse | AdventureResult = null;
    private _bossLevelResult: BossLevelSubmitData = null;


    initData(data: any) {
        this._resultSubmitResponse = data;
        console.log("resultData", data);
        this.next_level_btn.active = this._resultSubmitResponse.pass_flag == 1;
        if (this._resultSubmitResponse.pass_flag == 1) {
            this.result_spine.setAnimation(0, "vic", true);
            this.reward_scroll.numItems = Object.keys(this._resultSubmitResponse.award).length;
            SoundMgr.victory();
        } else {
            this.result_spine.setAnimation(0, "def", false);
            this.result_spine.addAnimation(0, "def_idle", true);
            SoundMgr.fail();
        }
    }

    initBossLevel(data: BossLevelSubmitData) {
        this._bossLevelResult = data;
        this.next_level_btn.active = false;
        if (this._bossLevelResult.flag == 1) {
            this.result_spine.setAnimation(0, "vic", true);
            // this.reward_scroll.numItems = Object.keys(this._bossLevelResult.award).length;
            SoundMgr.victory();
        } else {
            this.result_spine.setAnimation(0, "def", false);
            this.result_spine.addAnimation(0, "def_idle", true);
            SoundMgr.fail();
        }
    }

    initEvent() {
        CCUtil.onBtnClick(this.again_btn, this.gotoEvaluation.bind(this));
        CCUtil.onBtnClick(this.level_list_btn, this.gotoLevelList.bind(this));
        CCUtil.onBtnClick(this.next_level_btn, this.gotoNextLevel.bind(this));
    }

    gotoEvaluation() {
        console.log("重新开始")
        this.node.destroy();
        if (this._bossLevelResult) {
            EventMgr.dispatch(EventType.Enter_Boss_Level);
        } else {
            EventMgr.dispatch(EventType.Enter_Level_Test);
        }
    }

    gotoNextLevel() {
        console.log("下一关卡")
        ViewsManager.instance.closeView(PrefabType.ExamReportView);
        this.node.destroy();
        EventMgr.dispatch(EventType.Goto_Textbook_Next_Level);
    }

    gotoLevelList() {
        console.log("关卡列表")
        EventMgr.dispatch(EventType.Exit_Island_Level);
        this.node.destroy();
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

    onLoadRewardHorizontal(item: Node, idx: number) {
        let award = this._resultSubmitResponse ? this._resultSubmitResponse.award : this._bossLevelResult.award;
        let keys = Object.keys(award);
        let key: string = keys[idx];
        let item_script = item.getComponent(ReportItem);
        item_script.updateItemProps(key, award[key]);
    }
}


