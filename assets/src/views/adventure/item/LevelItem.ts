import { _decorator, Component, Label, Node, Sprite } from 'cc';
import List from '../../../util/list/List';
import { GradeItem } from './GradeItem';
const { ccclass, property } = _decorator;

@ccclass('LevelItem')
export class LevelItem extends Component {
    @property(Sprite)
    public bg: Sprite = null;
    @property(Label)
    public levelLabel: Label = null;
    @property(List)
    public gradeList: List = null;

    private _gradeDatas: any[] = [];

    public setData(data: any) {
        this.levelLabel.string = data.level;
        this.gradeList.numItems = this._gradeDatas.length;
    }

    onGradeListRender(item: Node, index: number) {
        let gradeItem = item.getComponent(GradeItem);
        gradeItem.setData(this._gradeDatas[index]);
    }
}


