import { _decorator, error, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
import { AwardInfo } from './RightRankView';
const { ccclass, property } = _decorator;

export enum RewardType {
    Coin= "Coin",/**金币 */
    Diamond= "Diamond",/**钻石 */
    Stone= "Stone"/**体力 */
}

@ccclass('RewardItemView')
export class RewardItemView extends ListItem {
    @property(Node)
    public img_coin: Node = null;

    @property(Label)
    public amout_text: Label = null;
    start() {

    }
    updateRewardItem(info:AwardInfo){
        let icon_url = ""
        switch (info.type) {
            case RewardType.Coin:
                icon_url = "common/img_coin/spriteFrame";
                break;
            case RewardType.Diamond:
                icon_url = "common/img_diamond/spriteFrame";
                break;
            case RewardType.Stone:
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
        this.amout_text.string = info.value.toString();
    }
    update(deltaTime: number) {
        
    }
}


