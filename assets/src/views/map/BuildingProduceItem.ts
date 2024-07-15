import { _decorator, Label, Node, Sprite } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr, ItemData, ProduceInfo } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { ServiceMgr } from '../../net/ServiceManager';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import ListItem from '../../util/list/ListItem';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;

@ccclass('BuildingProduceItem')
export class BuildingProduceItem extends ListItem {
    @property(Sprite)
    public img: Sprite = null;//图片
    @property(Label)
    public labelName: Label = null;//名字
    @property(Label)
    public labelTime: Label = null;//时间
    @property(Label)
    public labelNum: Label = null;//数量
    @property(List)
    public scrollView: List = null;//滚动视图
    @property(Node)
    public btnProduce: Node = null;//生产按钮
    @property(Node)
    public btnTimes: Node = null;//次数按钮
    @property(Label)
    public labelTimes: Label = null;//次数
    @property(Label)
    public labelLock: Label = null;//锁定条件
    @property(Node)
    public produceNode: Node = null;//生产节点
    @property(Node)
    public lockNode: Node = null;//锁定节点

    private _expend: ItemData[] = null;
    private _num: number = 0;
    private _buildingID: number = 0;
    private _level: number = 0;
    private _canProduce: boolean = false;

    start() {
        this.initEvent();
    }
    onDestroy(): void {
        this.removeEvent();
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.btnProduce, this.onClickProduce, this);
        CCUtil.onTouch(this.btnTimes, this.onClickTimes, this);
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.btnProduce, this.onClickProduce, this);
        CCUtil.offTouch(this.btnTimes, this.onClickTimes, this);
    }

    /**初始化数据 */
    initData(data: ProduceInfo, level: number, id: number) {
        LoadManager.loadSprite(data.res_png, this.img);
        this.labelName.string = data.res_name;
        let time = data.res_time;
        this.labelTime.string = ToolUtil.getSecFormatStr(time);

        this._buildingID = id;
        this._level = data.level;

        if (data.level > level) {
            let cbLevel = User.castleLevel;//城堡等级
            this.produceNode.active = false;
            this.lockNode.active = true;
            this.labelLock.string = data.unlock > cbLevel ? ToolUtil.replace(TextConfig.Produce_Lock1, data.unlock) : ToolUtil.replace(TextConfig.Produce_Lock2, data.unlock);
            return;
        }
        this.produceNode.active = true;
        this.lockNode.active = false;

        let expand = data.expend;
        this._expend = expand;
        this.scrollView.numItems = expand ? expand.length : 0;
    }
    /**list加载 */
    onLoadListItem(item: Node, idx: number) {
        let data = this._expend[idx];
        let propInfo = DataMgr.getItemInfo(data.id);
        LoadManager.loadSprite(propInfo.png, item.getComponentInChildren(Sprite));
        item.getComponentInChildren(Label).string = ToolUtil.replace(TextConfig.Prop_Show, data.num);
    }
    /**生产按钮点击 */
    onClickProduce() {
        if (!this._canProduce) {
            ViewsMgr.showTip(TextConfig.Building_Product_Error);
            return;
        }
        if (this._num <= 0) {
            ViewsMgr.showTip(TextConfig.Building_Product_Full);
            return;
        }
        ServiceMgr.buildingService.reqBuildingProduceAdd(this._buildingID, [this._level]);
    }
    /**次数按钮点击 */
    onClickTimes() {
        if (!this._canProduce) {
            ViewsMgr.showTip(TextConfig.Building_Product_Error);
            return;
        }
        if (this._num <= 0) {
            ViewsMgr.showTip(TextConfig.Building_Product_Full);
            return;
        }
        let ary = new Array(this._num).fill(this._level);
        ServiceMgr.buildingService.reqBuildingProduceAdd(this._buildingID, ary);
    }
    /**设置队列剩余数量 */
    setNum(num: number) {
        this._num = num;
        this.labelNum.string = ToolUtil.replace(TextConfig.Prop_Show, num.toString());
    }
    /**设置是否可以生产 */
    setCanProduce(b: boolean) {
        this._canProduce = b;
    }
}


