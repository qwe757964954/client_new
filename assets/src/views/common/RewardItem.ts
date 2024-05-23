import { _decorator, CCInteger, Component, Enum, Label, Sprite } from 'cc';
import { DEV } from 'cc/env';
import { PropID } from '../../config/PropConfig';
import { DataMgr, PropData } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
const { ccclass, property, executeInEditMode } = _decorator;

export enum RewardItemType {
    Normal = 0,//显示底框，图片和数量
    Png = 1,//只显示图片
    PngNum = 2,//只显示图片和数量
}

@ccclass('RewardItem')
@executeInEditMode(true)
export class RewardItem extends Component {
    @property(Sprite)
    public frame: Sprite = null;//框
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Label)
    public num: Label = null;//数量

    public _type: RewardItemType = RewardItemType.Normal;
    @property({ type: Enum(RewardItemType), tooltip: DEV && "奖励显示类型" })
    public get type(): RewardItemType {
        return this._type;
    }
    public set type(val: RewardItemType) {
        this._type = val;
    }
    public _propID: PropID = null;
    @property({ type: Enum(PropID), tooltip: DEV && "道具ID" })
    public get propID(): PropID {
        return this._propID;
    }
    public set propID(val: PropID) {
        this._propID = val;
    }
    public _count: number = 0;
    @property({ type: CCInteger, tooltip: DEV && "数量", visible() { return this._type != RewardItemType.Png } })
    public get count(): number {
        return this._count;
    }
    public set count(val: number) {
        this._count = val;
        if (this.num) {
            this.num.string = val.toString();
        }
    }

    protected start(): void {
        this.loadShow(this.propID);
    }

    init(data: PropData) {
        // console.log("RewardItem init data = ", propInfo.id, propInfo.frame, propInfo.png);
        this.loadShow(data.id);
        this.num.string = data.num.toString();
    }
    /**加载显示 */
    loadShow(propID: PropID) {
        if (!propID) return;
        let propInfo = DataMgr.getPropInfo(propID);
        if (!propInfo) return;
        LoadManager.loadSprite(propInfo.png, this.img);
        if (this._type == RewardItemType.Normal) {
            LoadManager.loadSprite(propInfo.frame, this.frame);
        }
    }
}


