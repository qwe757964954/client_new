import { Component, EventTouch, Prefab, ScrollView, _decorator, instantiate } from 'cc';
import { MapLevelData } from '../../models/AdventureModel';
import { UnitItemStatus, UnitListItemStatus } from '../../models/TextbookModel';
import CCUtil from '../../util/CCUtil';
import { MapPointItem } from '../adventure/levelmap/MapPointItem';
const { ccclass, property } = _decorator;

/**地图坐标对象 */
export interface MapCoordinate {
    x:number;
    y:number;
}

const MapCoordinates:MapCoordinate[] = [{x:225.147,y:238.611},
    {x:395.16,y:132.353},
    {x:318.654,y:-160.92},
    {x:532.824,y:-308.162},
    {x:768.746,y:-215.463},
    {x:976.223,y:-106.705},
    {x:1353.568,y:-124.166},
    {x:1621.942,y:-245.518},
    {x:1752.452,y:-46.406},
    {x:1593.867,y:215.336},
    {x:1798.642,y:291.26},
    {x:2065.9,y:261.275},
    {x:2376.174,y:248.894},
    {x:2564.246,y:39.744},
    {x:2527.896,y:-214.694},
    {x:2861.83,y:-288.257},
    {x:3136.398,y:-111.879},
    {x:3543.704,y:-128.415},
    {x:3781.401,y:-262.5},
    {x:3943.104,y:-2.273},
    {x:3782.435,y:214.591},
    {x:4016.711,y:287.407},
    {x:4249.277,y:263.091}]

@ccclass('ScrollMapView')
export class ScrollMapView extends Component {

    @property(ScrollView)
    mapScrollView:ScrollView = null;

    @property(Prefab)
    mapItemPrefab:Prefab = null;

    private _clickCallback:(unit:string)=>void = null;

    private _unitStatus:UnitItemStatus[] = null;

    start() {
    }

    update(deltaTime: number) {
        
    }
    /**添加地图单元点 */
    initUnit(unitStatus:UnitListItemStatus){
        this._unitStatus = unitStatus.data;
        for (let index = 0; index < unitStatus.data.length; index++) {
            const element = unitStatus.data[index];
            const mapCoord = MapCoordinates[index];
            let itemNode = instantiate(this.mapItemPrefab);
            let itemScript:MapPointItem = itemNode.getComponent(MapPointItem);
            itemScript.index = index;
            let smallId = index + 1;
            let data:MapLevelData = {big_id:1, small_id:smallId,micro_id:smallId};
            itemScript.initData(data);
            CCUtil.onTouch(itemNode, this.onItemClick, this);
            this.mapScrollView.content.addChild(itemNode);
            itemNode.setPosition(mapCoord.x,mapCoord.y,0);
        }
    }

    setClickCallback(callback:(unit:string)=>void){
        this._clickCallback = callback;
    }

    onItemClick(event:EventTouch){
        let item:MapPointItem = event.currentTarget.getComponent(MapPointItem);
        let index = item.index;
        console.log("onItemClick.....",index);
        let itemStatus = this._unitStatus[index];
        if(this._clickCallback){
            this._clickCallback(itemStatus.unit);
        }
    }
}


