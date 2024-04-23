import { _decorator, Label, Node } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

export interface RightNavItemData {
    name:string,
    isSelected:boolean
}

@ccclass('RightNavItem')
export class RightNavItem extends ListItem {
    @property(Node)
    public itembg:Node = null;
    @property(Node)
    public itemSelect:Node = null;
    @property(Label)
    public itemName:Label = null;

    public idx:number = 0;

    start() {

    }

    updateNavProps(idx:number,itemInfo:RightNavItemData){
        this.idx = idx;
        this.itemName.string = itemInfo.name;
        // this.itemSelect.active = itemInfo.isSelected;
    }}


