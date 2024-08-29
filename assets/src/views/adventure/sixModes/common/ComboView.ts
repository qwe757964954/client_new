import { _decorator, Component, Node } from 'cc';
import { EventType } from '../../../../config/EventType';
import { PrefabType } from '../../../../config/PrefabType';
import { GameRes } from '../../../../GameRes';
import { inf_SpineAniCreate } from '../../../../manager/InterfaceDefines';
import { SoundMgr } from '../../../../manager/SoundMgr';
import { ViewsMgr } from '../../../../manager/ViewsManager';
import { EventMgr } from '../../../../util/EventManager';
const { ccclass, property } = _decorator;

@ccclass('ComboView')
export class ComboView extends Component {
    @property(Node)
    public aniNode:Node = null;

    showComboAnimation(comboNum:number){
        SoundMgr.correct();
        const aniName = this.getSpineAnimationName(comboNum);
        const spineParams: inf_SpineAniCreate = {
            resConf: GameRes.Spine_Correct,
            aniName: aniName,
            trackIndex: 0,
            parentNode: this.aniNode,
            isLoop: false,
            callEndFunc: () => {
                ViewsMgr.closeView(PrefabType.ComboView);
            }
        };
        this.aniNode.removeAllChildren();
        EventMgr.dispatch(EventType.Sys_Ani_Play, spineParams);
    }

    private getSpineAnimationName(comboNum:number): string {
        if (comboNum === 1) return "animation_2";
        if (comboNum === 2) return "animation_1";
        return Math.random() > 0.5 ? "animation_3" : "animation_4";
    }

}

