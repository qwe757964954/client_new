import { Component, Label, Node, Sprite, SpriteFrame, _decorator } from 'cc';
import { ItemID } from '../../export/ItemConfig';
import { DataMgr } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
const { ccclass, property } = _decorator;

@ccclass('BaseItem')
export class BaseItem extends Component {

    @property({ type: [SpriteFrame], tooltip: "背景资源" })
    public bgRes: SpriteFrame[] = [];
    @property({ type: Sprite, tooltip: "道具icon" })
    public propIcon: Sprite = null;
    @property({ type: Label, tooltip: "数量" })
    public numTxt: Label = null;
    @property({ type: [Node], tooltip: "星星" })
    public allStars: Node[] = [];

    setData(data: { id: number, num: number, star: number }) {
        this.loadShow(data.id);
        this.numTxt.string = data.num.toString();
        for (let i = 0; i < 3; i++) {
            this.allStars[i].active = i < data.star;
        }
    }

    /**加载显示 */
    loadShow(itemID: ItemID) {
        if (!itemID) return;
        let itemInfo = DataMgr.getItemInfo(itemID);
        if (!itemInfo) return;
        LoadManager.loadSprite(itemInfo.png, this.propIcon);
    }

}


