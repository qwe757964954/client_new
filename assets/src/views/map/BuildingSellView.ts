import { _decorator, Component, Label, Node } from 'cc';
import { ItemID } from '../../export/ItemConfig';
import { EditInfo } from '../../manager/DataMgr';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { CaleBagView } from '../bag/CaleBagView';
import { RewardItem } from '../common/RewardItem';
const { ccclass, property } = _decorator;

@ccclass('BuildingSellView')
export class BuildingSellView extends Component {
    @property(Node)
    public btnSell: Node = null;//出售按钮
    @property(Label)
    public labelName: Label = null;//名字
    @property(Label)
    public labelContent: Label = null;//内容
    @property(List)
    public listView: List = null;//列表
    @property(CaleBagView)
    public caleBagView: CaleBagView = null;

    private _count: number = 1;
    private _editInfo: EditInfo = null;
    private _maxCount: number = 0;
    private _sellCall: Function = null;

    protected onLoad(): void {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }

    initEvent() {
        CCUtil.onTouch(this.node, this.onBgClick, this);
        CCUtil.onTouch(this.btnSell, this.onBtnSellClick, this);
    }
    removeEvent() {
        CCUtil.offTouch(this.node, this.onBgClick, this);
        CCUtil.offTouch(this.btnSell, this.onBtnSellClick, this);
    }
    init(editInfo: EditInfo, maxCount: number, sellCall: Function) {
        this._editInfo = editInfo;
        this._maxCount = maxCount;
        this._sellCall = sellCall;
        this._count = 1;
        this.labelName.string = editInfo.name;
        this.labelContent.string = editInfo.description;
        this.caleBagView.setCaleMax(this._maxCount);
        this.caleBagView.setSelectListener(this.onCountChange.bind(this));
        this.listView.numItems = 1;
    }
    /**背景点击 */
    onBgClick() {
        this.node.destroy();
    }
    /**出售按钮点击 */
    onBtnSellClick() {
        if (this._sellCall) this._sellCall(this._count);
        this.node.destroy();
    }
    /**列表加载 */
    onListLoad(node: Node, idx: number) {
        node.getComponent(RewardItem).init({ id: ItemID.coin, num: this._editInfo.sell * this._count });
    }
    /**数值变化 */
    onCountChange(num: number) {
        if (this._count == num) return;
        this._count = num;
        this.listView.numItems = 1;
    }
}


