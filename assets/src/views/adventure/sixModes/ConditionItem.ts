import { Label, Node, Sprite, _decorator } from 'cc';
import ListItem from '../../../util/list/ListItem';
import { ClearanceConditionsConfig } from './WordReportView';
const { ccclass, property } = _decorator;

@ccclass('ConditionItem')
export class ConditionItem extends ListItem {
    @property(Node)
    public icon_star:Node = null

    @property(Node)
    public answer_icon:Node = null

    @property(Label)
    public title_txt:Label = null

    start() {

    }

    update(deltaTime: number) {
        
    }

    updateItemProps(idx: number, data:any){
        const key = Object.keys(ClearanceConditionsConfig)[idx];
        this.title_txt.string = ClearanceConditionsConfig[key];
        const value = data[key] === 1;
        this.icon_star.getComponent(Sprite).grayscale = !value;
        this.answer_icon.active = value;
    }
}


