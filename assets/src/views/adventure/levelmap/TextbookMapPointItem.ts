import { _decorator } from 'cc';
import { MapLevelData } from '../../../models/AdventureModel';
import { ObjectUtil } from '../../../util/ObjectUtil';
import { BaseMapPointItem } from './BaseMapPointItem';

const { ccclass, property } = _decorator;

@ccclass('TextbookMapPointItem')
export class TextbookMapPointItem extends BaseMapPointItem {
    public index:number = 0;
    initUnitData(data: MapLevelData) {
        this.data = data;
        const big_id = ObjectUtil.extractId(data.big_id);
        this.levelLabel.string = `${big_id}-${data.small_id}`;
        this.initStars(data.flag_info);
    }
}
