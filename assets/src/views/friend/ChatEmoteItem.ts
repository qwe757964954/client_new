import { _decorator, Component, Node, Sprite } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('ChatEmoteItem')
export class ChatEmoteItem extends Component {
    @property({ type: Sprite, tooltip: "头像图片精灵" })
    bgIcon: Sprite = null;

    _bqId: number = 100;

    async initData(bqId: number) {
        this._bqId = bqId;
        let emotePath: string = "friend/" + bqId + "/spriteFrame";
        await LoadManager.loadSprite(emotePath, this.bgIcon).then(() => { },
            (error) => {
                // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
            });

        this.addEvent();
    }

    addEvent() {
        CCUtil.onTouch(this.node, this.onBqItemSelect, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.node, this.onBqItemSelect, this);
    }

    onBqItemSelect() {
        EventManager.emit(EventType.Friend_SelectEmotion, this._bqId);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


