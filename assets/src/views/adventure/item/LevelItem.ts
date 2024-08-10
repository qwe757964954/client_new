import { _decorator, isValid, Label, Node, Sprite } from 'cc';
import { EventType } from '../../../config/EventType';
import { EventMgr } from '../../../util/EventManager';
import List from '../../../util/list/List';
import ListItem from '../../../util/list/ListItem';
import { EducationGrade, EducationStage } from '../AdventureInfo';
import { GradeItem } from './GradeItem';
const { ccclass, property } = _decorator;

@ccclass('LevelItem')
export class LevelItem extends ListItem {
    @property(Sprite)
    public bg: Sprite = null;
    @property(Label)
    public levelLabel: Label = null;
    @property(List)
    public gradeList: List = null;

    public gradeDatas: EducationGrade[] = [];

    public setData(data: EducationStage) {
        this.gradeDatas = data.items;
        this.levelLabel.string = data.title;
        this.gradeList.numItems = this.gradeDatas.length;
    }

    onGradeListRender(item: Node, index: number) {
        let gradeItem = item.getComponent(GradeItem);
        gradeItem.setData(this.gradeDatas[index]);
    }
    onGradeListSelected(item: Node, selectedId: number) {
        if (isValid(item) && selectedId >= 0) {
            EventMgr.dispatch(EventType.Grade_Select_Event,this.gradeDatas[selectedId]);
        }
    }


}