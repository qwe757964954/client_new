import { _decorator, Node, Sprite } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('ComicPageItem')
export class ComicPageItem extends ListItem {

    @property(Node)
    public img:Node = null;

    start() {

    }

    async updateComicProps(idx:number) {
        let id = idx % 2 === 0 ? 1 : 2;
        let emotePath: string = "theme/huahua" + id + "/spriteFrame";
        try {
            await LoadManager.loadSprite(emotePath, this.img.getComponent(Sprite));
        } catch (error) {
            console.error(`Failed to load avatar sprite: ${emotePath}`, error);
        }
    }
}

