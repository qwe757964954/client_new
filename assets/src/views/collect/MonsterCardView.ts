import { _decorator, isValid, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { AchieveTabView } from './AchieveTabView';
import { MonsterCardTabInfos } from './CollectInfo';
import { MonsterCardItem } from './MonsterCardItem';
const { ccclass, property } = _decorator;

@ccclass('MonsterCardView')
export class MonsterCardView extends BaseView {
    @property(List)
    public monster_list: List = null;

    private _achieveTabView:AchieveTabView = null;
    protected async initUI() {
        this.monster_list.numItems = 20;
        try {
            await this.initViews();
            this._achieveTabView.updateData(MonsterCardTabInfos);
            console.log("CollectView configuration loaded:", );
        } catch (err) {
            console.error("Failed to initialize UI:", err);
        }  
    }
    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.AchieveTabView, (node) => {
                
                this._achieveTabView = node.getComponent(AchieveTabView);
                // 
            }, {
                isAlignTop: true,
                isAlignLeft: true,
                top: 116.538,
                left: 719.241
            })
        ]);
    }
    onLoadMonsterCardGrid(item:Node, idx:number){
        let item_sript:MonsterCardItem = item.getComponent(MonsterCardItem);
        // let data = this._weekTask[idx];
        // item_sript.initPropsItem(data);
    }

    onMonsterCardListGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
    }
}

