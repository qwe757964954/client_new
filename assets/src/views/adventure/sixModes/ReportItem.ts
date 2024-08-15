import { _decorator, Label, Node, Sprite } from 'cc';
import { ItemID } from '../../../export/ItemConfig';
import { DataMgr, ItemData } from '../../../manager/DataMgr';
import { LoadManager } from '../../../manager/LoadManager';
import ListItem from '../../../util/list/ListItem';
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
    @property([Node])
    stars: Node[] = [];

    @property(Node)
    starNode: Node = null;

    start() {

    }

    updateItemProps(data: ItemData) {
        this.loadShow(data.id);
        this.num_text.string = `x${data.num}`;
        if (!data.from) {
            this.starNode.active = false;
        } else {
            this.starNode.active = true;
            if (data.from == "star_one_reward") { //一星奖励
                this.stars[0].active = true;
            } else if (data.from == "star_two_reward") { //二星奖励
                this.stars[0].active = true;
                this.stars[1].active = true;
            } else if (data.from == "star_three_reward") {
                this.stars[0].active = true;
                this.stars[1].active = true;
                this.stars[2].active = true;
            } else {
                this.starNode.active = false;
            }
        }
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


