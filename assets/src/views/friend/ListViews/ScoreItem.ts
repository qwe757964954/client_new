import { _decorator, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../../manager/ResLoader';
import ListItem from '../../../util/list/ListItem';
import { PlayerInfoResources } from '../FriendInfo';
const { ccclass, property } = _decorator;

@ccclass('ScoreItem')
export class ScoreItem extends ListItem {

    @property(Node)
    public bg:Node = null;

    @property(Label)
    public title:Label = null;

    @property(Label)
    public score:Label = null;
    start() {

    }

    update(deltaTime: number) {
        
    }

    public async updatePropsInfo(idx:number){
        let url = PlayerInfoResources[idx].url;
        const spriteFrame = await ResLoader.instance.loadAsyncPromise<SpriteFrame>("resources", url, SpriteFrame) as SpriteFrame;
        const sprite = this.bg.getComponent(Sprite);
        if (sprite) {
            sprite.spriteFrame = spriteFrame;
        }
        this.title.string = PlayerInfoResources[idx].title;
    }

}

