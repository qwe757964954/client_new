import { _decorator, isValid, Label, Node, ProgressBar } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { AchievementRewardItem } from './AchievementRewardItem';
import { AchevementRewardInfos } from './TaskInfo';
const { ccclass, property } = _decorator;

@ccclass('AchievementRewardView')
export class AchievementRewardView extends BaseView {
    @property(List)
    public achievement_list:List = null;
    
    @property(ProgressBar)
    public progress_bar:ProgressBar = null;

    @property(Label)
    public progress_label:Label = null;

    protected initUI(): void {
        this.achievement_list.numItems = AchevementRewardInfos.length;
        this.achievement_list.selectedId = 0;
    }

    onLoadAchievementRewardHorizontal(item:Node, idx:number){
        let item_sript:AchievementRewardItem = item.getComponent(AchievementRewardItem);
        item_sript.initPropsItem(idx);
    }

    onAchievementRewardListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        // if(this.callSelectCallback){
        //     this.callSelectCallback(selectedId);
        // }
    }
}
