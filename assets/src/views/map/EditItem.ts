import { _decorator, Component, EventTouch, Label, Node, Sprite, SpriteFrame, UITransform, Vec2, Vec3 } from 'cc';
import { EventType } from '../../config/EventType';
import { MapConfig } from '../../config/MapConfig';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ItemID } from '../../export/ItemConfig';
import { DataMgr, EditInfo, EditType } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { SoundMgr } from '../../manager/SoundMgr';
import { ViewsMgr } from '../../manager/ViewsManager';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import { TimerMgr } from '../../util/TimerMgr';
import { ToolUtil } from '../../util/ToolUtil';
import { BuildingSellView } from './BuildingSellView';
const { ccclass, property } = _decorator;

export class EditItemInfo extends EditInfo {
    needBuilt: boolean = false;
    count: number = 0;

    public constructor(data: EditInfo) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.theme = data.theme;
        this.type = data.type;
        this.buy = data.buy;
        this.sell = data.sell;
        this.enable = data.enable;
        this.width = data.width;
        this.height = data.height;
        this.png = data.png;
        this.description = data.description;
        this.function = data.function;
        this.animation = data.animation;
        this.animpos = data.animpos;
        this.baseColor = data.baseColor;
    }
}

@ccclass('EditItem')
export class EditItem extends Component {
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Sprite)
    public imgIcon: Sprite = null;//国王分图标
    @property(Label)
    public labelScore: Label = null;//国王分
    @property(Label)
    public labelSize: Label = null;//大小
    @property(Node)
    public tipToBuilt: Node = null;//去建造提示
    @property(Node)
    public btnSell: Node = null;//出售按钮

    private _data: EditItemInfo = null;//数据
    private _clickCall: Function = null;//点击回调
    private _longTouchCall: Function = null;//长按回调
    private _uiTransform: UITransform = null;

    private _tmpPos: Vec2 = new Vec2();
    private _isLongTouch: boolean = false;//是否长按
    private _isMove: boolean = false;//是否移动
    private _timer: number = null;//定时器

    onLoad(): void {
        this.imgIcon.node.active = false;
        this.labelScore.node.active = false;
        this.tipToBuilt.active = false;

        this.initEvent();
    }
    get data(): EditItemInfo {
        return this._data;
    }
    // 初始化事件
    initEvent() {
        // CCUtil.onTouch(this.node, this.onItemClick, this);
        this.initTouchEvent();
        CCUtil.onTouch(this.btnSell, this.onBtnSellClick, this);
    }
    // 移除监听
    removeEvent() {
        // CCUtil.offTouch(this.node, this.onItemClick, this);
        this.removeTouchEvent();
        CCUtil.offTouch(this.btnSell, this.onBtnSellClick, this);
    }
    // 销毁
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化点击事件 */
    initTouchEvent() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    /**移除点击事件 */
    removeTouchEvent() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    // 初始化
    public initData(info: EditItemInfo, clickCall: Function, isTouchCall: Function): void {
        this._clickCall = clickCall;
        this._longTouchCall = isTouchCall;
        if (this._data == info) return;
        this._data = info;
        this.labelSize.string = ToolUtil.replace(TextConfig.Width_Height_Text, info.width, info.height);
        this.tipToBuilt.active = info.needBuilt;
        // TODO 国王分显示
        LoadManager.loadSprite(DataMgr.getEditPng(info), this.img).then((spriteFrame: SpriteFrame) => {
            // this.fixPos();
            this.fixImg();
        });
        this._uiTransform = this.node.getComponent(UITransform);
        this.btnSell.active = info.sell > 0;
    }
    /** 点击 */
    public onItemClick(): void {
        SoundMgr.click();
        if (this._clickCall) {
            this._clickCall(this);
        }
    }
    /**长按 */
    public onLongTouch(): void {
        if (this._longTouchCall) {
            this._longTouchCall(this);
        }
    }
    // 修复图片大小
    public fixImg(): void {
        let scale = new Vec3(1.0, 1.0, 1.0);
        let selfTransform = this.getComponent(UITransform);
        let transform = this.img.getComponent(UITransform);
        let scaleX = selfTransform.width / transform.width;
        let scaleY = selfTransform.height / transform.height;
        if (scaleX < 1.0 || scaleY < 1.0) {
            let minScale = Math.min(scaleX, scaleY);
            scale.x *= minScale;
            scale.y *= minScale;
        }
        this.img.node.scale = scale;
    }
    /**修复位置 */
    public fixPos(): void {
        let pos = new Vec3(0, 0, 0);
        if (EditType.Land == this._data.type) {
            let size = this.getComponent(UITransform).contentSize;
            pos.y = size.height * 0.5 - MapConfig.gridInfo.height;
        } else if (EditType.Decoration == this._data.type) {
            pos.y = 50;
        }
        this.img.node.position = pos;
    }
    /**卖出点击 */
    public onBtnSellClick(): void {
        ViewsMgr.showView(PrefabType.BuildingSellView, (node: Node) => {
            node.getComponent(BuildingSellView).init(this._data, this._data.count, (count: number) => {
                // let data = new EditItemInfo(this._data);
                // data.needBuilt = this._data.needBuilt;
                // data.count = count;
                this._data.count = count;
                ViewsMgr.showRewards([{ id: ItemID.coin, num: this._data.sell * count }]);
                EventMgr.emit(EventType.Building_Batch_Sell, this._data);
            });
        });
    }

    /* 点击开始 **/
    onTouchStart(e: EventTouch) {
        // console.log("onTouchStart", this._data.id);
        this._isLongTouch = false;
        this._isMove = false;
        this.clearTimer();
        if (EditType.Land == this._data.type) return;//地块没有长按
        this._timer = TimerMgr.once(() => {
            this._isLongTouch = true;
            this._timer = null;
            this.onLongTouch();
        }, 500);
    }
    /* 点击移动 **/
    onTouchMove(e: EventTouch) {
        if (!this.isTouchMoveEffective(e)) {
            return;
        }
        // console.log("onTouchMove", this._data.id);
        this.clearTimer();
        this._isMove = true;
    }
    /* 点击结束 **/
    onTouchEnd(e: EventTouch) {
        // console.log("onTouchEnd", this._data.id);
        if (this._isLongTouch || this._isMove) return;
        this.clearTimer();
        e.getLocation(this._tmpPos);
        if (this._uiTransform.hitTest(this._tmpPos, e.windowId)) {
            this.onItemClick();
        }
    }
    /* 点击取消 **/
    onTouchCancel(e: EventTouch) {
        // console.log("onTouchCancel", this._data.id, e.simulate);
        this.clearTimer();
    }
    /**清理定时器 */
    clearTimer(): void {
        if (this._timer) {
            TimerMgr.stop(this._timer);
            this._timer = null;
        }
    }
    /* 触摸移动有效**/
    isTouchMoveEffective(e: EventTouch): boolean {
        let touchMoveOffset = 1;
        e.getUIDelta(this._tmpPos);
        if (Math.abs(this._tmpPos.x) < touchMoveOffset &&
            Math.abs(this._tmpPos.y) < touchMoveOffset) {
            return false;
        }
        return true;
    }
}


