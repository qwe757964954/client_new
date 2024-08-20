import { _decorator, easing, Node, tween, UITransform, Vec3, view } from 'cc';
import { BaseView } from './BaseView';

const { ccclass } = _decorator;

@ccclass('BasePopFriend')
export class BasePopFriend extends BaseView {

    private animatedNode: Node | null = null;
    private parent:Node | null = null;
    public async animateIn(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.animatedNode) {
                console.error('No child node provided for animation.');
                this.initUI();
                resolve();
                return;
            }
            const { width } = view.getVisibleSize();
            const startPosition = new Vec3(width, 0, 0);
            this.animatedNode.position = startPosition;
            this.initUI();
            const { width: nodeWidth } = this.animatedNode.getComponent(UITransform)!;
            const { width: parentWidth } = this.parent.getComponent(UITransform)!;
            const scale = this.animatedNode.getScale();
            const parent_scale = this.parent.getScale();
            const finalPosition = new Vec3((width - nodeWidth * scale.x ) / 2 - 675, 0, 0);

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

        const { width } = view.getVisibleSize();
        const offScreenPosition = new Vec3(width, 0, 0); // Off-screen to the right

        tween(this.animatedNode)
            .to(0.3, { position: offScreenPosition }, { easing: easing.sineInOut })
            .call(() => this.node.parent.destroy())
            .start();
    }

    // Ensure the child node is set before calling `show`
    async show(aniName: string,parent:Node): Promise<void> {
        this.animatedNode = this.node.getChildByName(aniName);
        this.parent = parent;
        this.initUI();
        await this.animateIn();
    }
}
