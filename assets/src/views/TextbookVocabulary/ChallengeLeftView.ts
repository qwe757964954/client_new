import { _decorator, error, Node, Sprite, SpriteFrame } from 'cc';
import { EventType } from '../../config/EventType';
import { GameBundle } from '../../GameRes';
import { inf_SpineAniCreate } from '../../manager/InterfaceDefines';
import { ResLoader } from '../../manager/ResLoader';
import { BaseView } from '../../script/BaseView';
import { EventMgr } from '../../util/EventManager';
import { EducationDataInfos } from './TextbookInfo';
const { ccclass, property } = _decorator;

@ccclass('ChallengeLeftView')
export class ChallengeLeftView extends BaseView {
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
        this.loadRewardKey();
    }

    protected onInitModuleEvent() {
        // this.addModelListener(EventType.Show_TextBook_Monster,this.loadMonsterSkelton);
	}

    loadMonsterSkelton(){
        this.sk_monster.removeAllChildren();
        let sp_str = EducationDataInfos[0].monster;
        const resConf = { bundle: GameBundle.NORMAL, path: sp_str };
        let spinePrams:inf_SpineAniCreate = {
            resConf:resConf,
            aniName:"idle",
            parentNode:this.sk_monster,
            isLoop:true,
            // isPremult:true,
            // toPos:new Vec3(34.822,-258.273)
        }
        EventMgr.dispatch(EventType.Sys_Ani_Play,spinePrams);
    }

    loadRewardKey(){
        let key_str = EducationDataInfos[0].lock_opener;
        ResLoader.instance.load(key_str, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
            }
            this.rewad_key.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }
}


