import { JsonAsset, Prefab, Widget, _decorator, error, instantiate, isValid } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { BaseView } from '../../script/BaseView';
import { AchievementDataInfo } from './TaskInfo';
const { ccclass, property } = _decorator;

@ccclass('TaskAchievementView')
export class TaskAchievementView extends BaseView {

    private _AchievementDataInfo:AchievementDataInfo[] = null;

    protected async initUI(){
        await this.loadRankData();
        console.log("_AchievementDataInfo_______________",this._AchievementDataInfo);
        this.initRewardView();
        this.initRightView();
    }
    async loadRankData(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ResLoader.instance.load(`task/WeekAchieveData`, JsonAsset, async (err: Error | null, jsonData: JsonAsset) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    this._AchievementDataInfo = jsonData.json as AchievementDataInfo[];
                    resolve();
                }
            });
        });
    }
    initRewardView(){
        ResLoader.instance.load(`prefab/${PrefabType.AchievementRewardView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.node.addChild(node);
            let widgetCom = node.getComponent(Widget);
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignTop = true;
                widgetCom.isAlignLeft = true;
            }
            widgetCom.top = 221.75;
            widgetCom.left = 5.868;
        });
    }
    initRightView(){
        ResLoader.instance.load(`prefab/${PrefabType.RightAchievementView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.node.addChild(node);
            let widgetCom = node.getComponent(Widget);
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignRight = true;
                widgetCom.isAlignBottom = true;
            }
            widgetCom.bottom = 15.226;
            widgetCom.right = 13.4085;
        });
    }
}


