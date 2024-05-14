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
        this.sk_sp.removeAllChildren();
        this.sk_sp.setScale(info.scale,info.scale,info.scale);
        let resConf = {bundle:GameBundle.NORMAL,path:info.skeleton}
        let spinePrams:inf_SpineAniCreate = {
            resConf:resConf,
            aniName:"attack",
            parentNode:this.sk_sp,
            isLoop:false,
            // callEndFunc:(trackEntry, skeleton)=>{
                // console.log(trackEntry)
                // console.log(skeleton)
                // let key = `${GameBundle.NORMAL}|${info.skeleton}|attack|`;
                // let aniNode = SpMgr.getSpineNode(key)
                // aniNode.active = true;
                // let aniSk = aniNode.getComponent(sp.Skeleton);
                // console.log(aniNode)
                // console.log(aniSk)
                // aniSk.setAnimation(0,"idle",true);
                // aniNode.active = true;
                // this.sk_sp.removeAllChildren();
                // let aniPrams:inf_SpineAniCreate = {
                //     resConf:resConf,
                //     aniName:"idle",
                //     parentNode:this.sk_sp,
                //     isLoop:true,
                // }
                // EventMgr.dispatch(EventType.Sys_Ani_Play,aniPrams);
            // }
        }
        this.scheduleOnce(()=>{
            // let key = `${GameBundle.NORMAL}|${info.skeleton}|attack|`;
            // let aniNode = SpMgr.getSpineNode(key)
            // aniNode.active = true;
            // let aniSk = aniNode.getComponent(sp.Skeleton);
            // console.log(aniNode)
            // console.log(aniSk)
            // aniSk.clearAnimations();
            // aniSk.clearTracks();
            // aniSk.setAnimation(0,"idle",true);
            // aniSk.updateAnimation(0);
            // aniNode.active = true;
        },3)
        EventMgr.dispatch(EventType.Sys_Ani_Play,spinePrams);
    }
}


