import { _decorator, Label, Node, Prefab, ScrollView, Sprite, SpriteFrame } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { FriendListItemModel } from '../../models/FriendModel';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

var islandName = { "1": "魔法森林", "2": "水下管道城", "3": "冰雪岛", "4": "宝藏岛", "5": "瀑布岛", "6": "迷之水底城", "7": "海底深渊", "8": "海底深渊", "9": "海底深渊", "10": "海底深渊" };

@ccclass('FriendListItem')
export class FriendListItem extends ListItem {
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

    _data: FriendListItemModel = null;
    async initData(data: FriendListItemModel) {
        
        //console.log("FriendListItem initData: ", data);
        this._data = data;
        let headIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 }
        let avatar: number = headIdMap[data.avatar];
        let avatarPath: string = "friend/head_" + avatar + "/spriteFrame";
        await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite)).then(() => { },
            (error) => {
                // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
            });
        this.lblRealName.string = data.user_name;
        this.ndRedPoint.active = data.unread_count > 0;
        this.lblRedTip.string = data.unread_count + "";
    }
}


