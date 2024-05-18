import { _decorator, Label, Node, Sprite } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr, ProduceInfo, PropData } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
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

    private _expend: PropData[] = null;

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
    initData(data: ProduceInfo, level: number, num: number) {
        LoadManager.loadSprite(data.res_png, this.img);
        this.labelName.string = data.res_name;
        let time = data.res_time;
        this.labelTime.string = ToolUtil.getSecFormatStr(time);

        let cbLevel = User.castleLevel;//城堡等级
        if (data.unlock > cbLevel || data.level > level) {
            this.produceNode.active = false;
            this.lockNode.active = true;
            this.labelLock.string = data.unlock > cbLevel ? ToolUtil.replace(TextConfig.Produce_Lock1, data.unlock) : ToolUtil.replace(TextConfig.Produce_Lock2, data.unlock);
            return;
        }
        this.produceNode.active = true;
        this.lockNode.active = false;
        this.labelNum.string = ToolUtil.replace(TextConfig.Prop_Show, num.toString());

        let expand = data.expend;
        this._expend = expand;
        this.scrollView.numItems = expand ? expand.length : 0;

        // TODO
    }
    /**list加载 */
    onLoadListItem(item: Node, idx: number) {
        let data = this._expend[idx];
        let propInfo = DataMgr.getPropInfo(data.id);
        LoadManager.loadSprite(propInfo.png, item.getComponentInChildren(Sprite));
        item.getComponentInChildren(Label).string = ToolUtil.replace(TextConfig.Prop_Show, data.num);
    }
    /**生产按钮点击 */
    onClickProduce() {
        // TODO
        ViewsManager.showTip(TextConfig.Function_Tip);
    }
    /**次数按钮点击 */
    onClickTimes() {
        // TODO
        ViewsManager.showTip(TextConfig.Function_Tip);
    }
}


