import { _decorator, error, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
import { BossInfo } from './BossInfo';
const { ccclass, property } = _decorator;

@ccclass('WorldLeftItem')
export class WorldLeftItem extends ListItem {

    @property(Node)
    public boss_img:Node = null;

    @property(Node)
    public  clearance_text:Node = null;

    

    start() {

    }

    

    updatePropsItem(info:BossInfo,index:number){
        ResLoader.instance.load(info.bossImage, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
                return;
            }
            this.boss_img.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }

    update(deltaTime: number) {
        
    }
}


