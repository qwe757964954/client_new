import { _decorator, Component, Label, Node, UITransform } from 'cc';
import { IslandProgressModel, ProgressRewardData } from '../../../models/AdventureModel';
import List from '../../../util/list/List';
import { MapRewardBoxItem } from './MapRewardBoxItem';
const { ccclass, property } = _decorator;

@ccclass('LandTaskView')
export class LandTaskView extends Component {
    @property({ type: Label, tooltip: "进度Label" })
    public progressLabel: Label = null;
    @property(Node)
    public progressBar: Node = null;
    @property(List)
    rewardBoxList: List = null;
    private _progressRewards: ProgressRewardData[] = [];
    private _progressData: IslandProgressModel = null;
    start() {

    }
    updateProps(progresssData: IslandProgressModel){
        this._progressData = progresssData;
        this.progressLabel.string = progresssData.gate_pass_num + "/" + progresssData.gate_total_num;
        this.progressBar.getComponent(UITransform).width = progresssData.gate_pass_num / progresssData.gate_total_num * 545;
        this._progressRewards = progresssData.progress_reward_list;
        this.rewardBoxList.numItems = this._progressRewards.length;
    }

    onMapRewardBoxRender(item: Node, index: number) {
        item.getComponent(MapRewardBoxItem).setData(this._progressRewards[index], this._progressData.gate_pass_num);
    }
}

