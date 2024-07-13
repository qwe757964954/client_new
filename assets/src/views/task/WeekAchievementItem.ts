import { Label, Node, UITransform, _decorator } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { ItemID } from '../../export/ItemConfig';
import { ArchConfig, ItemData } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import ListItem from '../../util/list/ListItem';
import { RewardItem } from '../common/RewardItem';
const { ccclass, property } = _decorator;

@ccclass('WeekAchievementItem')
export class WeekAchievementItem extends ListItem {

    @property(Label)
    num_text: Label = null;

    @property(Label)
    total_text: Label = null;

    @property(Label)
    title_text: Label = null;

    @property(Label)
    desc_text:Label = null;

    @property(List)
    award_list: List = null;

    @property(Node)
    btn_task_go: Node = null;

    @property(Node)
    challenge_btn: Node = null;

    @property(Node)
    has_challenge_btn: Node = null;

    private _propsData: ItemData[] = [];

    protected start(): void {
        this.initEvent();
    }

    initEvent(){
        CCUtil.onBtnClick(this.challenge_btn,()=>{
            ViewsManager.showTip(TextConfig.Function_Tip);
            // EventMgr.dispatch(EventType.Challenge_Week_Task_Reward,this._data);
        })
        CCUtil.onBtnClick(this.btn_task_go,()=>{
            ViewsManager.showTip(TextConfig.Function_Tip);
            // EventMgr.dispatch(EventType.Challenge_Week_Task_Reward,this._data);
        })
    }

    updateAchievementProps(data: ArchConfig) {
        this.title_text.string = data.Info;
        this._propsData = [];
        for (let index = 0; index < data.Awards.length; index++) {
            let propsData: ItemData = {
                id: index == 0 ? ItemID.coin : ItemID.diamond,
                num: parseInt(data.Awards[index])
            }
            this._propsData.push(propsData);
        }
        this.award_list.numItems = this._propsData.length;
    }

    loadRewardPropsHorizontal(item: Node, idx: number) {
        let itemScript: RewardItem = item.getComponent(RewardItem);
        let node_trans = item.getComponent(UITransform);
        let scale = 92.4 / node_trans.height;
        item.setScale(scale, scale, scale)
        itemScript.init(this._propsData[idx]);
    }

}


