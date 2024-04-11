import { EventMouse, EventTouch } from "cc";
import { MapBaseCtl } from "./MapBaseCtl";
import { EditInfo, MapConfig, MapStatus } from "../../config/MapConfig";
import { LandModel } from "../../models/LandModel";
import { ToolUtil } from "../../util/ToolUtil";

//地块编辑控制器
export class LandEditCtl extends MapBaseCtl {

    private _selectLand:EditInfo = null;//选中地块
    private _landCache:Map<string,LandModel> = new Map();//地块缓存

    //设置选中地块
    public set selectLand(land:EditInfo){
        if(!land) return;
        this._selectLand = land;
    }

    // 点击开始
    onTouchStart(e:EventTouch){
        super.onTouchStart(e);
    }
    // 点击移动
    onTouchMove(e:EventTouch){
        if(!this._selectLand) return;
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
            this.cacheLand(gridModel.land);
        }
    }
    // 点击结束
    onTouchEnd(e:EventTouch){
        if(!this._selectLand) return;
        if(!this._isTouchMove){
            let pos = e.getLocation();
            let gridModel = this._mainScene.getTouchGrid(pos.x, pos.y);
            if(gridModel && gridModel.land){
                gridModel.land.refreshOneLand(this._selectLand);
                this.cacheLand(gridModel.land);
            }
        }
        super.onTouchEnd(e);
    }
    // 清理数据
    clearData(): void {
        this.recoverLand();
        super.clearData();
    }
    // 确定事件
    confirmEvent(): void {
        this._selectLand = null;
        this.saveLand();
        this._mainScene.changeMapStatus(MapStatus.EDIT);
    }
    // 取消事件
    cancelEvent(): void {
        this._selectLand = null;
        this.recoverLand();
        this._mainScene.changeMapStatus(MapStatus.EDIT);
    }
    // 缓存修改地块
    cacheLand(land:LandModel): void {
        this._landCache.set(ToolUtil.replace("{0}_{1}",land.x,land.y), land);
    }
    // 缓存地块还原
    recoverLand(): void {
        this._landCache.forEach(element => {
            element.recover();
        });
        this._landCache.clear();
    }
    // 缓存地块保存
    saveLand(): void {
        this._landCache.forEach(element => {
            element.saveData();
        });
        this._landCache.clear();
    }
}