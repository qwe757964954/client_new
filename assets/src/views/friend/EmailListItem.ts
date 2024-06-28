import { _decorator, Label, Node, Sprite } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { SystemMailItem } from '../../models/FriendModel';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('EmailListItem')
export class EmailListItem extends ListItem {
    @property({ type: Sprite, tooltip: "底层背景" })
    imgBg: Sprite = null;

    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Node, tooltip: "按钮处理" })
    btnItem: Node = null;

    @property({ type: Label, tooltip: "Email名字标签" })
    lblRealName: Label = null;

    @property({ type: Label, tooltip: "关卡标签" })
    lblIsLand: Label = null;

    @property({ type: Label, tooltip: "状态标签" })
    lblState: Label = null;

    @property({ type: Node, tooltip: "显示信息按钮" })
    btnDetail: Node = null;

    @property({ type: Node, tooltip: "红点按钮" })
    ndRedPoint: Node = null;

    _data: SystemMailItem = null;

    initData(data: SystemMailItem) {
        this._data = data;
        this.lblRealName.string = data.title;
        this.lblState.string = data.create_time;
        this.lblIsLand.string = TextConfig.Friend_EmailSys;
        this.ndRedPoint.active = data.status !==1;
    }
}


