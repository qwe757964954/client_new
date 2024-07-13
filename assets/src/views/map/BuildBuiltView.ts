import { _decorator, Label, Node } from 'cc';
import { ViewsMgr } from '../../manager/ViewsManager';
import { s2cBuildingBuilt } from '../../models/NetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('BuildBuiltView')
export class BuildBuiltView extends BaseComponent {
    @property(Node)
    public frame: Node = null;//框
    @property(Node)
    public btnDelete: Node = null;//删除按钮
    @property(Node)
    public btnBuilt: Node = null;//建造按钮
    @property(Label)
    public label: Label = null;//时间

    private _buildingID: number = null;
    private _removeCall: Function = null;

    protected onLoad(): void {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    initEvent() {
        CCUtil.onTouch(this, this.onBgClick, this);
        CCUtil.onTouch(this.btnDelete, this.onBtnDeleteClick, this);
        CCUtil.onTouch(this.btnBuilt, this.onBtnBuiltClick, this);

        this.addEvent(InterfacePath.c2sBuildingBuilt, this.onRepBuildingBuilt.bind(this));
    }
    removeEvent() {
        CCUtil.offTouch(this, this.onBgClick, this);
        CCUtil.offTouch(this.btnDelete, this.onBtnDeleteClick, this);
        CCUtil.offTouch(this.btnBuilt, this.onBtnBuiltClick, this);

        this.clearEvent();
    }

    init(buildingID: number, removeCall?: Function) {
        this._buildingID = buildingID;
        this._removeCall = removeCall;
    }
    /**回调并移除自己 */
    remove() {
        if (this._removeCall) this._removeCall();
        this.node.destroy();
    }
    /**背景点击 */
    onBgClick() {
        this.remove();
    }
    /**删除按钮点击 */
    onBtnDeleteClick() {
    }
    /**建造按钮点击 */
    onBtnBuiltClick() {
        ServiceMgr.buildingService.reqBuildingBuilt(this._buildingID);
    }
    /**建筑建造返回 */
    onRepBuildingBuilt(data: s2cBuildingBuilt) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        this.remove();
    }
}


