import { _decorator, error, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
import { BagGressItem } from './BagInfo';
const { ccclass, property } = _decorator;

@ccclass('BagDressItem')
export class BagDressItem extends ListItem {
    @property(Node)
    public icon:Node = null;
    start() {

    }

    updateTabProps(data:BagGressItem){
        ResLoader.instance.load(data.spriteFrame, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
            }
            this.icon.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }
}

