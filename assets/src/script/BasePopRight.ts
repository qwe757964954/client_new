import { _decorator, easing, tween, UITransform, Vec3, view } from 'cc';
import { BasePopupBase } from './BasePopupBase';

const { ccclass } = _decorator;

@ccclass('BasePopRight')
export class BasePopRight extends BasePopupBase {

    public async animateIn(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.animatedNode) {
                console.error('No animated node found for animation.');
                resolve();
                return;
            }

            const { width } = view.getVisibleSize();
            const startY = this.animatedNode.getPosition().y;
            const scaleX = this.animatedNode.getScale().x;
            const startPosition = new Vec3(width, startY, 0);
            this.animatedNode.position = startPosition;

            const { width: nodeWidth } = this.animatedNode.getComponent(UITransform)!;
            const finalPosition = new Vec3((width - nodeWidth * scaleX) / 2, startY, 0);

            this.animatedNode.active = true;

            tween(this.animatedNode)
                .to(0.3, { position: finalPosition }, { easing: easing.sineInOut })
                .call(() => resolve())
                .start();
        });
    }

    public animateOut(): void {
        if (!this.animatedNode) {
            console.error('No animated node found for closing animation.');
            return;
        }

        const startY = this.animatedNode.getPosition().y;
        const { width } = view.getVisibleSize();
        const offScreenPosition = new Vec3(width, startY, 0);

        tween(this.animatedNode)
            .to(0.3, { position: offScreenPosition }, { easing: easing.sineInOut })
            .call(() => this.node.parent.destroy())
            .start();
    }

    async show(aniName: string): Promise<void> {
        this.animatedNode = this.node.getChildByName(aniName);
        await super.show();
    }
}
