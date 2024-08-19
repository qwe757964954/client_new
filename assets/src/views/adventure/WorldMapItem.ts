import { _decorator, error, Label, Node, Sprite, SpriteFrame } from 'cc';
import { DataMgr } from '../../manager/DataMgr';
import { ResLoader } from '../../manager/ResLoader';
import { LandStatusResponse } from '../../models/AdventureModel';
import ListItem from '../../util/list/ListItem';
import { ObjectUtil } from '../../util/ObjectUtil';
const { ccclass, property } = _decorator;

@ccclass('WorldMapItem')
export class WorldMapItem extends ListItem {

    @property(Node)
    public icon: Node = null;
    @property(Label)
    levelTxt: Label = null;
    start() {

    }

    updateItemProps(idx: number, currentPass: LandStatusResponse) {
        let islandData = DataMgr.getIslandData(idx + 1);
        this.levelTxt.string = islandData.grade;
        let index = idx > 6 ? 6 : idx;
        let img_url = `adventure/worldMap/img_map_${index}/spriteFrame`
        const isValid = ObjectUtil.isBigIdValid(islandData.big_id, currentPass);
        ResLoader.instance.load(img_url, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let sp = this.icon.getComponent(Sprite);
            sp.spriteFrame = spriteFrame;
            sp.grayscale = !isValid;
        });
    }
}


