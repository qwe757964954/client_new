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

    updateItemProps(key: string, value:number){
        this.title_txt.string = ClearanceConditionsConfig[key];
        this.icon_star.getComponent(Sprite).grayscale = value === 0;
        this.answer_icon.active = value === 1;
    }
}


