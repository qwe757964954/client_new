import { _decorator, Label, Node } from 'cc';
import { BookItemData } from '../../models/TextbookModel';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('TabTopItem')
export class TabTopItem extends ListItem {
    @property(Label)
    public tab_name:Label = null;          // tab名字
    @property(Node)
    public tab_focus:Node = null;          // tab标签
    public idx:number = 0; //
    start() {
        
    }
    updateItemProps(idx: number,itemInfo:BookItemData) {
        this.idx = idx;
        this.tab_name.string = itemInfo.name;
    }
    update(deltaTime: number) {
        
    }
}


