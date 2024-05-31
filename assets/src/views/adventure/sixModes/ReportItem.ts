import { _decorator, error, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ResLoader } from '../../../manager/ResLoader';
import ListItem from '../../../util/list/ListItem';
const { ccclass, property } = _decorator;

export enum ReportItemType {
    coin= "coin",/**金币 */
    diamond= "diamond",/**钻石 */
}


@ccclass('ReportItem')
export class ReportItem extends ListItem {

    @property(Node)
    public icon:Node = null;

    @property(Label)
    public num_text:Label = null;

    start() {

    }

    updateItemProps(key:string, value:number){
        let icon_url = ""
        switch (key) {
            case ReportItemType.coin:
                icon_url = "common/img_coin/spriteFrame";
                break;
            case ReportItemType.diamond:
                icon_url = "common/img_diamond/spriteFrame";
                break;
            default:
                break;
        }
        ResLoader.instance.load(icon_url, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
                return;
            }
            this.icon.getComponent(Sprite).spriteFrame = spriteFrame;
        });

        this.num_text.string = `x${value}`;
        
    }
}


