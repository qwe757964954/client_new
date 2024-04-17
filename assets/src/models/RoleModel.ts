import { _decorator, Asset, Component, Node, sp } from 'cc';
import { LoadManager } from '../manager/LoadManager';
import { MapConfig } from '../config/MapConfig';
import { DataMgr } from '../manager/DataMgr';
const { ccclass, property } = _decorator;

@ccclass('RoleModel')
export class RoleModel extends Component {
    @property(sp.Skeleton)
    public role:sp.Skeleton = null;

    private _zIndex:number = 0;//层级
    private _loadAssetAry:Asset[] = [];//加载资源数组

    private _roleID:number;//角色id
    private _propID:number[];//道具id

    get ZIndex():number {
        return this._zIndex;
    }
    protected start(): void {
        this.initEvent();
    }
    // 销毁
    public dispose() {
        this.node.destroy();
    }
    protected onDestroy(): void {
        this.removeEvent();
        LoadManager.releaseAssets(this._loadAssetAry);
        this._loadAssetAry = [];
    }
    // 初始化
    public init(roleID:number, propID:number[]) {
        this._roleID = roleID;
        this._propID = propID;

        this.initRole();
    }
    // 初始化角色
    public initRole() {
        let roleInfo = MapConfig.roleInfo[0];
        LoadManager.load(roleInfo.spPath, sp.SkeletonData).then((skeletonData:sp.SkeletonData) => {
            this.role.skeletonData = skeletonData;
            this._loadAssetAry.push(skeletonData);

            this.updateSpineSlot();
            this.role.setAnimation(0, roleInfo.spNames[1], true);
        })
    }
    // 初始化事件
    public initEvent() {
        
    }
    // 移除事件
    public removeEvent() {
        
    }
    // 更新spine插槽
    public updateSpineSlot() {
        let roleSlot = DataMgr.instance.roleSlot[this._roleID];
        let roleSlotConfig = DataMgr.instance.roleSlotConfig;
        let showSlot = [];
        this._propID.forEach(propID => {
            showSlot = showSlot.concat(roleSlotConfig[propID].Ass);
        });
        roleSlot.slots.forEach(slotName => {
            if(-1 == showSlot.indexOf(slotName)) {
                let slot = this.role.findSlot(slotName);
                slot.setAttachment(null);
            }
        });
    }
}

