import { _decorator, Node } from 'cc';
import { GateData } from '../../../models/AdventureModel';
import { MapPointItem } from '../../adventure/levelmap/MapPointItem';
import { BaseMapView } from './BaseMapView';

const { ccclass, property } = _decorator;

@ccclass('ScrollWordMapView')
export class ScrollWordMapView extends BaseMapView {

    protected createItemNode(itemData: GateData, unitCount: number): Node[] {
        let nodeArr:Node[] = []; 
        let itemNode = this.getItemNode();
        const itemScript = itemNode.getComponent(MapPointItem);
        itemScript.initUnitData(itemData);
        itemScript.clearAni();
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
        
    }
}
