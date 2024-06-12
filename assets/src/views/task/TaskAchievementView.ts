import { JsonAsset, Node, _decorator, isValid } from 'cc';
import { EventType } from '../../config/EventType';
import { ArchConfig, DataMgr } from '../../manager/DataMgr';
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
    private _listData = {};
    private _subSelectData = {};
    private _achievementListData:ArchConfig[] = [];
    protected async initUI(){
        await this.loadRankData();
        // this.scroll_list.numItems = this._AchievementDataInfo;
        this.loadAchievementConfig();
    }

    protected onInitModuleEvent() {
        this.addModelListener(EventType.Sub_Tab_Item_Click,this.subTabItemClick);
	}

    subTabItemClick(data){
        this._subSelectData = data;
        this.showItemList(data.id);
    }

    async loadRankData(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ResLoader.instance.load(`task/WeekAchieveData`, JsonAsset, async (err: Error | null, jsonData: JsonAsset) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    this._AchievementDataInfo = jsonData.json as AchInfoResponse;
                    resolve();
                }
            });
        });
    }

    loadAchievementConfig(){
        let listData = {};
        let statusList = this._AchievementDataInfo.Data.RecStatusList;
        for (let index = 0; index < statusList.length; index++) {
            const statusData = statusList[index];
            // console.log("statusData....",statusData)
            let cfgData: ArchConfig = DataMgr.instance.archConfig[statusData.CurrentAchConfId];
            if(isValid(cfgData)){
                cfgData.Status = statusData.Status;
                cfgData.NextIds = statusData.NextIds;
                if(!listData[cfgData.Type]){
                    listData[cfgData.Type] = {};
                    listData[cfgData.Type][cfgData.Type] = cfgData;
                }else{
                    if (!listData[cfgData.Type][cfgData.Mid]) {
                        listData[cfgData.Type][cfgData.Mid] = cfgData;
                    }
                }
            }
        }
        
        this._listData = listData;
        console.log("this._listData....",this._listData)
        this.showItemList(1);
    }

    private showItemList(type: number) {
        let dataList = [];
        let totalNum = 0;
        let endNum = 0;
        for (let k in this._listData) {
            if (type == 0 || type == Number(k)) {
                let typeData = this._listData[k];
                for (let m in typeData) {
                    dataList.push(typeData[m]);
                    totalNum++;
                    if (typeData[m].Status != 0) {
                        endNum++;
                    }
                }
            }
        }

        dataList.sort((a, b) => {
            if (a.Status == 2 && b.Status != 2) return 1;
            if (a.Status != 2 && b.Status == 2) return -1;
            return a.Status > b.Status ? -1 : 1;
        });
        this._achievementListData = dataList;
        this.scroll_list.numItems = this._achievementListData.length;
        this.scroll_list.scrollView.scrollToTop();
    }

    onLoadTabHorizontal(item:Node, idx:number){
        let item_sript:WeekAchievementItem = item.getComponent(WeekAchievementItem);
        item_sript.updateAchievementProps(this._achievementListData[idx]);
    }

    onTabListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
    }

}


