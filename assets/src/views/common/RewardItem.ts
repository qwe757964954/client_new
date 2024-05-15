import { _decorator, Component, Label, Sprite } from 'cc';
import { DataMgr, RewardInfo } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
const { ccclass, property } = _decorator;

@ccclass('RewardItem')
export class RewardItem extends Component {
    @property(Sprite)
    public frame: Sprite = null;//框
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Label)
    public num: Label = null;//数量

    init(data: RewardInfo) {
        let propInfo = DataMgr.getPropInfo(data.id);
        // console.log("RewardItem init data = ", propInfo.id, propInfo.frame, propInfo.png);
        LoadManager.loadSprite(propInfo.frame, this.frame);
        LoadManager.loadSprite(propInfo.png, this.img);
        this.num.string = data.num.toString();
    }
}


