import { _decorator, Node } from 'cc';
import { EventType } from '../../../config/EventType';
import { TextConfig } from '../../../config/TextConfig';
import { ViewsManager } from '../../../manager/ViewsManager';
import { GateData } from '../../../models/AdventureModel';
import { EventMgr } from '../../../util/EventManager';
import { MapPointItem } from '../../adventure/levelmap/MapPointItem';
import { BaseMapView } from './BaseMapView';

const { ccclass, property } = _decorator;

@ccclass('ScrollWordMapView')
export class ScrollWordMapView extends BaseMapView {

    protected createItemNode(itemData: GateData, unitCount: number): Node[] {
        let nodeArr:Node[] = []; 
        let itemNode = this.getItemNode();
        const itemScript = itemNode.getComponent(MapPointItem);
        itemScript.index = unitCount;
        itemScript.initUnitData(itemData);
        if (unitCount === this._passGrade) {
            itemScript.showPlayerAndPet();
        }
        if (unitCount === this._totalGrade - 1) {
            itemScript.initBoss();
        }
        nodeArr.push(itemNode);
        return nodeArr;
    }

    protected gotoNextLevel() {
        const nextIndex = this._curLevelIndex + 1;
        if (nextIndex >= this._pointItems.length) {
            ViewsManager.showTip(TextConfig.All_level_Tip);
            return;
        }
        const nextItem = this._pointItems[nextIndex];
        const item = nextItem.getComponent(MapPointItem);
        this._curLevelIndex = item.index;
        EventMgr.dispatch(EventType.Goto_Module_Next_Level,this._unitStatus[this._curLevelIndex]);
    }
}
