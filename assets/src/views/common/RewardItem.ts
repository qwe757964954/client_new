import { _decorator, Color, Enum, Label, Node, Sprite, UITransform } from 'cc';
import { DEV } from 'cc/env';
import { itemEventKey } from '../../config/EventType';
import { ItemID } from '../../export/ItemConfig';
import { DataMgr, ItemData } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { User } from '../../models/User';
import { EventMgr } from '../../util/EventManager';
import ListItem from '../../util/list/ListItem';
const { ccclass, property, executeInEditMode } = _decorator;

export enum RewardItemType {
    Normal = 0,//显示底框，图片和数量
    Png = 1,//只显示图片
    PngNum = 2,//只显示图片和数量
}

export enum RewardItemNumType {
    Normal = 0,//右下角显示数量
    HasNum = 1,//下方显示自身数量与需要数量
}

const defaultFramePath = "common/img_bg_item1/spriteFrame";
const labelColors: string[] = ["#00FF00", "#FF0000"];

@ccclass('RewardItem')
@executeInEditMode(true)
export class RewardItem extends ListItem {
    @property(Sprite)
    public frame: Sprite = null;//框
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Node)
    public wearing_flag = null;
    @property(Label)
    public num: Label = null;//数量
    @property(Label)
    public labelNum: Label = null;//需要数量
    @property(Label)
    public labelUserNum: Label = null;//已有数量

    public _type: RewardItemType = RewardItemType.Normal;
    @property({ type: Enum(RewardItemType), tooltip: DEV && "奖励显示类型" })
    public get type(): RewardItemType {
        return this._type;
    }
    public set type(val: RewardItemType) {
        this._type = val;
    }
    public _numType: RewardItemNumType = RewardItemNumType.Normal;
    @property({ type: Enum(RewardItemNumType), tooltip: DEV && "数量显示类型" })
    public get numType(): RewardItemNumType {
        return this._numType;
    }
    public set numType(val: RewardItemNumType) {
        this._numType = val;
    }

    // public _propID: ItemID = null;
    // @property({ type: Enum(ItemID), tooltip: DEV && "道具ID" })
    // public get propID(): ItemID {
    //     return this._propID;
    // }
    // public set propID(val: ItemID) {
    //     this._propID = val;
    // }
    // public _count: number = 0;
    // @property({ type: CCInteger, tooltip: DEV && "数量", visible() { return this._type != RewardItemType.Png } })
    // public get count(): number {
    //     return this._count;
    // }
    // public set count(val: number) {
    //     this._count = val;
    //     if (this.num) {
    //         this.num.string = val.toString();
    //     }
    // }

    private _itemID: ItemID = null;
    private _itemCount: number = 0;
    private _eventHandle: string = null;

    protected start(): void {
        // this.loadShow(this.propID);
    }

    init(data: ItemData, numType?: RewardItemNumType) {
        // console.log("RewardItem init data = ", data.id);
        this.removeItemEvent();
        this._itemID = data.id;
        this._itemCount = data.num;
        if (null != numType) {
            this._numType = numType;
        }
        this.loadShow(data.id);
        this.showCountLabel();
        const userClothesIds = Object.values(User.userClothes)
            .filter((id): id is number => id !== null);
        this.wearing_flag.active = userClothesIds.includes(this._itemID);
    }
    /**加载显示 */
    loadShow(propID: ItemID) {
        if (!propID) return;
        let propInfo = DataMgr.getItemInfo(propID);
        // console.log("loadShow", propInfo);
        if (!propInfo) return;
        LoadManager.loadSprite(propInfo.png, this.img);
        if (this._type == RewardItemType.Normal) {
            LoadManager.loadSprite(propInfo.frame, this.frame);
        }
    }
    private showCountLabel() {
        if (RewardItemNumType.Normal == this._numType) {
            this.labelNum.node.active = false;
            this.labelUserNum.node.active = false;
            this.num.node.active = true;
            this.num.string = this._itemCount.toString();
        } else {
            this.labelNum.node.active = true;
            this.labelUserNum.node.active = true;
            this.num.node.active = false;
            this.labelNum.string = "/" + this._itemCount.toString();
            this.labelNum.updateRenderData();
            let userCount = User.getItem(this._itemID);
            if (userCount >= this._itemCount) {
                this.labelUserNum.color = new Color(labelColors[0]);
            } else {
                this.labelUserNum.color = new Color(labelColors[1]);
            }
            if (userCount > 999) {
                this.labelUserNum.string = "999+";
            } else {
                this.labelUserNum.string = userCount.toString();
            }
            let width = this.labelNum.node.getComponent(UITransform).width;
            let pos = this.labelNum.node.position.clone();
            pos.x = pos.x - width;
            this.labelUserNum.node.position = pos;
            this.initItemEvent();
        }
    }
    initByPng(pngPath: string, num?: number, framePath?: string) {
        LoadManager.loadSprite(pngPath, this.img);
        this._numType = RewardItemNumType.Normal;
        if (null != num) {
            this._itemCount = num;
            this.showCountLabel();
        }
        if (this._type == RewardItemType.Normal) {
            if (framePath) {
                LoadManager.loadSprite(framePath, this.frame);
            } else {
                LoadManager.loadSprite(defaultFramePath, this.frame);
            }
        }
    }

    initItemEvent() {
        if (this._eventHandle || null == this._itemID) return;
        this._eventHandle = EventMgr.on(itemEventKey(this._itemID), this.showCountLabel.bind(this));
    }
    removeItemEvent() {
        if (!this._eventHandle || null == this._itemID) return;
        EventMgr.off(itemEventKey(this._itemID), this._eventHandle);
        this._eventHandle = null;
    }
    onDestroy(): void {
        this.removeItemEvent();
    }
}


