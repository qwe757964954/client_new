import { Label, Node, ScrollView, UITransform, _decorator } from 'cc';
import { PropID } from '../../config/PropConfig';
import { ArchConfig, PropData } from '../../manager/DataMgr';
import List from '../../util/list/List';
import ListItem from '../../util/list/ListItem';
import { RewardItem } from '../common/RewardItem';
const { ccclass, property } = _decorator;

@ccclass('WeekAchievementItem')
export class WeekAchievementItem extends ListItem {

    @property(Label)
    num_text:Label = null;

    @property(Label)
    total_text:Label = null;

    @property(Label)
    title_text:Label = null;

    @property(List)
    award_list:List = null;

    private _propsData:PropData[] = [];

    protected start(): void {
        let scroll:ScrollView = this.award_list.scrollView;
        scroll.node.off(Node.EventType.TOUCH_START, scroll._onTouchBegan, scroll, true);
        scroll.node.off(Node.EventType.TOUCH_MOVE, scroll._onTouchMoved, scroll, true);    
        scroll.node.off(Node.EventType.TOUCH_END, scroll._onTouchEnded, scroll, true);        
        scroll.node.off(Node.EventType.TOUCH_CANCEL, scroll._onTouchCancelled, scroll, true);
    }

    updateAchievementProps(data: ArchConfig) {
        console.log('updateAchievementProps...............', data);
        this.title_text.string = data.Info;
        this._propsData = [];
        for (let index = 0; index < data.Awards.length; index++) {
            let propsData:PropData = {
                id: index == 0 ? PropID.coin:PropID.diamond,
                num: parseInt(data.Awards[index])
            }
            this._propsData.push(propsData);
        }
        this.award_list.numItems = this._propsData.length;
    }

    loadRewardPropsHorizontal(item:Node, idx:number){
        let itemScript:RewardItem = item.getComponent(RewardItem);
        let node_trans = item.getComponent(UITransform);
        let scale = 92.4 / node_trans.height;
        item.setScale(scale,scale,scale)
        itemScript.init(this._propsData[idx]);
    }

}


