import { _decorator, error, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../../manager/ResLoader';
import ListItem from '../../../util/list/ListItem';
import { ItemID } from '../../../export/ItemConfig';
import { DataMgr, ItemData } from '../../../manager/DataMgr';
import { LoadManager } from '../../../manager/LoadManager';
const { ccclass, property } = _decorator;

export enum ReportItemType {
    coin = "coin",/**金币 */
    diamond = "diamond",/**钻石 */
}


@ccclass('ReportItem')
export class ReportItem extends ListItem {

    @property(Sprite)
    public icon: Sprite = null;

    @property(Label)
    public num_text: Label = null;

    start() {

    }

    updateItemProps(data: ItemData) {
        this.loadShow(data.id);
        this.num_text.string = `x${data.num}`;
    }

    /**加载显示 */
    loadShow(propID: ItemID) {
        if (!propID) return;
        let propInfo = DataMgr.getItemInfo(propID);
        // console.log("loadShow", propInfo);
        if (!propInfo) return;
        LoadManager.loadSprite(propInfo.png, this.icon);
    }
}


