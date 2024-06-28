import { _decorator, Sprite } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('ChatEmoteItem')
export class ChatEmoteItem extends ListItem {
    @property({ type: Sprite, tooltip: "头像图片精灵" })
    bgIcon: Sprite = null;

    _bqId: number = 100;
    async initData(bqId: number) {
        this._bqId = bqId;
        let emotePath: string = "friend/" + bqId + "/spriteFrame";
        try {
            await LoadManager.loadSprite(emotePath, this.bgIcon);
        } catch (error) {
            console.error(`Failed to load avatar sprite: ${emotePath}`, error);
        }
    }
}


