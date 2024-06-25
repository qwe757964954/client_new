import { Layout, Node, Prefab, Sprite, SpriteFrame, UITransform, Vec2, _decorator, instantiate } from 'cc';
import { EventType } from '../../config/EventType';
import { TextConfig } from '../../config/TextConfig';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { MapLevelData } from '../../models/AdventureModel';
import { GateListItem, UnitItemStatus, UnitListItemStatus } from '../../models/TextbookModel';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import ImgUtil from '../../util/ImgUtil';
import { MapPointItem } from '../adventure/levelmap/MapPointItem';
import { GotoUnitLevel } from './BreakThroughView';
import { MapTouchBetterController } from './MapCom/MapTouchBetterController';
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
export class ScrollMapView extends BaseView {

    @property(Node)
    MapLaout:Node = null;    

    @property(Node)
    contentNode:Node = null;  

    @property(Prefab)
    mapItemPrefab:Prefab = null;

    private _clickCallback:(itemStatus:UnitItemStatus,gate:GateListItem)=>void = null;

    private _unitStatus:UnitItemStatus[] = null;
    private _pointItems: Node[] = [];

    private _total_grade = 0;

    public _curLevelIndex:number = 0;
    onInitModuleEvent(){
        this.addModelListener(EventType.Goto_Textbook_Next_Level,this.gotoNextTextbookLevel);
    }
    async loadMapItems() {
        let unit_count = 0;
        this._pointItems = [];
        // let nodePool:NodePool = PoolMgr.getNodePool("mapItemPool");
        for (let i = 0; i < this._unitStatus.length; i++) {
            const itemData: UnitItemStatus = this._unitStatus[i];
            
            for (let j = 0; j < itemData.gate_list.length; j++) {
                const gate: GateListItem = itemData.gate_list[j];
                const index = unit_count % MapCoordinates.length;
                const point: MapCoordinate = {
                    x: MapCoordinates[index].x - 1095,
                    y: MapCoordinates[index].y
                };
    
                // let itemNode: Node = nodePool.get();
            
                // if(!isValid(itemNode)){
                let itemNode = instantiate(this.mapItemPrefab);
                // }
                let itemScript: MapPointItem = itemNode.getComponent(MapPointItem);
                itemScript.index = unit_count;
                // const stringWithoutUnit: string = itemData.unit.replace("Unit ", "").trim();
                let data: MapLevelData = { big_id: itemData.unit_name, small_id: gate.small_id, micro_id: gate.small_id, flag_info: gate.flag_info };
                itemScript.initSmallData(data);
                CCUtil.onBtnClick(itemNode,(event)=>{
                    this.onItemClick(event.node);
                });
                let map_count = this.calculateMapsNeeded(unit_count + 1, MapCoordinates.length);
                let mapNode = this.MapLaout.getChildByName(`bg_map_${map_count - 1}`);
                itemNode.setPosition(point.x, point.y, 0);
                mapNode.addChild(itemNode);
                this._pointItems.push(itemNode);
                unit_count++;
            }
        }
    }
    /**添加地图单元点 */
    async initUnit(unitStatus:UnitListItemStatus){
        this._unitStatus = unitStatus.unit_list;
        this._total_grade = unitStatus.gate_total;
        
        this._unitStatus.sort((a, b) => {
            const unitA = a.unit_name.replace(/\s+/g, '');;
            const unitB = b.unit_name.replace(/\s+/g, '');;
        
            // Check if both units are numbers
            const isANumber = !isNaN(Number(unitA));
            const isBNumber = !isNaN(Number(unitB));
        
            // If both are numbers, compare them numerically
            if (isANumber && isBNumber) {
                return Number(unitA) - Number(unitB);
            }
        
            // If one is a number and the other is not, prioritize the non-number unit
            if (isANumber !== isBNumber) {
                return isANumber ? 1 : -1;
            }
        
            // If both are not numbers, compare them as strings with natural sorting
            const partsA = unitA.split(/(\d+)/).filter(Boolean);
            const partsB = unitB.split(/(\d+)/).filter(Boolean);
            
            

            for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
                const partA = partsA[i];
                const partB = partsB[i];
                const numA = parseInt(partA, 10);
                const numB = parseInt(partB, 10);
        
                // If both parts are numbers, compare them numerically
                if (!isNaN(numA) && !isNaN(numB)) {
                    if (numA !== numB) {
                        return numA - numB;
                    }
                } else {
                    // If one or both parts are not numbers, compare them as strings
                    const comparison = partA.localeCompare(partB);
                    if (comparison !== 0) {
                        return comparison;
                    }
                }
            }
        
            // If all parts are equal, compare based on length (shorter comes first)
            return partsA.length - partsB.length;
        });
        

        this.MapLaout.removeAllChildren();
        this.addMapBg().then(()=>{
            this.loadMapItems();
            // this.scheduleOnce(()=>{
                this.MapLaout.setPosition(0,0,0)
                this.scrollToNormal();
            // });
        });
    }

    scrollToNormal(){
        let content_script = this.contentNode.getComponent(MapTouchBetterController);
        // content_script
        let itemNode = this._pointItems[0];
        // 获取父节点
        let parentNode = itemNode.parent;
        // 获取父节点的父节点
        let grandparentNode = parentNode.parent;
        // 获取子节点相对于世界坐标系的坐标
        let worldPos = itemNode.getWorldPosition();
        // 将世界坐标转换为父节点的父节点的局部坐标系
        let grandparentLocalPos = grandparentNode.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        console.log("grandparentLocalPos",grandparentLocalPos);
        content_script.moveToTargetPos(grandparentLocalPos); 
    }

    calculateMapsNeeded(totalLevels: number, levelsPerMap: number): number {
        const mapsNeeded = Math.ceil(totalLevels / levelsPerMap);
        return mapsNeeded;
    }
    addMapBg(){
        return new Promise<void>((resolve, reject) => {
            ResLoader.instance.load("adventure/bg/long_background/bg_map_01/spriteFrame", SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
                if (err) {
                    reject(err);
                } else {
                    let map_count = this.calculateMapsNeeded(this._total_grade, MapCoordinates.length);
                    for (let index = 0; index < map_count; index++) {
                        let nd: Node = ImgUtil.create_2DNode(`bg_map_${index}`);
                        nd.addComponent(Sprite).spriteFrame = spriteFrame;
                        let uiTrans: UITransform = nd.getComponent(UITransform);
                        uiTrans.anchorPoint = new Vec2(0.5, 0.5);
                        this.MapLaout.addChild(nd);
                    }
                    this.MapLaout.getComponent(Layout).updateLayout();
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
        this._curLevelIndex = item.index;
        let data = item.data;
        // let itemStatus:UnitItemStatus = this._unitStatus[data.big_id - 1];
        let itemStatus:UnitItemStatus = this._unitStatus.find(item => item.unit_name === data.big_id);
        let small_id = data.small_id;
        let gate:GateListItem = itemStatus.gate_list[small_id - 1];
        let param:GotoUnitLevel = {
            itemStatus:itemStatus,
            gate:gate,
            isNext:false
        } 
        EventMgr.dispatch(EventType.Goto_Textbook_Level,param);
    }

    gotoNextTextbookLevel(){
        let next_level = this._curLevelIndex + 1;
        if(next_level >= this._pointItems.length){
            ViewsManager.showTip(TextConfig.All_level_Tip);
            return;
        }
        let point:Node = this._pointItems[this._curLevelIndex + 1];
        let item:MapPointItem = point.getComponent(MapPointItem);
        this._curLevelIndex = item.index;
        let data = item.data;
        let itemStatus:UnitItemStatus = this._unitStatus.find(item => item.unit_name === data.big_id);
        let small_id = data.small_id;
        let gate:GateListItem = itemStatus.gate_list[small_id - 1];
        let param:GotoUnitLevel = {
            itemStatus:itemStatus,
            gate:gate,
            isNext:true
        } 
        EventMgr.dispatch(EventType.Goto_Break_Through_Textbook_Next_Level,param);
    }

    removePointEvent() {
        // this.MapLaout.removeAllChildren();
    }
}


