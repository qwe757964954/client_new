import { _decorator, Component, EventTouch, instantiate, Label, Node, Prefab, ScrollView } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ArchConfig, DataMgr, ItemData, MedalConfig } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { ToolUtil } from '../../util/ToolUtil';
import { RewardDialogView } from '../gift/RewardDialogView';
import { AchieveTaskItem } from './AchieveTaskItem';
import { AcieveMedalItem } from './AcieveMedalItem';
const { ccclass, property } = _decorator;

var typeName = {
    "0": TextConfig.Achieve_OverView, //成就总览
    "1": TextConfig.Achieve_GrowUp,   //人物成长
    "2": TextConfig.Achieve_Social,   //社交
    "3": TextConfig.Achieve_Dungeon,  //副本
    "4": TextConfig.Achieve_SpriteTrain,    //精灵培养
    "5": TextConfig.Achieve_AbilityTrain
}; //能力培养

var MidTypeEnum = {
    "RiskLevel": 1,
    "RoleLevel": 2,
    "CeBreak": 3,
    "MedalCount": 4,
    "HaveGold": 5,
    "HaveDiamond": 6,
    "UseGold": 7,
    "UseDiamond": 8,
    "HouseLevel": 9,
    "MineLevel": 10,
    "HaveHouse": 11,
    "HaveWing": 12,
    "HaveSkin": 13,
    "HaveHeadBox": 14,
    "InviteFriend": 15,
    "HaveFriend": 16,
    "InviteFriendBuy": 17,
    "Review": 18,
    "SpellModeCount": 19,
    "ReadModeCount": 20,
    "AllModeCount": 21,
    "ComposeModePass": 22,
    "SpellModePass": 23,
    "PetFriendness": 24,
    "PetLevel": 25,
    "MonsterCount": 26,
    "FingerTrain": 27,
    "GrammarTrain": 28
}
interface MedelIcon {
    skin: string;  //图标路径
    gray: boolean; //是否灰色
}
// 我的勋章信息
export interface MyMedalInfo {
    icon: MedelIcon; //图标
    nameTxt: string; //名字
    data: MedalConfig;
}

// 勋章简单信息
export interface MedalSimpleInfo {
    id: string; //id
    icon: string; //图标地址
}

//勋章选中状态
export interface SelectMedalInfo {
    MedalId: number;  //勋章ID
    Selected: boolean; //是否选中
}

//领取奖励
export interface ArchieveGetAwardInfo {
    AchId: number; //任务号
    Awards: string[]; //奖励数组
}

@ccclass('AchieveDialogView')
export class AchieveDialogView extends Component {

    @property({ type: Node, tooltip: "顶部个人信息栏" }) //
    public top_layout: Node = null;

    @property({ type: Label, tooltip: "个人成就等级栏" })
    public levelTxt: Label = null;

    @property({ type: Label, tooltip: "个人经验" })
    public expTxt: Label = null;

    @property({ type: ScrollView, tooltip: "成就滚动列表" })
    public allList: ScrollView = null;

    @property({ type: ScrollView, tooltip: "勋章滚动列表" }) //
    public allMedalList: ScrollView = null;

    @property({ type: Prefab, tooltip: "成就列表一项的预制体" })
    public preAchieveListItem: Prefab = null;

    @property({ type: Prefab, tooltip: "我的勋章的预制体" })
    public preMedalItem: Prefab = null;

    @property({ type: Label, tooltip: "成就总览" })
    public processTxt0: Label = null;

    @property({ type: Label, tooltip: "角色成长时度" })
    public processTxt1: Label = null;

    @property({ type: Label, tooltip: "社交进度" })
    public processTxt2: Label = null;

    @property({ type: Label, tooltip: "副本活动进度" })
    public processTxt3: Label = null;

    @property({ type: Label, tooltip: "精灵成长进度" })
    public processTxt4: Label = null;

    @property({ type: Label, tooltip: "能力培养进度" })
    public processTxt5: Label = null;

    @property({ type: Label, tooltip: "我的进度" }) //
    public processTxt6: Label = null;

    @property({ type: Node, tooltip: "Tab0按钮, 成就总览" }) //
    public tabBtn0: Node = null;

    @property({ type: Node, tooltip: "Tab1按钮, 角色成长" }) //
    public tabBtn1: Node = null;

    @property({ type: Node, tooltip: "Tab2按钮, 社交" }) //
    public tabBtn2: Node = null;

    @property({ type: Node, tooltip: "Tab3按钮, 副本" }) //
    public tabBtn3: Node = null;

    @property({ type: Node, tooltip: "Tab4按钮, 精灵成长" }) //
    public tabBtn4: Node = null;

    @property({ type: Node, tooltip: "Tab5按钮, 能力培养" }) //
    public tabBtn5: Node = null;

    @property({ type: Node, tooltip: "Tab6按钮, 我的勋章" }) // 
    public tabBtn6: Node = null;

    @property({ type: Node, tooltip: "关闭按钮" }) // 
    public closeBtn: Node = null;

    @property({ type: Node, tooltip: "点击显示勋章" }) // 
    public sureMedalBtn: Node = null;

    @property({ type: Label, tooltip: "我的进度" }) // 
    public titleLabel: Label = null;

    @property({ type: Node, tooltip: "成就列表栏" }) // 
    public bottombox: Node = null;

    @property({ type: Node, tooltip: "勋章栏" }) // 
    public allMedalBox: Node = null;

    private _listData = null;
    private _selectType: number = 0;
    private _medalItemList = [];
    private _selectedMedal = []; //选择的奖章
    private _popupEffect = null;
    private _closeEffect = null;

    private _MedalList = [];
    private _RecStatusList = [];
    private _Statistics = [];

    private _testGetAchieveDataEveId: string = ""; //测试获取成就列表信息
    private _testSelectMedalEveId: string = "";    //测试选中勋章消息
    private _testGetAchieveAwardEveId: string = "";    //测试获得奖章消息

    protected onLoad(): void {
        this._listData = null;
        this._selectType = 0;
        this._medalItemList = [];
        this._selectedMedal = [];
        this._popupEffect = null;
        this._closeEffect = null;
        this.init();
    }

    init() {
        this.initData();
        this.initUI();
        this.addEvent();
    }

    initUI() {
        this.initAmout();
        this.bottombox.active = true;
        this.allMedalBox.active = false;
    }

    /**初始化游戏数值 */
    initAmout() {
        ViewsManager.addAmout(this.top_layout, 15.78, 22.437);
    }

    initData() {
        //this._processTxts = [this.processTxt0, this.processTxt1, this.processTxt2, this.processTxt3, this.processTxt4, this.processTxt5, this.processTxt6];
    }

    addEvent() {
        CCUtil.onTouch(this.closeBtn, this.onCloseView, this);
        for (let i = 0; i < 7; i++) {
            CCUtil.onTouch(this["tabBtn" + i], this.onTabClick, this);
        }
        CCUtil.onTouch(this.sureMedalBtn, this.onMedalSelectSure, this);
        this._testGetAchieveDataEveId = EventManager.on(EventType.Achieve_GetAllInfo, this.onAchInfo.bind(this)); //
        this._testSelectMedalEveId = EventManager.on(EventType.Achieve_SelectMedal, this.onSelectMedal.bind(this));
        this._testGetAchieveAwardEveId = EventManager.on(EventType.Achieve_GetAward, this.onAchRecAwards.bind(this));
    }

    removeEvent() {
        CCUtil.offTouch(this.closeBtn, this.onCloseView, this);
        for (let i = 0; i < 7; i++) {
            CCUtil.offTouch(this["tabBtn" + i], this.onTabClick, this);
        }
        CCUtil.onTouch(this.sureMedalBtn, this.onMedalSelectSure, this);
        EventManager.off(EventType.Achieve_GetAllInfo, this._testGetAchieveDataEveId);
        EventManager.off(EventType.Achieve_SelectMedal, this._testSelectMedalEveId);
        EventManager.off(EventType.Achieve_GetAward, this._testGetAchieveAwardEveId);
    }

    /**收到成就信息 */
    onAchInfo(data) {
        this._MedalList = data.MedalList;
        this._RecStatusList = data.RecStatusList;
        this._Statistics = data.Statistics;
        this.levelTxt.string = data.Level;
        this.initView();
    }

    initView() {
        let listData = {};
        let statusList = this._RecStatusList;
        for (let i = 0; i < this._RecStatusList.length; i++) {
            let statusData = this._RecStatusList[i];
            let cfgData: ArchConfig = DataMgr.instance.archConfig[statusData.CurrentAchConfId];
            if (cfgData) {
                cfgData.Status = statusData.Status;
                cfgData.NextIds = statusData.NextIds;
                if (!listData[cfgData.Type]) {
                    listData[cfgData.Type] = {};
                    listData[cfgData.Type][cfgData.Mid] = cfgData;
                } else {
                    if (!listData[cfgData.Type][cfgData.Mid]) {
                        listData[cfgData.Type][cfgData.Mid] = cfgData;
                    }
                }
            }
        }
        this._listData = listData;
        this.showItemList(this._selectType);
        let totalSum = 0;
        let endSum = 0;
        for (let i = 0; i < this._Statistics.length; i++) {
            let statics = this._Statistics[i];
            this["processTxt" + statics.AchType].string = statics.AchEndNum + "/" + statics.AchTotalNum;
            totalSum += +statics.AchTotalNum;
            endSum += +statics.AchEndNum;
        }
        this.processTxt0.string = endSum + "/" + totalSum;

        let allMedal: MyMedalInfo[] = []; //所有的勋章
        let medalConfData: MedalConfig[] = DataMgr.instance.medalConfig; //GameData.medalConfig;
        for (let i = 0; i < medalConfData.length; i++) {
            let gray: boolean = true;
            for (let j = 0; j < this._MedalList.length; j++) {
                if (this._MedalList[j].MedalConfId == medalConfData[i].MedalId) {
                    gray = false;
                    break;
                }

            }
            let medalInfo: MyMedalInfo = {
                icon: { skin: "achieve/" + medalConfData[i].MedalId + "/spriteFrame", gray: gray },
                nameTxt: medalConfData[i].Info,
                data: medalConfData[i],
            };
            allMedal.push(medalInfo);
        }
        allMedal.sort((a, b) => {
            return !a.icon.gray ? -1 : 1;
        });
        this.allMedalList.content.removeAllChildren();
        for (let i = 0; i < allMedal.length; i++) {
            let data: MyMedalInfo = allMedal[i];
            this.addMyMedalListItem(data);
        }
        this.allMedalList.scrollToTop();
    }

    private showItemList(type: number) {
        let dataList = [];
        let totalNum = 0;
        let endNum = 0;
        for (let k in this._listData) {
            if (type == 0 || type == Number(k)) {
                let typeData = this._listData[k];
                for (let m in typeData) {
                    dataList.push(typeData[m]);
                    totalNum++;
                    if (typeData[m].Status != 0) {
                        endNum++;
                    }
                }
            }
        }

        dataList.sort((a, b) => {
            if (a.Status == 2 && b.Status != 2) return 1;
            if (a.Status != 2 && b.Status == 2) return -1;
            return a.Status > b.Status ? -1 : 1;
        });
        this.expTxt.string = endNum + "/" + totalNum;
        //设置成就列表
        this.allList.content.removeAllChildren();
        for (let i = 0; i < dataList.length; i++) {
            let data: ArchConfig = dataList[i];
            this.addAchieveListItem(data);
        }
        this.allList.scrollToTop();

    }

    private addAchieveListItem(data: ArchConfig) {
        let itemAchieve: Node = instantiate(this.preAchieveListItem);
        this.allList.content.addChild(itemAchieve);
        itemAchieve.getComponent(AchieveTaskItem).init(data);
    }

    private addMyMedalListItem(data: MyMedalInfo) {
        let itemMedal: Node = instantiate(this.preMedalItem);
        this.allMedalList.content.addChild(itemMedal);
        itemMedal.getComponent(AcieveMedalItem).init(data);
    }

    private onTabClick(e: EventTouch) {
        let tabindex: number = Number(e.target.name);
        if (this._selectType == tabindex) return;
        this._selectType = tabindex;
        let tabLight: Node = null;
        let tabLabel: Label = null;
        for (let i = 0; i < 7; i++) {
            tabLight = this["tabBtn" + i].getChildByName("lightflag");
            tabLabel = this["tabBtn" + i].getChildByName("tabName" + i).getComponent(Label);
            tabLight.active = (i == tabindex);
            if (i == tabindex) {
                this.titleLabel.string = tabLabel.string;
            }
        }
        if (tabindex < 6) {
            this.bottombox.active = true;
            this.allMedalBox.active = false;
            this.showItemList(this._selectType);
        } else {
            this.bottombox.active = false;
            this.allMedalBox.active = true;
        }
    }

    start() {
        //成就数据
        let RecStatusList = [
            { "CurrentAchConfId": 101001, Status: 0, NextIds: 101002 },//502005
            { "CurrentAchConfId": 102010, Status: 1, NextIds: 102011 },
            { "CurrentAchConfId": 103001, Status: 2, NextIds: 103001 },
            { "CurrentAchConfId": 201002, Status: 0, NextIds: 201003 },
            { "CurrentAchConfId": 202002, Status: 1, NextIds: 202003 },
            { "CurrentAchConfId": 301100, Status: 0, NextIds: 301101 },
            { "CurrentAchConfId": 302030, Status: 0, NextIds: 302031 },
            { "CurrentAchConfId": 401030, Status: 0, NextIds: 401031 },
            { "CurrentAchConfId": 402001, Status: 0, NextIds: 402002 },
            { "CurrentAchConfId": 501001, Status: 0, NextIds: 501002 },
            { "CurrentAchConfId": 502005, Status: 0, NextIds: 502003 },
        ];
        //成就完成统计
        let StatisticsList = [
            { "AchType": 1, "AchEndNum": 2, "AchTotalNum": 10 },
            { "AchType": 2, "AchEndNum": 1, "AchTotalNum": 5 },
            { "AchType": 3, "AchEndNum": 2, "AchTotalNum": 6 },
            { "AchType": 4, "AchEndNum": 3, "AchTotalNum": 8 },
            { "AchType": 5, "AchEndNum": 1, "AchTotalNum": 4 },
        ];

        let MedalList = [
            { "MedalConfId": 10002 },
            { "MedalConfId": 10102 },
            { "MedalConfId": 10202 },
            { "MedalConfId": 10303 },
            { "MedalConfId": 10502 },
            { "MedalConfId": 10601 },
        ];

        let data = {
            "RecStatusList": RecStatusList,
            "MedalList": MedalList,
            "Statistics": StatisticsList,
            "Level": 2,
        }

        EventManager.emit(EventType.Achieve_GetAllInfo, data);
    }

    private onSelectMedal(data: SelectMedalInfo) {
        if (!data.Selected && this._selectedMedal.length >= 5) {
            // Tool.tip("最多只能展示5枚勋章!");
            var strError: string = ToolUtil.replace(TextConfig.Achieve_Error_Medal_ExceedLimit, 5)
            ViewsManager.showTip(strError);
            return;
        }
        if (data.Selected == true) {
            if (this._selectedMedal.indexOf(data.MedalId + "") == -1) {
                this._selectedMedal.push(data.MedalId + "");
            }
        }
        else {
            let findIdx = this._selectedMedal.indexOf(data.MedalId + "");
            if (findIdx != -1) {
                this._selectedMedal.splice(findIdx, 1);
            }
        }
    }
    /**领取奖励 */
    private onAchRecAwards(data: ArchieveGetAwardInfo) {
        let awards: string[] = data.Awards;
        let numCoin: number = Number(awards[0]);
        let numDiamond: number = Number(awards[1]);
        ViewsManager.instance.showView(PrefabType.NewbieRewardDialogView, (node: Node) => {
            let awardInfo: ItemData = {
                "id": 1,
                "num": numDiamond,
            }
            let awardInfo2: ItemData = {
                "id": 2,
                "num": 50,
            }
            let awardInfos: ItemData[] = [awardInfo, awardInfo2];
            node.getComponent(RewardDialogView).initData(awardInfos);
        });
    }

    private onCloseView() {
        ViewsManager.instance.closeView(PrefabType.AchieveDialogView);
    }

    private onMedalSelectSure() {
        console.log(this._selectedMedal);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    update(deltaTime: number) {

    }
}


