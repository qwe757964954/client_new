import { _decorator, Label, Node } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('ComicLandItem')
export class ComicLandItem extends ListItem {

    @property(Label)
    public theme:Label = null;

    @property(Label)
    public landName:Label = null;

    @property(Label)
    public sureTxt:Label = null;

    @property(Label)
    public wordNums:Label = null;

    @property(Node)
    public item_img:Node = null;

    @property(Node)
    public finish:Node = null;

    start() {

    }

    update(deltaTime: number) {
        
    }
}

