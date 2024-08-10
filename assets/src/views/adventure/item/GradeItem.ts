import { _decorator, Color, Label, Node } from 'cc';
import ListItem from '../../../util/list/ListItem';
import { EducationGrade } from '../AdventureInfo';
const { ccclass, property } = _decorator;

@ccclass('GradeItem')
export class GradeItem extends ListItem {
    @property(Label)
    public btnLabel: Label = null;

    @property(Node)
    public selectNode: Node = null;

    public setData(data: EducationGrade) {
        this.btnLabel.string = data.title;
    }
    setSelectColor(){
        this.btnLabel.color = Color.WHITE;
    }

    setNormalColor(){
        this.btnLabel.color = new Color("#d6bc99");
    }
}


