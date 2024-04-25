import { _decorator, Label, Node } from 'cc';
import ListItem from '../../util/list/ListItem';
import { TabItemData } from './TabTopView';
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
    updateItemProps(idx: number,itemInfo:TabItemData) {
        this.idx = idx;
        this.tab_name.string = itemInfo.name;
        this.tab_focus.active = itemInfo.isSelected;
        // this.tab_name.color = itemInfo.isSelected? color("#f9b600") : color("#DFC49F");
    }
    update(deltaTime: number) {
        
    }
}


