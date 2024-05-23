import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { EmailDataInfo, EmailItemClickInfo } from '../../models/FriendModel';
import { TextConfig } from '../../config/TextConfig';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('EmailListItem')
export class EmailListItem extends Component {
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

    @property({ type: [SpriteFrame], tooltip: "背景页的图片数组" }) // 0:选中 1: 未选中
    public sprBgAry: SpriteFrame[] = [];

    _data: EmailDataInfo = null;

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

    initData(data: EmailDataInfo, selectEmail: EmailDataInfo) {
        this._data = data;

        this.lblRealName.string = data.FromName;
        this.lblState.string = data.createtime;
        this.lblIsLand.string = TextConfig.Friend_EmailSys;

        let bSelect: boolean = false; //本单位是否选中
        if (!selectEmail) {
            bSelect = false;
        }
        else if (data == selectEmail) {
            bSelect = true;
        }
        this.imgBg.spriteFrame = bSelect ? this.sprBgAry[0] : this.sprBgAry[1];
        this.node.getChildByName("canRecIcon").active = data.RecFlag == 0;
    }

    /**点击邮件列表中的一项 */
    onItemClick() {
        let data: EmailItemClickInfo = {
            info: this._data,
            node: this.node,
        }
        EventManager.emit(EventType.Friend_ClickEmailList, data);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


