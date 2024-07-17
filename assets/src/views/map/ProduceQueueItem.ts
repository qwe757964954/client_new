import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import { ServiceMgr } from '../../net/ServiceManager';
import CCUtil from '../../util/CCUtil';
import { TimerMgr } from '../../util/TimerMgr';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;

@ccclass('ProduceQueueItem')
export class ProduceQueueItem extends Component {
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Label)
    public label: Label = null;//时间
    @property(Node)
    public imgAdd: Node = null;//加号
    @property(Node)
    public btnSpeed: Node = null;//加速

    private _time: number = null;//时间
    private _buildingID: number = 0;//建筑唯一索引id
    private _product_num: number = 0;//生产标志
    private _timer: number = null;//定时器
    private _res_time: number = 0;//生产需要基准时间

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
        this.clearTimer();
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.node, this.onClick, this);
        CCUtil.onTouch(this.btnSpeed, this.onSpeedClick, this);
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.node, this.onClick, this);
        CCUtil.offTouch(this.btnSpeed, this.onSpeedClick, this);
    }
    /**初始化 */
    init(time: number, pngPath?: string, buildingID?: number, product_num?: number, res_time?: number) {
        this.btnSpeed.active = false;
        this.clearTimer();
        if (null == pngPath) {
            this._time = null;
            this.imgAdd.active = true;
            this.img.node.active = false;
            this.label.node.active = false;
            return;
        }
        LoadManager.loadSprite(pngPath, this.img);
        this._time = time;
        this.imgAdd.active = false;
        this.img.node.active = true;
        this.label.node.active = true;
        this._buildingID = buildingID;
        this._product_num = product_num;
        this._res_time = res_time;//走配置
        this._timer = TimerMgr.loop(this.updateBySec.bind(this), 1000);
        this.updateBySec();
    }
    /**清理定时器 */
    clearTimer() {
        if (null == this._timer) {
            return;
        }
        TimerMgr.stopLoop(this._timer);
        this._timer = null;
    }
    /**每秒更新 */
    updateBySec() {
        let now = ToolUtil.now();
        if (this._time <= now) {
            this.label.string = "可以领取";//TODO
            this.btnSpeed.active = false;
            this.clearTimer();
            return;
        }
        let left = this._time - now;
        // this.label.string = ToolUtil.getSecFormatStr(left);
        if (left <= this._res_time) {
            this.label.string = ToolUtil.getSecFormatStr(left);
            this.btnSpeed.active = true;
        } else {
            this.label.string = "等待生产";//TODO
            this.btnSpeed.active = false;
        }
    }
    /**点击事件 */
    onClick() {
        if (null == this._time) {
            return;
        }
        let now = ToolUtil.now();
        let left = this._time - now;
        if (left <= 0) {
            ServiceMgr.buildingService.reqBuildingProduceGet(this._buildingID);
            return;
        }
        if (left <= this._res_time) {
            ViewsMgr.showConfirm(TextConfig.Building_Product_Delete, () => {
                ServiceMgr.buildingService.reqBuildingProduceDelete(this._buildingID, this._product_num);
            });
        } else {
            ServiceMgr.buildingService.reqBuildingProduceDelete(this._buildingID, this._product_num);
        }
    }
    /**加速按钮事件 */
    onSpeedClick() {
        if (null == this._time) {
            return;
        }
        ServiceMgr.buildingService.reqSpeedWordsGet(this._buildingID, this._product_num);
    }
}
