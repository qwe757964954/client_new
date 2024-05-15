import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import { EventType } from '../../config/EventType';
import { GameBundle } from '../../GameRes';
import { inf_SpineAniCreate } from '../../manager/InterfaceDefines';
import { EventMgr } from '../../util/EventManager';
import { BossGameInfo, BossInfo } from './BossInfo';
const { ccclass, property } = _decorator;

@ccclass('CenterBossView')
export class CenterBossView extends Component {

    @property(Label)
    public title_name:Label = null;

    @property(Label)
    public remaining_word_text:Label = null;

    @property(Node)
    public sk_sp:Node = null;

    @property(ProgressBar)
    public learn_progress:ProgressBar = null;
    

    start() {
    }

    
    updateCenterProps(gameInfo:BossGameInfo,info: BossInfo){
        this.title_name.string = info.name;
        this.learn_progress.progress = gameInfo.LastNum/gameInfo.TotalWordNum;
        this.remaining_word_text.string = `剩余单词量：${gameInfo.LastNum}`;
        this.sk_sp.setScale(info.scale,info.scale,info.scale);
        let resConf = {bundle:GameBundle.NORMAL,path:info.skeleton}
        let self = this;
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
}


