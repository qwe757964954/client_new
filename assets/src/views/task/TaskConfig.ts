import { JsonAsset } from "cc";
import { ItemData } from "../../manager/DataMgr";
import { ResLoader } from "../../manager/ResLoader";
import { TaskData, WeeklyTask } from "./TaskInfo";

//用户信息服务
export default class _TaskConfig {
    private static _instance: _TaskConfig;
    private _taskConfigInfo:TaskData = null;
    public static getInstance(): _TaskConfig {
        if (!this._instance || this._instance == null) {
            this._instance = new _TaskConfig();
        }
        return this._instance;
    }
    get taskConfigInfo() {
        return this._taskConfigInfo;
    }
    public async loadTaskConfigInfo(): Promise<void> {
        try {
            const jsonData = await ResLoader.instance.loadAsyncPromise<JsonAsset>('task/task', JsonAsset);
            this._taskConfigInfo = jsonData.json as TaskData;
        } catch (err) {
            console.error("Failed to load task configuration:", err);
            throw err;
        }
    }
    public getTaskFromWeek(taskId: number): WeeklyTask | undefined {
        return this._taskConfigInfo.task_week.find(task => task.id === taskId);
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

export const TKConfig = _TaskConfig.getInstance();