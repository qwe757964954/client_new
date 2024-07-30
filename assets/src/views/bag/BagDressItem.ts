import { _decorator, error, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import { User } from '../../models/User';
import ListItem from '../../util/list/ListItem';
import { BagGressItem, BagGressItemIds } from './BagInfo';
const { ccclass, property } = _decorator;

@ccclass('BagDressItem')
export class BagDressItem extends ListItem {
    @property(Node)
    public icon:Node = null;
    start() {

    }

    updateTabProps(data:BagGressItem){
        if(data.id === BagGressItemIds.Hair){
            data.spriteFrame = User.gender === 1 ? "Bag/icon_hair_boy/spriteFrame" : "Bag/icon_hair_ girl/spriteFrame";
        }
        ResLoader.instance.load(data.spriteFrame, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
            }
            this.icon.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }
}

