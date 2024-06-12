import { _decorator, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { GameBundle } from '../../GameRes';
import { inf_SpineAniCreate } from '../../manager/InterfaceDefines';
import { EventMgr } from '../../util/EventManager';
import ListItem from '../../util/list/ListItem';
import { boxAniData } from './TaskInfo';
const { ccclass, property } = _decorator;

@ccclass('TaskAwardItem')
export class TaskAwardItem extends ListItem {
    @property(Node)
    public spNode: Node = null;
    initPropsItem(idx: number): void {
        let ani_str = boxAniData[idx].aniurl;
        let path_str = `spine/chest/${ani_str}/${ani_str}.json`;
        let resConf = {bundle:GameBundle.NORMAL,path:path_str}
        let spinePrams:inf_SpineAniCreate = {
            resConf:resConf,
            aniName:"idle",
            parentNode:this.spNode,
            isLoop:true,
            isPremult:true,
        }
        EventMgr.dispatch(EventType.Sys_Ani_Play,spinePrams);
    }

}


