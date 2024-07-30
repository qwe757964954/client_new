import { _decorator, Component, Label, Node, Sprite } from 'cc';
import List from '../../../util/list/List';
const { ccclass, property } = _decorator;

@ccclass('GradeItem')
export class GradeItem extends Component {
    @property(Sprite)
    public bg: Sprite = null;
    @property(Label)
    public btnLabel: Label = null;

    public setData(data: any) {
        this.btnLabel.string = data.level;
    }

}


