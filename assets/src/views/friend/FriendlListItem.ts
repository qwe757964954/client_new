import { _decorator, Component, instantiate, Label, Node, Prefab, ScrollView, Sprite, SpriteFrame } from 'cc';
import { FriendItemClickInfo, FriendUnitInfo } from '../../models/FriendModel';
import { LoadManager } from '../../manager/LoadManager';
import { ToolUtil } from '../../util/ToolUtil';
import { TextConfig } from '../../config/TextConfig';
import { MedalSimpleInfo } from '../achieve/AchieveDialogView';
import { MedalIconItem } from './MedalIconItem';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

var islandName = { "1": "魔法森林", "2": "水下管道城", "3": "冰雪岛", "4": "宝藏岛", "5": "瀑布岛", "6": "迷之水底城", "7": "海底深渊", "8": "海底深渊", "9": "海底深渊", "10": "海底深渊" };

@ccclass('FriendListItem')
export class FriendListItem extends Component {
    @property({ type: Sprite, tooltip: "底层背景" })
    imgBg: Sprite = null;

    @property({ type: Node, tooltip: "按钮处理" })
    btnItem: Node = null;

    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Label, tooltip: "朋友名字标签" })
    lblRealName: Label = null;

    @property({ type: Label, tooltip: "朋友战力标签" })
    lblCe: Label = null;

    @property({ type: ScrollView, tooltip: "奖章列表" })
    medalList: ScrollView = null;

    @property({ type: Label, tooltip: "状态标签" })
    lblState: Label = null;

    @property({ type: Label, tooltip: "闯过的关卡标签" })
    lblIsland: Label = null;

    @property({ type: Node, tooltip: "红色按钮" })
    ndRedPoint: Node = null;

    @property({ type: Label, tooltip: "状态标签" })
    lblRedTip: Label = null;

    @property({ type: Node, tooltip: "弹出按钮" })
    btnArrow: Node = null;

    @property({ type: Prefab, tooltip: "奖章预制体" })
    preMedalIcon: Prefab = null;

    @property({ type: [SpriteFrame], tooltip: "背景页的图片数组" }) // 0:选中 1: 未选中
    public sprBgAry: SpriteFrame[] = [];

    _data: FriendUnitInfo = null;

    protected onLoad(): void {
        //console.log("FriendListItem onLoad");
        this.addEvent();
    }

    addEvent() {
        CCUtil.onTouch(this.btnItem, this.onItemClick, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.btnItem, this.onItemClick, this);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    async initData(data: FriendUnitInfo, selectFriend: FriendUnitInfo) {
        //console.log("FriendListItem initData: ", data);
        this._data = data;
        let headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 }
        let avatar: number = headIdMap[data.ModelId];
        let avatarPath: string = "friend/head_" + avatar + "/spriteFrame";
        await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite)).then(() => { },
            (error) => {
                // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
            });
        this.lblRealName.string = data.RealName;
        this.lblState.string = data.Ltmsg;
        var strLevel: string = ToolUtil.replace(TextConfig.Level_Index, data.SmallId)
        this.lblIsland.string = islandName[data.BigId] + "/" + strLevel; //"第" + data.SmallId + "关";
        this.lblCe.string = "" + data.Ce;
        //设置背景
        let bSelect: boolean = false; //本单位是否选中
        if (!selectFriend) {
            bSelect = false;
        }
        else if (data.FriendId == selectFriend.FriendId) {
            bSelect = true;
        }
        this.imgBg.spriteFrame = bSelect ? this.sprBgAry[0] : this.sprBgAry[1];
        //设置未读信息
        let newMsgBox: Node = this.node.getChildByName("newMsgBox");
        if (data.UnReadNum > 0 && (!selectFriend || (data.FriendId != selectFriend.FriendId))) {
            newMsgBox.active = true;
        }
        else {
            newMsgBox.active = false;
        }
        if (data.UnReadNum > 0) {
            newMsgBox.getChildByName("newMsgTxt").getComponent(Label).string = "" + data.UnReadNum;
        }
        //设置勋章列表
        this.medalList.content.removeAllChildren();
        let medalData: MedalSimpleInfo[] = [];
        if (data.MedalSet) {
            let medalArr = data.MedalSet.split(",");
            for (let i = 0; i < medalArr.length; i++) {
                let medalId: string = medalArr[i];
                let iconPath: string = "achieve/" + medalId + "/spriteFrame";
                medalData.push({ id: medalId, icon: iconPath })
            }
        }
        for (let i = 0; i < medalData.length; i++) {
            let medalIcon: Node = instantiate(this.preMedalIcon);
            this.medalList.content.addChild(medalIcon);
            await medalIcon.getComponent(MedalIconItem).initData(medalData[i])
        }
        this.medalList.scrollToLeft();
    }

    onItemClick() {
        let data: FriendItemClickInfo = {
            info: this._data,
            node: this.node,
        }
        EventManager.emit(EventType.Friend_ClickFriendList, data);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


