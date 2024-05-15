import { _decorator, error, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('GrammarTrainingItem')
export class GrammarTrainingItem extends ListItem {
    @property(Node)
    public item_bg:Node = null;

    


    start() {

    }

    updatePropsItem(bgUrl:string) {
        ResLoader.instance.load(bgUrl, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
                return;
            }
            this.item_bg.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }
}


