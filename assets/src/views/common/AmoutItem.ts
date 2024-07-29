import { _decorator, Label, Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { ResLoader } from '../../manager/ResLoader';
import ListItem from '../../util/list/ListItem';
import { AmoutItemData, AmoutType } from './TopAmoutView';
const { ccclass, property } = _decorator;

@ccclass('AmoutItem')
export class AmoutItem extends ListItem {
    @property({ type: Label, tooltip: "数值" })
    public amoutText: Label = null;

    @property({ type: Node, tooltip: "图标节点" })
    public aliveIcon: Node = null;

    @property({ type: Node, tooltip: "添加图标节点" })
    public addIcon: Node = null;

    @property({ type: Node, tooltip: "背景节点" })
    public bg: Node = null;

    public amountInfo: AmoutItemData = null;        

    start() {}

    updateItemProps(idx: number, itemInfo: AmoutItemData) {
        this.amountInfo = itemInfo;
        this.updateAmount(itemInfo.num);
        this.updateIcons(itemInfo);
    }

    public updateAmount(amount: number) {
        this.amoutText.string = amount.toString();
    }

    private updateIcons(itemInfo: AmoutItemData) {
        let iconData = this.getIconData(itemInfo.type);
        if (iconData) {
            this.updateIconSize(iconData.size);
            this.updateIconSprite(this.addIcon, iconData.addUrl);
            this.updateIconSprite(this.aliveIcon, iconData.activeUrl);
            this.updateIconSprite(this.bg, iconData.bgUrl);
        }
    }

    private getIconData(type: AmoutType) {
        switch (type) {
            case AmoutType.Coin:
                return {
                    size: { width: 56, height: 57 },
                    addUrl: "common/word_0022_icon/spriteFrame",
                    activeUrl: "common/img_coin/spriteFrame",
                    bgUrl: "common/normal_bg/spriteFrame"
                };
            case AmoutType.Diamond:
                return {
                    size: { width: 50, height: 53 },
                    addUrl: "common/add/spriteFrame",
                    activeUrl: "common/img_diamond/spriteFrame",
                    bgUrl: "common/normal_bg/spriteFrame"
                };
            case AmoutType.Energy:
                return {
                    size: { width: 39, height: 58 },
                    addUrl: "common/word_0023_icon/spriteFrame",
                    activeUrl: "common/img_energy/spriteFrame",
                    bgUrl: "common/energy_bg/spriteFrame"
                };
            default:
                return null;
        }
    }

    private updateIconSize(size: { width: number; height: number }) {
        const transform = this.aliveIcon.getComponent(UITransform);
        transform.width = size.width;
        transform.height = size.height;
    }

    private updateIconSprite(node: Node, url: string) {
        ResLoader.instance.load(url, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            spriteFrame.addRef();
            node.once(Node.EventType.NODE_DESTROYED, () => {
                LoadManager.releaseAsset(spriteFrame);
            });
            const sprite = node.getComponent(Sprite);
            if (sprite) {
                sprite.spriteFrame = spriteFrame;
            }
        });
    }
}
