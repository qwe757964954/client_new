import { Node, Prefab, Widget, _decorator, error, instantiate, isValid } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { TaskAwardView } from './TaskAwardView';
import { taskInfos } from './TaskInfo';
import { WeekTaskItem } from './WeekTaskItem';
const { ccclass, property } = _decorator;

@ccclass('TaskView')
export class TaskView extends BaseView {
    @property(List)
    public taskList:List = null;

    private _taskAward:TaskAwardView = null;

    async initUI(){
        await this.initRewardView();
        await this.initRightRewardView();
        this.taskList.numItems = taskInfos.length;
        this.taskList.selectedId = 0;
    }
    initRewardView(){
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.TaskAwardView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    error && console.error(err);
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                this.node.addChild(node);
                let widgetCom = node.getComponent(Widget);
                this._taskAward = node.getComponent(TaskAwardView);
                if (!isValid(widgetCom)) {
                    widgetCom = node.addComponent(Widget);
                    widgetCom.isAlignTop = true;
                    widgetCom.isAlignLeft = true;
                }
                widgetCom.top = 221.004;
                widgetCom.left = 7.2975;
                resolve(null);
            });
        })
    }

    initRightRewardView(){
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.RightRewardView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    error && console.error(err);
                    reject(err);
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
                widgetCom.bottom = 14.617;
                widgetCom.right = 12.7375;
                resolve(null);
            });
        })
    }

    onLoadTaskVertical(item:Node, idx:number){
        let item_sript:WeekTaskItem = item.getComponent(WeekTaskItem);
        item_sript.initPropsItem(idx);
    }

    onTaskListVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
    }

}


