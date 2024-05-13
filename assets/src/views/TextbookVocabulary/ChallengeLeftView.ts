import { _decorator, Component, Node, Vec3 } from 'cc';
import { EventType } from '../../config/EventType';
import { GameRes } from '../../GameRes';
import { inf_SpineAniCreate } from '../../manager/InterfaceDefines';
import { EventMgr } from '../../util/EventManager';
const { ccclass, property } = _decorator;

@ccclass('ChallengeLeftView')
export class ChallengeLeftView extends Component {
    @property(Node)
    public speech_bubble:Node = null;

    @property(Node)
    public rewad_key:Node = null;

    @property(Node)
    public sk_monster:Node = null;

    onLoad(): void {
        
    }

    start() {
        this.loadMonsterSkelton();
    }

    loadMonsterSkelton(){
        this.sk_monster.removeAllChildren();
        let spinePrams:inf_SpineAniCreate = {
            resConf:GameRes.Spine_Stitches,
            aniName:"idle",
            parentNode:this.sk_monster,
            isLoop:true,
            // isPremult:true,
            toPos:new Vec3(34.822,-258.273)
        }
        EventMgr.dispatch(EventType.Sys_Ani_Play,spinePrams);
    }

    update(deltaTime: number) {
        
    }


}


