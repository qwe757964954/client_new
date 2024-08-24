import { _decorator } from 'cc';
import { EventType } from '../../../config/EventType';
import { MapLevelData } from '../../../models/AdventureModel';
import { EventMgr } from '../../../util/EventManager';
import { ObjectUtil } from '../../../util/ObjectUtil';
import { BaseMapPointItem } from './BaseMapPointItem';

const { ccclass, property } = _decorator;

@ccclass('TextbookMapPointItem')
export class TextbookMapPointItem extends BaseMapPointItem {
    public data: MapLevelData = null;
    public index:number = 0;
    protected onItemClick() {
        EventMgr.dispatch(EventType.Goto_Textbook_Level, this.data);
    }

    initUnitData(data: MapLevelData) {
        this.data = data;
        const big_id = ObjectUtil.extractId(data.big_id);
        this.levelLabel.string = `${big_id}-${data.small_id}`;
        this.initStars(data.flag_info);
    }
}
