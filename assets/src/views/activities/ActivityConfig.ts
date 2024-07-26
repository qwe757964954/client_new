import { JsonAsset } from "cc";
import { ItemData } from "../../manager/DataMgr";
import { ResLoader } from "../../manager/ResLoader";
import { ActivityInfoResponse } from "../../models/ActivityModel";
import { ActivityData } from "./ActvityInfo";

//用户信息服务
export default class _ActivityConfig {
    private static _instance: _ActivityConfig;
    private _activityConfigInfo:ActivityData = null;
    public activityInfoResponse:ActivityInfoResponse = null;
    public static getInstance(): _ActivityConfig {
        if (!this._instance || this._instance == null) {
            this._instance = new _ActivityConfig();
        }
        return this._instance;
    }

    updateActivityInfoResponse(data:ActivityInfoResponse){
        this.activityInfoResponse = data;
    }

    get activityConfigInfo() {
        return this._activityConfigInfo;
    }
    public async loadActivityConfigInfo(): Promise<void> {
        try {
            const jsonData = await ResLoader.instance.loadAsyncPromise<JsonAsset>('task/task', JsonAsset);
            this._activityConfigInfo = jsonData.json as ActivityData;
        } catch (err) {
            console.error("Failed to load task configuration:", err);
            throw err;
        }
    }

    public isTodayDayGreaterThanGivenDateDay(): boolean {
        let draw_length = ActConfig.activityInfoResponse.sign_status_list.length;
        let dateString = '1970-01-01'; // default earliest date
    
        if (draw_length > 0) {
            let day_str = ActConfig.activityInfoResponse.sign_status_list[draw_length - 1].day;
            if (day_str) {
                dateString = day_str;
            }
        }
    
        const givenDate = new Date(dateString);
        const today = new Date();
    
        // Remove the time part of the dates for a pure date comparison
        today.setHours(0, 0, 0, 0);
        givenDate.setHours(0, 0, 0, 0);
    
        return today.getDate() > givenDate.getDate();
    }
    

    public convertRewardData(rewardArray:number[]){
        const result = rewardArray.reduce((acc, value, index, array) => {
            if (index % 2 === 0) {
              // 当索引为偶数时
              let propsData: ItemData = {
                    id: value,
                    num: array[index + 1]
                }
              acc.push(propsData);
            }
            return acc;
          }, [] as ItemData[]);

        return result;
    }
}

export const ActConfig = _ActivityConfig.getInstance();