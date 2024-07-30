import { _decorator, isValid, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { AchievementMedalstem } from './AchievementMedalstem';
import { AchieveSelectView } from './AchieveSelectView';
const { ccclass, property } = _decorator;

@ccclass('AchievementMedalsView')
export class AchievementMedalsView extends BaseView {
    @property(List)
    public achievement_list:List = null;
    
    private _achieveSelectView:AchieveSelectView = null;

    protected initUI(): void {
        this.achievement_list.numItems = 50;
        this.initViews();
    }
    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.AchieveSelectView, (node) => {
                this._achieveSelectView = node.getComponent(AchieveSelectView);
            }, {
                isAlignBottom: true,
                isAlignLeft: true,
                bottom: 30.199,
                left: 458.391
            }),
        ]);
    }
    onLoadAchievementChallengeGrid(item:Node, idx:number){
        let item_sript:AchievementMedalstem = item.getComponent(AchievementMedalstem);
        // let data = this._weekTask[idx];
        // item_sript.initPropsItem(data);
    }

    onAchievementChallengeListGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
    }
}

