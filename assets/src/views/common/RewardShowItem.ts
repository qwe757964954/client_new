import { _decorator, Label, Sprite } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr, ItemData } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import ListItem from '../../util/list/ListItem';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;

@ccclass('RewardShowItem')
export class RewardShowItem extends ListItem {
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Label)
    public num: Label = null;//数量

    init(data: ItemData) {
        let propInfo = DataMgr.getItemInfo(data.id);
        LoadManager.loadSprite(propInfo.png, this.img);
        this.num.string = ToolUtil.replace(TextConfig.Prop_Show, data.num);
    }
}


