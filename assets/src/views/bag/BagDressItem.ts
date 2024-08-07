import { _decorator, error, isValid, Node, Sprite, SpriteFrame } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { ResLoader } from '../../manager/ResLoader';
import { User } from '../../models/User';
import CCUtil from '../../util/CCUtil';
import ListItem from '../../util/list/ListItem';
import { BagConfig } from './BagConfig';
import { BagClothingTypeMapping, BagGressItem, BagGressItemIds, BagItemInfo } from './BagInfo';
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
        const userClothes = BagClothingTypeMapping[data.id].userClothes;
        if (isValid(userClothes)) {
            let item_info:BagItemInfo = BagConfig.findShopItemInfo(userClothes);
            LoadManager.loadSprite(BagConfig.transformPath(item_info.png), this.icon.getComponent(Sprite)).then(() => {
                CCUtil.fixNodeScale(this.icon, 120, 120, true);
            });
        }else{
            ResLoader.instance.load(data.spriteFrame, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
                if (err) {
                    error && console.error(err);
                }
                this.icon.getComponent(Sprite).spriteFrame = spriteFrame;
            });
        }
    }
}

