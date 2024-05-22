import { _decorator, Component, Node, Sprite } from 'cc';
import { MedalSimpleInfo } from '../achieve/AchieveDialogView';
import { LoadManager } from '../../manager/LoadManager';
const { ccclass, property } = _decorator;

@ccclass('MedalIconItem')
export class MedalIconItem extends Component {

    @property({ type: Sprite, tooltip: "奖章图片精灵" })
    imgMedal: Sprite = null;

    _data: MedalSimpleInfo = null;

    async initData(data: MedalSimpleInfo) {
        this._data = data;

        await LoadManager.loadSprite(data.icon, this.imgMedal).then(() => { },
            (error) => {
                // console.log("loadShowSprite->resource load failed:" + this._data.icon.skin + "," + error.message);
            });
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


