import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { UnitData } from '../../../models/AdventureModel';
import CCUtil from '../../../util/CCUtil';
import { BaseView } from '../../../script/BaseView';
import { EventMgr } from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('UnitItem')
export class UnitItem extends BaseView {
    @property(Label)
    public unitTxt: Label = null;

    private _data: UnitData;

    setData(data: UnitData) {
        this._data = data;
        this.unitTxt.string = data.unit;
        this.getComponent(Sprite).grayscale = data.status == 0;
    }

    onClick() {
        EventMgr.dispatch(EventType.WordGame_Unit_Click, this._data)
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.node, this.onClick, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.node, this.onClick, this);
    }

}


