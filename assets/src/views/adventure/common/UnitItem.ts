import { _decorator, Label, Sprite } from 'cc';
import { UnitData } from '../../../models/AdventureModel';
import ListItem from '../../../util/list/ListItem';
const { ccclass, property } = _decorator;

@ccclass('UnitItem')
export class UnitItem extends ListItem {
    @property(Label)
    public unitTxt: Label = null;

    private _data: UnitData;

    setData(data: UnitData) {
        this._data = data;
        this.unitTxt.string = data.unit;
        this.getComponent(Sprite).grayscale = data.status == 0;
    }
}


