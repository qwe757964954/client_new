import { _decorator, Component, Label, Sprite, SpriteFrame, Node } from 'cc';
import { DataMgr, PropData } from '../../manager/DataMgr';
import { PropID } from '../../config/PropConfig';
import { LoadManager } from '../../manager/LoadManager';
import { RewardItemType } from './RewardItem';
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
    loadShow(propID: PropID) {
        if (!propID) return;
        let propInfo = DataMgr.getPropInfo(propID);
        if (!propInfo) return;
        LoadManager.loadSprite(propInfo.png, this.propIcon);
    }

}


