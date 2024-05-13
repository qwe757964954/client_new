import { _decorator, error, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('RightRankItem')
export class RightRankItem extends ListItem {
    @property(Node)
    public rank_img:Node = null;

    @property(Label)
    public name_text:Label = null;

    @property(Label)
    public scroll_text:Label = null;

    start() {

    }

    updateRankItem(idx:number) {
        this.rank_img.active = idx<3;
        if(idx <3){
            let count = idx + 1;
            let img_url = `worldBoss/top${count}/spriteFrame`
            ResLoader.instance.load(img_url, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
                if (err) {
                    error && console.error(err);
                    return;
                }
                this.rank_img.getComponent(Sprite).spriteFrame = spriteFrame;
            });
        }
    }
}


