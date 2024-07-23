import { _decorator, error, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
import { EducationDataInfos } from '../TextbookVocabulary/TextbookInfo';
const { ccclass, property } = _decorator;

@ccclass('UnitNumItem')
export class UnitNumItem extends ListItem {
    @property(Node)
    public rewad_progress:Node = null;
    start() {

    }

    updateRewardStatus(isComplete:boolean = false) {
        this.loadRewardKey();
        this.rewad_progress.getComponent(Sprite).grayscale = !isComplete;
    }

    loadRewardKey(){
        let key_str = EducationDataInfos[0].lock_opener;
        ResLoader.instance.load(key_str, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
            }
            this.rewad_progress.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }
}


