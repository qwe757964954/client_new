import { _decorator, Label, Node, Toggle } from 'cc';
import ListItem from '../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('AchievementMedalstem')
export class AchievementMedalstem extends ListItem {
    @property(Node)
    public icon_name: Node = null;
    @property(Label)
    public achievement_name: Label = null;
    @property(Toggle)
    public achievement_toggle: Toggle = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}

