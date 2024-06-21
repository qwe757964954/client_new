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
    initPropsItem(idx: number,task_process:number): void {
        let ani_str = boxAniData[idx].aniurl;
        let path_str = `spine/chest/${ani_str}/${ani_str}.json`;
        let resConf = {bundle:GameBundle.NORMAL,path:path_str}
        let boxInfo:WeeklyTaskBox = TKConfig.taskConfigInfo.task_week_box[idx]
        let ani_name = task_process >=boxInfo.need_live_num  ? "idle_open" : "idle";
        let spinePrams:inf_SpineAniCreate = {
            resConf:resConf,
            aniName:ani_name,
            parentNode:this.spNode,
            isLoop:true,
            isPremult:true,
        }
        this.spNode.removeAllChildren();
        EventMgr.dispatch(EventType.Sys_Ani_Play,spinePrams);
    }
    changeBoxAni(aniName:string,idx:number,isLoop:boolean = false){
        let ani_str = boxAniData[idx].aniurl;
        let path_str = `spine/chest/${ani_str}/${ani_str}.json`;
        let resConf = {bundle:GameBundle.NORMAL,path:path_str}
        let spinePrams:inf_SpineAniCreate = {
            resConf:resConf,
            aniName:aniName,
            parentNode:this.spNode,
            isLoop:isLoop,
            isPremult:true,
        }
        this.spNode.removeAllChildren();
        EventMgr.dispatch(EventType.Sys_Ani_Play,spinePrams);
    }
}



/*
let changeAni = function (aniName:string,isLoop:boolean = false) {
    let spinePrams:inf_SpineAniCreate = {
        resConf:resConf,
        aniName:aniName,
        trackIndex:0,
        parentNode:self.sk_sp,
        isLoop:isLoop,
        callEndFunc:()=>{
            if(aniName == "attack"){
                changeAni("idle",true);
            }
        }
    }
    self.sk_sp.removeAllChildren();
    EventMgr.dispatch(EventType.Sys_Ani_Play,spinePrams);
}
changeAni("attack",false);
}
*/
