import { _decorator, Component, Label, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { GameBundle } from '../../GameRes';
import { inf_SpineAniCreate } from '../../manager/InterfaceDefines';
import { EventMgr } from '../../util/EventManager';
import { BossInfo } from './BossInfo';
const { ccclass, property } = _decorator;

@ccclass('CenterBossView')
export class CenterBossView extends Component {

    @property(Label)
    public title_name:Label = null;

    @property(Label)
    public remaining_word_text:Label = null;

    @property(Label)
    public remaining_challenge_text:Label = null;

    @property(Node)
    public sk_sp:Node = null;

    start() {

    }

    update(deltaTime: number) {
        
    }

    updateCenterProps(info: BossInfo){
        this.title_name.string = info.name;
        this.sk_sp.removeAllChildren();
        this.sk_sp.setScale(info.scale,info.scale,info.scale);
        let resConf = {bundle:GameBundle.NORMAL,path:info.skeleton}
        let spinePrams:inf_SpineAniCreate = {
            resConf:resConf,
            aniName:"idle",
            parentNode:this.sk_sp,
            isLoop:true,
        }
        EventMgr.dispatch(EventType.Sys_Ani_Play,spinePrams);
    }

}


