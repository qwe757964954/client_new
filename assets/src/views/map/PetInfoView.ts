import { _decorator, Component, Label, Layers, Node } from 'cc';
import { PetModel } from '../../models/PetModel';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { NodeUtil } from '../../util/NodeUtil';
import { RewardItem } from '../common/RewardItem';
const { ccclass, property } = _decorator;

@ccclass('PetInfoView')
export class PetInfoView extends Component {
    @property(List)
    public listView: List = null;//列表
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property([RewardItem])
    public rewardItems: RewardItem[] = [];//奖励列表
    @property([Node])
    public moods: Node[] = [];//心情列表
    @property(Node)
    public btnUpgade: Node = null;//升级按钮
    @property(PetModel)
    public pet: PetModel = null;//宠物
    @property(Label)
    public labelLevel: Label = null;//等级


    private _removeCall: Function = null;//移除回调

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化数据 */
    init(removeCall?: Function) {
        this._removeCall = removeCall;

        this.listView.numItems = 6;
        this.pet.init(101, 1);
        this.pet.show(true);
        NodeUtil.setLayerRecursively(this.pet.node, Layers.Enum.UI_2D);
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onCloseClick, this);
        CCUtil.onTouch(this.btnUpgade, this.onUpgadeClick, this);
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onCloseClick, this);
        CCUtil.offTouch(this.btnUpgade, this.onUpgadeClick, this);
    }
    /**加载列表 */
    onLoadList(node: Node, idx: number) {

    }
    /**关闭按钮 */
    onCloseClick() {
        if (this._removeCall) this._removeCall();
        this.node.destroy();
    }
    /**升级按钮 */
    onUpgadeClick() {
    }
}


