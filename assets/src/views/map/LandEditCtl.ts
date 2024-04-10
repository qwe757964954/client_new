import { EventMouse, EventTouch } from "cc";
import { LandInfo, LandModel } from "../../models/LandModel";
import { MapNormalCtl } from "./MapNormalCtl";
import { MapConfig } from "../../config/MapConfig";

//地块编辑控制器
export class LandEditCtl extends MapNormalCtl {

    private _selectLand:LandInfo = null;//选中地块

    //设置选中地块
    public set selectLand(land:LandInfo){
        if(!land) return;
        this._selectLand = land;
    }

    // 点击开始
    onTouchStart(e:EventTouch){
        this.selectLand = MapConfig.landInfo[1];
        this._lastTouchPos = e.getUILocation();
        // let pos = e.getLocation();//需要用屏幕坐标去转换点击事件
        // this._lastTouchGrid = this.getTouchGrid(pos.x, pos.y);
        // if(this._lastTouchGrid){
        //     this._touchBuilding = this._lastTouchGrid.building;
        // }
        // this._touchBuilding = this.isTouchBuilding(pos.x, pos.y);
    }
    // 点击移动
    onTouchMove(e:EventTouch){
        let touchPos = e.getUILocation();
        let dtX = this._lastTouchPos.x - touchPos.x;
        let dtY = this._lastTouchPos.y - touchPos.y;
        if(!this.isTouchMoveEffective(dtX, dtY)){
            return;
        }
        this._isTouchMove = true;
        this._lastTouchPos = touchPos;

        let pos = e.getLocation();
        let gridModel = this._mainScene.getTouchGrid(pos.x, pos.y);
        if(gridModel && gridModel.land){
            gridModel.land.refreshLand(this._selectLand);
        }
    }
    // 点击结束
    onTouchEnd(e:EventTouch){
        if(!this._isTouchMove){
            let pos = e.getLocation();
            let gridModel = this._mainScene.getTouchGrid(pos.x, pos.y);
            if(gridModel && gridModel.land){
                gridModel.land.refreshOneLand(this._selectLand);
            }
        }
        super.onTouchEnd(e);
    }
    // 清理数据
    clearData(): void {
        this._selectLand = null;
    }
    // 确定事件
    confirmEvent(): void {
        
    }
    // 取消事件
    cancelEvent(): void {
    }
}