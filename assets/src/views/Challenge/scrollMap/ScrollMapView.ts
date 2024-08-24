import { _decorator, Node } from 'cc';
import { EventType } from '../../../config/EventType';
import { TextConfig } from '../../../config/TextConfig';
import { ViewsManager } from '../../../manager/ViewsManager';
import { UnitItemStatus } from '../../../models/TextbookModel';
import { EventMgr } from '../../../util/EventManager';
import { TextbookMapPointItem } from '../../adventure/levelmap/TextbookMapPointItem';
import { BaseMapView } from './BaseMapView';

const { ccclass, property } = _decorator;

@ccclass('ScrollMapView')
export class ScrollMapView extends BaseMapView {
    public _curLevelIndex:number = 0;
    protected createItemNode(itemData: UnitItemStatus, unitCount: number): Node[] {
        let nodeArr:Node[] = []; 
        for (const gate of itemData.gate_list) {
            let itemNode = this.getItemNode();
            const itemScript = itemNode.getComponent(TextbookMapPointItem);
            itemScript.index = unitCount;
            itemScript.initUnitData({
                big_id: itemData.unit_name,
                small_id: gate.small_id,
                micro_id: gate.small_id,
                flag_info: gate.flag_info
            });
            nodeArr.push(itemNode);
            unitCount++;
        }
        return nodeArr;
    }

    protected gotoNextLevel() {
        const nextIndex = this._curLevelIndex + 1;
        if (nextIndex >= this._pointItems.length) {
            ViewsManager.showTip(TextConfig.All_level_Tip);
            return;
        }

        const nextItem = this._pointItems[nextIndex];
        const item = nextItem.getComponent(TextbookMapPointItem);
        this._curLevelIndex = item.index;
        const data = item.data;
        const itemStatus = this._unitStatus.find(status => status.unit_name === data.big_id);
        const unit = itemStatus.unit_list[data.small_id - 1];

        EventMgr.dispatch(EventType.Goto_Break_Through_Textbook_Next_Level, {
            itemStatus,
            unit,
            isNext: true
        });
    }
}
