import { _decorator, Label, Node, Sprite, SpriteFrame } from 'cc';
import { EventType } from '../../config/EventType';
import { GameBundle } from '../../GameRes';
import { IslandData } from '../../manager/DataMgr';
import { inf_SpineAniCreate } from '../../manager/InterfaceDefines';
import { ResLoader } from '../../manager/ResLoader';
import { LandStatusResponse } from '../../models/AdventureModel';
import { EventMgr } from '../../util/EventManager';
import ListItem from '../../util/list/ListItem';
import { ObjectUtil } from '../../util/ObjectUtil';
import { EvaluationModel } from './AdventureInfo';

const { ccclass, property } = _decorator;

@ccclass('WorldMapItem')
export class WorldMapItem extends ListItem {

    @property(Node)
    public icon: Node = null;

    @property(Label)
    private levelTxt: Label = null;

    @property(Node)
    private content: Node = null;

    @property(Node)
    private talk: Node = null;

    @property(Node)
    private spNode: Node = null;

    @property(Label)
    private tips: Label = null;

    start() {
    }

    updateItemProps(data: EvaluationModel | IslandData, currentPass: LandStatusResponse) {
        const isIslandData = ObjectUtil.isIslandData(data);

        this.content.active = isIslandData;
        this.talk.active = !isIslandData;

        if (isIslandData) {
            this.updateIslandData(data as IslandData, currentPass);
        } else {
            this.updateEvaluationData(data as EvaluationModel);
        }
    }

    private updateIslandData(islandData: IslandData, currentPass: LandStatusResponse) {
        this.levelTxt.string = islandData.grade;

        const index = islandData.big_id - 1;
        const img_url = `adventure/worldMap/img_map_${index}/spriteFrame`;
        const isValid = ObjectUtil.isBigIdValid(islandData.big_id, currentPass);

        ResLoader.instance.load(img_url, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }

            const sprite = this.icon.getComponent(Sprite);
            if (sprite) {
                sprite.spriteFrame = spriteFrame;
                sprite.grayscale = !isValid;
            }
        });
    }

    private updateEvaluationData(evData: EvaluationModel) {
        this.tips.string = evData.message;

        const pathStr = `spine/reward/qingzhurenwu.json`;
        const resConf = { bundle: GameBundle.NORMAL, path: pathStr };
        const spineParams: inf_SpineAniCreate = {
            resConf: resConf,
            aniName: "people01",
            parentNode: this.spNode,
            isLoop: true,
            isPremult: true,
        };

        this.spNode.removeAllChildren();
        EventMgr.dispatch(EventType.Sys_Ani_Play, spineParams);
    }
}
