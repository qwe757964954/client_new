import { _decorator, isValid, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { BasePopRight } from '../../script/BasePopRight';
import List from '../../util/list/List';
import { MainActivityIds, MainActivityInfo, MainActivityInfos } from './MainInfo';
import { RightActivityItem } from './RightActivityItem';
const { ccclass, property } = _decorator;

@ccclass('MainRightActivity')
export class MainRightActivity extends BasePopRight {
    @property(List)
    public activity_list: List = null;
    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("content")]);
        this.activity_list.numItems = MainActivityInfos.length;
    }
    protected initEvent(): void {
    }
    onLoadActivityListGrid(item:Node,idx:number){
        let item_script = item.getComponent(RightActivityItem);
        let itemInfo: MainActivityInfo = MainActivityInfos[idx];
        item_script.updateActivityItem(itemInfo);
    }
    onActivityListGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
        this.setActivityClick(MainActivityInfos[selectedId]);
    }

    setActivityClick(info:MainActivityInfo){
        switch (info.id) {
            case MainActivityIds.Package:
                this.onClickBag();
                break;
            case MainActivityIds.Collect:
                this.onClickCollect();
                break;
            case MainActivityIds.Rank:
                this.onClickRank();
                break;
            default:
                break;
        }
    }

    async onClickBag(){
        await ViewsMgr.showViewAsync(PrefabType.BagView);
    }

    async onClickCollect(){
        await ViewsMgr.showViewAsync(PrefabType.CollectView);
    }

    async onClickRank(){
        await ViewsMgr.showViewAsync(PrefabType.RankView);
    }

}

