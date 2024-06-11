import { JsonAsset, Node, _decorator, isValid } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { AchInfoResponse } from './TaskInfo';
import { WeekAchievementItem } from './WeekAchievementItem';
const { ccclass, property } = _decorator;

@ccclass('TaskAchievementView')
export class TaskAchievementView extends BaseView {

    @property(List)
    public scroll_list: List = null;

    private _AchievementDataInfo:AchInfoResponse = null;

    protected async initUI(){
        await this.loadRankData();
        console.log("_AchievementDataInfo_______________",this._AchievementDataInfo);
        // this.scroll_list.numItems = this._AchievementDataInfo;
    }
    async loadRankData(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ResLoader.instance.load(`task/WeekAchieveData`, JsonAsset, async (err: Error | null, jsonData: JsonAsset) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(jsonData.json);
                    this._AchievementDataInfo = jsonData.json as AchInfoResponse;
                    resolve();
                }
            });
        });
    }
    onLoadTabHorizontal(item:Node, idx:number){
        let item_sript:WeekAchievementItem = item.getComponent(WeekAchievementItem);
        console.log("onLoadTabHorizontal",idx);
    }

    onTabListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabListHorizontalSelected",selectedId);
    }

}


