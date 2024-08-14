import { JsonAsset } from "cc";
import { ResLoader } from "../../manager/ResLoader";
import { Task, TaskData, WeeklyTask } from "./TaskInfo";

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

    public getTaskFromMain(taskId: number): Task | undefined {
        return this._taskConfigInfo.task_main.find(task => task.id === taskId);
    }
}

export const TKConfig = _TaskConfig.getInstance();