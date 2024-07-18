import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { UnitWord } from '../../../models/AdventureModel';
import RemoteImageManager from '../../../manager/RemoteImageManager';
import { NetConfig } from '../../../config/NetConfig';
const { ccclass, property } = _decorator;

@ccclass('ThemeWordItem')
export class ThemeWordItem extends Component {
    @property(Sprite)
    public wordImg: Sprite = null;
    @property(Label)
    public wordLabel: Label = null;
    @property(Label)
    public symbolLable: Label = null;
    @property(Label)
    public cnLabel: Label = null;
    private _data: any;
    start() {

    }

    initData(data: UnitWord) {
        this._data = data;
        this.wordImg.spriteFrame = null;
        if (data.image_url) {
            RemoteImageManager.i.loadImage(data.image_url, this.wordImg);
        } else {
            const imgUrl = `${NetConfig.assertUrl}/imgs/words/${data.word}.jpg`;
            RemoteImageManager.i.loadImage(imgUrl, this.wordImg);
        }
        this.wordLabel.string = data.word;
        this.symbolLable.string = data.symbol;
        this.cnLabel.string = data.cn;
    }
}


