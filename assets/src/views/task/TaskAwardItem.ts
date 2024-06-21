import { _decorator, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { GameBundle } from '../../GameRes';
import { inf_SpineAniCreate } from '../../manager/InterfaceDefines';
import { EventMgr } from '../../util/EventManager';
import ListItem from '../../util/list/ListItem';
import { TKConfig } from './TaskConfig';
import { boxAniData, WeeklyTaskBox } from './TaskInfo';

const { ccclass, property } = _decorator;

@ccclass('TaskAwardItem')
export class TaskAwardItem extends ListItem {
    @property(Node)
    public spNode: Node = null;
    initPropsItem(idx: number, taskProcess: number): void {
        this.playBoxAnimation(idx, this.getAnimationName(idx, taskProcess));
    }
    changeBoxAni(aniName: string, idx: number, isLoop: boolean = false): void {
        this.playBoxAnimation(idx, aniName, isLoop);
    }
    private getAnimationName(idx: number, taskProcess: number): string {
        const boxInfo: WeeklyTaskBox = TKConfig.taskConfigInfo.task_week_box[idx];
        return taskProcess >= boxInfo.need_live_num ? "idle_open" : "idle";
    }
    private playBoxAnimation(idx: number, aniName: string, isLoop: boolean = true): void {
        const aniStr = boxAniData[idx].aniurl;
        const pathStr = `spine/chest/${aniStr}/${aniStr}.json`;
        const resConf = { bundle: GameBundle.NORMAL, path: pathStr };
        const spineParams: inf_SpineAniCreate = {
            resConf: resConf,
            aniName: aniName,
            parentNode: this.spNode,
            isLoop: isLoop,
            isPremult: true,
        };
        this.spNode.removeAllChildren();
        EventMgr.dispatch(EventType.Sys_Ani_Play, spineParams);
    }
}
