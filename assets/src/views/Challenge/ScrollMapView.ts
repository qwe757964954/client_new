import { Component, Node, Prefab, ScrollView, Sprite, SpriteFrame, UITransform, Vec2, _decorator, instantiate } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import { MapLevelData } from '../../models/AdventureModel';
import { GateListItem, UnitItemStatus, UnitListItemStatus } from '../../models/TextbookModel';
import CCUtil from '../../util/CCUtil';
import ImgUtil from '../../util/ImgUtil';
import { MapPointItem } from '../adventure/levelmap/MapPointItem';
const { ccclass, property } = _decorator;

/**地图坐标对象 */
export interface MapCoordinate {
    x:number;
    y:number;
}
const mapWidth = 2190;
/*
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
*/
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
    {x:2065.9,y:261.275}]

@ccclass('ScrollMapView')
export class ScrollMapView extends Component {

    @property(ScrollView)
    mapScrollView:ScrollView = null;

    @property(Prefab)
    mapItemPrefab:Prefab = null;

    private _clickCallback:(itemStatus:UnitItemStatus,gate:GateListItem)=>void = null;

    private _unitStatus:UnitItemStatus[] = null;
    private _pointItems: Node[] = [];
    start() {
    }

    update(deltaTime: number) {
        
    }

    async loadMapItems() {
        this.removePointEvent();
        let map_count = 0;
        let unit_count = 0;
        for (let i = 0; i < this._unitStatus.length; i++) {
            const itemData:UnitItemStatus = this._unitStatus[i];
            for (let j = 0; j < itemData.gate_list.length; j++) {
                const gate:GateListItem = itemData.gate_list[j];
                const index = unit_count % MapCoordinates.length;
                const xOffset = Math.floor(unit_count / MapCoordinates.length) * mapWidth;
                const point: MapCoordinate = {
                    x: MapCoordinates[index].x + xOffset,
                    y: MapCoordinates[index].y
                };
                let itemNode = instantiate(this.mapItemPrefab);
                let itemScript:MapPointItem = itemNode.getComponent(MapPointItem);
                itemScript.index = index;
                const stringWithoutUnit: string = itemData.unit.replace("Unit ", "").trim();
    
                let data:MapLevelData = {big_id:parseInt(stringWithoutUnit), small_id:gate.small_id,micro_id:gate.small_id};
                itemScript.initData(data);
                CCUtil.onBtnClick(itemNode,()=>{
                    this.onItemClick(itemNode);
                });
                this.mapScrollView.content.addChild(itemNode);
                itemNode.setSiblingIndex(99);
                itemNode.setPosition(point.x,point.y,0);
                this._pointItems.push(itemNode);
                let mapNode = this.mapScrollView.content.getChildByName(`bg_map_${map_count}`);
                let uiTransform = mapNode.getComponent(UITransform);
                let pos_2d = new Vec2(point.x,point.y);
                if (uiTransform && !uiTransform.getBoundingBox().contains(pos_2d)) {
                    map_count++;
                    await this.addMapBg(map_count);
                }
                unit_count++;
            }
        }
    }

    /**添加地图单元点 */
    async initUnit(unitStatus:UnitListItemStatus){
        this._unitStatus = unitStatus.unit_list;
        this.loadMapItems();
    }

    addMapBg(count:number){
        return new Promise<void>((resolve, reject) => {
            ResLoader.instance.load("adventure/bg/long_background/bg_map_01/spriteFrame", SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
                if (err) {
                    reject(err);
                } else {
                    let nd: Node = ImgUtil.create_2DNode(`bg_map_${count}`);
                    nd.addComponent(Sprite).spriteFrame = spriteFrame;
                    let uiTrans: UITransform = nd.getComponent(UITransform);
                    uiTrans.anchorPoint = new Vec2(0, 0.5);
                    this.mapScrollView.content.addChild(nd);
                    nd.setSiblingIndex(1);
                    let uiTransform = this.mapScrollView.content.getComponent(UITransform);
                    uiTransform.width = uiTrans.width * (count + 1);
                    nd.setPosition(uiTrans.width * count, 0, 0);
                    resolve();
                }
            });
        });
    }

    setClickCallback(callback:(itemStatus:UnitItemStatus,gate:GateListItem)=>void){
        this._clickCallback = callback;
    }

    onItemClick(point: Node){
        let item:MapPointItem = point.getComponent(MapPointItem);
        let data = item.data;
        let itemStatus:UnitItemStatus = this._unitStatus[data.big_id - 1];
        let small_id = data.small_id;
        let gate:GateListItem = itemStatus.gate_list[small_id - 1];
        if(this._clickCallback){
            this._clickCallback(itemStatus,gate);
        }
    }
    removePointEvent() {
        for (let i = 0; i < this._pointItems.length; i++) {
            CCUtil.offTouch(this._pointItems[i], this.onItemClick.bind(this, this._pointItems[i]), this);
        }
    }

    protected onDestroy(): void {
        this.removePointEvent();
    }
}


