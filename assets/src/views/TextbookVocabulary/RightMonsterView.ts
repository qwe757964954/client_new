import { Component, Label, Node, ProgressBar, _decorator } from 'cc';
import { GameRes } from '../../GameRes';
import { EventType } from '../../config/EventType';
import { inf_SpineAniCreate } from '../../manager/InterfaceDefines';
import { EventMgr } from '../../util/EventManager';
const { ccclass, property } = _decorator;

@ccclass('RightMonsterView')
export class RightMonsterView extends Component {
    @property(Label)
    public monsterName: Label = null;
    @property(Label)
    public monster_desc: Label = null;
    @property(Label)
    public challenge_num: Label = null;

    @property(ProgressBar)
    public monster_hp: ProgressBar = null;

    @property(Node)
    public monster_spine: Node = null;
    start() {
        this.initMonsterSpine();
    }

    initMonsterSpine(){
        let spinePrams:inf_SpineAniCreate = {
            resConf:GameRes.Spine_Stitches,
            aniName:"idle",
            parentNode:this.monster_spine,
            isLoop:true,
            isPremult:true,
        }
        EventMgr.dispatch(EventType.Sys_Ani_Play,spinePrams);
    }

    update(deltaTime: number) {
        
    }
}


