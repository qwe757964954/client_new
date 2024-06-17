import { _decorator, Component, Sprite } from 'cc';
import { DataMgr } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
const { ccclass, property } = _decorator;

@ccclass('PetMoodView')
export class PetMoodView extends Component {
    @property(Sprite)
    public img: Sprite = null;//图片

    private _moodID: number = null;//心情id

    init(moodScore: number) {
        let config = DataMgr.getMoodConfig(moodScore);
        if (config) {
            if (config.id == this._moodID) return;
            this._moodID = config.id;
            LoadManager.loadSprite(config.png, this.img);
        }
    }
}


