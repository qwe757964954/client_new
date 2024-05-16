import { _decorator, error, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
import { TipItemInfo } from './GrammarTrainingView';
const { ccclass, property } = _decorator;

@ccclass('GrammarTipItem')
export class GrammarTipItem extends ListItem {

    @property(Node)
    public item_bg:Node = null;

    @property(Node)
    public lamp:Node = null;

    @property(Label)
    public tip:Label = null;

    start() {

    }

    updatePropsItem(info:TipItemInfo){
        this.tip.string = info.tip;
        ResLoader.instance.load(info.bg, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
                return;
            }
            this.item_bg.getComponent(Sprite).spriteFrame = spriteFrame;
        });
        ResLoader.instance.load(info.lamp, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
                return;
            }
            this.lamp.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }
}


