import { _decorator, error, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
import { AmoutItemData, AmoutType } from '../common/TopAmoutView';
const { ccclass, property } = _decorator;

@ccclass('RewardItemView')
export class RewardItemView extends ListItem {
    @property(Node)
    public img_coin: Node = null;

    @property(Label)
    public amout_text: Label = null;
    start() {

    }
    updateRewardItem(info:AmoutItemData){
        let icon_url = ""
        switch (info.type) {
            case AmoutType.Coin:
                icon_url = "common/img_coin/spriteFrame";
                break;
            case AmoutType.Diamond:
                icon_url = "common/img_diamond/spriteFrame";
                break;
            case AmoutType.Energy:
                icon_url = "common/img_energy/spriteFrame";
                break;
            default:
                break;
        }
        ResLoader.instance.load(icon_url, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
                return;
            }
            this.img_coin.getComponent(Sprite).spriteFrame = spriteFrame;
        });
        this.amout_text.string = info.num.toString();
    }
    update(deltaTime: number) {
        
    }
}


