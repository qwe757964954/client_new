import { _decorator, Color, Component, Label, Node } from 'cc';
import { TabItemData } from './TabContentView';
const { ccclass, property } = _decorator;

@ccclass('TabTopItem')
export class TabTopItem extends Component {
    @property(Label)
    public tab_name:Label = null;          // tab名字
    @property(Node)
    public tab_focus:Node = null;          // tab标签
    start() {

    }
    updateItemProps(idx: number,itemInfo:TabItemData) {
        this.tab_name.string = itemInfo.name;
        this.tab_focus.active = itemInfo.isSelected;
        this.tab_name.color = itemInfo.isSelected? Color.WHITE  : Color.GREEN;
    }
    update(deltaTime: number) {
        
    }
}


