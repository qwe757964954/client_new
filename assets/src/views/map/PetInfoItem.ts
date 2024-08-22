import { Component, Label, Layout, Node, _decorator } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr } from '../../manager/DataMgr';
import { PetModel } from '../../models/PetModel';
import CCUtil from '../../util/CCUtil';
import { ToolUtil } from '../../util/ToolUtil';
import { RewardShowItem } from '../common/RewardShowItem';
const { ccclass, property } = _decorator;

@ccclass('PetInfoItem')
export class PetInfoItem extends Component {
    @property(Layout)
    public plContent: Layout = null;//内容
    @property(Label)
    public labelName: Label = null;//名字
    @property(PetModel)
    public pet: PetModel = null;//宠物
    @property([RewardShowItem])
    public rewardItems: RewardShowItem[] = [];//奖励列表
    @property(Node)
    public plBlack: Node = null;
    @property(Label)
    public labelLoack: Label = null;
    @property(Node)
    public nodeTip: Node = null;

    private _isInit: boolean = false;

    init(id: number, level: number, unlockLevel: number) {
        let petConfig = DataMgr.petConfig[id][level - 1];
        if (!petConfig) return;

        this.labelName.string = petConfig.name;
        if (this._isInit) {
            this.pet.updateLevel(level);
        } else {
            CCUtil.setNodeCamera2DUI(this.pet.node);
            this.pet.init(id, level);
            this.pet.show(true);
        }
        this._isInit = true;
        if (level <= 2) {
            CCUtil.setNodeScale(this.pet.node, 1.0);
        } else if (level <= 5) {
            CCUtil.setNodeScale(this.pet.node, 0.8);
        }
        else {
            CCUtil.setNodeScale(this.pet.node, 0.6);
        }
        for (let i = 0; i < this.rewardItems.length; i++) {
            let rewardItem = this.rewardItems[i];
            rewardItem.init(petConfig.randomRewards[i]);
        }
        if (level <= unlockLevel) {
            this.nodeTip.active = true;
            this.plBlack.active = false;
        } else {
            this.nodeTip.active = false;
            this.plBlack.active = true;
            this.labelLoack.string = ToolUtil.replace(TextConfig.Castle_Condition2, level);
        }
    }
}


