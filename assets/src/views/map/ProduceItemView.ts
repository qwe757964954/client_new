import { _decorator, Component, Sprite } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
const { ccclass, property } = _decorator;

@ccclass('ProduceItemView')
export class ProduceItemView extends Component {
    @property([Sprite])
    public imgList: Sprite[] = [];//图片列表

    init(pngAry: string[]) {
        for (let i = 0; i < this.imgList.length; i++) {
            let sprite = this.imgList[i];
            let pngPath = pngAry[i];
            if (!pngPath) {
                sprite.node.active = false;
                continue;
            }
            sprite.node.active = true;
            LoadManager.loadSprite(pngPath, sprite);
        }
    }
}


