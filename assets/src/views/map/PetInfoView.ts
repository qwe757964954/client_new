import { _decorator, Component, Label, Layers, Node, Vec3 } from 'cc';
import { PropID } from '../../config/PropConfig';
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
    init(id: number, level: number, removeCall?: Function) {
        this._removeCall = removeCall;

        this.listView.numItems = 6;
        this.pet.init(id, level);
        this.pet.show(true);
        NodeUtil.setLayerRecursively(this.pet.node, Layers.Enum.UI_2D);
        if (level <= 2) {//特殊处理，后面考虑走配置
            this.pet.node.scale = new Vec3(1.5, 1.5, 1);
        }

        this.rewardItems[0].init({ id: PropID.amethyst, num: 10 });
        this.rewardItems[1].init({ id: PropID.coin, num: 20 });
        this.rewardItems[2].init({ id: PropID.diamond, num: 30 });
        this.rewardItems[3].initByPng("map/img_token_gold/spriteFrame", 2);
        this.rewardItems[4].init({ id: PropID.soul, num: 40 });
        this.rewardItems[5].initByPng("map/pet/pet_img_mood_icon/spriteFrame", 60);
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


