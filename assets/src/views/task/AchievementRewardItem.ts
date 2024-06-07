import { _decorator, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
import { AchevementRewardInfos } from './TaskInfo';
const { ccclass, property } = _decorator;

@ccclass('AchievementRewardItem')
export class AchievementRewardItem extends ListItem {
    @property(Node)
    public icon:Node = null;

    @property(Label)
    public name_text:Label = null;

    @property(Label)
    public process_text:Label = null;

    initPropsItem(idx: number): void {
        this.name_text.string = AchevementRewardInfos[idx].title;
        let spritePath = `task/${AchevementRewardInfos[idx].imageUrl}/spriteFrame`;
        ResLoader.instance.load(spritePath, SpriteFrame, async (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                console.error(err);
            } else {
                this.icon.getComponent(Sprite).spriteFrame = spriteFrame;
            }
        });
    }
}


