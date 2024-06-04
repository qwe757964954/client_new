import { _decorator, error, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('WorldMapItem')
export class WorldMapItem extends ListItem {

    @property(Node)
    public icon: Node = null;
    start() {

    }

    updateItemProps(idx: number, currentPass: number) {
        let img_url = `adventure/worldMap/img_map_${idx}/spriteFrame`
        ResLoader.instance.load(img_url, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let sp = this.icon.getComponent(Sprite);
            sp.spriteFrame = spriteFrame;
            sp.grayscale = (idx > currentPass - 1);
        });
    }
}


