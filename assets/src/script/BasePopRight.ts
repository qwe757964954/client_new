import { _decorator, easing, Node, tween, UITransform, Vec3, view } from 'cc';
import { BasePopupBase } from './BasePopupBase';

const { ccclass } = _decorator;

@ccclass('BasePopRight')
export class BasePopRight extends BasePopupBase {

    private animatedNode: Node | null = null;

    public async animateIn(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.animatedNode) {
                console.error('No child node provided for animation.');
                this.initUI();
                resolve();
                return;
            }

            // Set initial position off-screen to the right
            const { width } = view.getVisibleSize();
            const startY = this.animatedNode.getPosition().y;
            const startPosition = new Vec3(width, startY, 0); // Start off-screen to the right
            this.animatedNode.position = startPosition;
            this.initUI();
            const { width: nodeWidth } = this.animatedNode.getComponent(UITransform)!;
            const scale = this.animatedNode.getScale();
            const finalPosition = new Vec3((width - nodeWidth * scale.x) / 2, startY, 0);

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
        const offScreenPosition = new Vec3(width, startY, 0); // Off-screen to the right

        tween(this.animatedNode)
            .to(0.3, { position: offScreenPosition }, { easing: easing.sineInOut })
            .call(() => this.node.parent.destroy())
            .start();
    }

    // Ensure the child node is set before calling `show`
    async show(aniName: string): Promise<void> {
        this.animatedNode = this.node.getChildByName(aniName);
        await super.show();
    }
}
