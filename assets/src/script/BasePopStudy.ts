import { _decorator, easing, Node, tween, UITransform, Vec3, view } from 'cc';
import { BasePopupBase } from './BasePopupBase';

const { ccclass } = _decorator;

@ccclass('BasePopStudy')
export class BasePopStudy extends BasePopupBase {

    public async animateIn(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.animatedNode || !this.parent) {
                console.error('Animated node or parent is not set.');
                resolve();
                return;
            }

            const { width } = view.getVisibleSize();
            const startPosition = new Vec3(width, 0, 0);
            this.animatedNode.position = startPosition;

            const { width: nodeWidth } = this.animatedNode.getComponent(UITransform)!;
            const scaleX = this.animatedNode.getScale().x;
            const finalPosition = new Vec3((width - nodeWidth * scaleX ) / 2, 0, 0);

            // const finalPosition = new Vec3((width - nodeWidth) / 2, 0, 0);

            this.animatedNode.active = true;
            tween(this.animatedNode)
                .to(0.3, { position: finalPosition }, { easing: easing.sineInOut })
                .call(() => {
                    resolve();
                })
                .start();
        });
    }

    public animateOut(): void {
        if (!this.animatedNode || !this.parent) {
            console.error('Animated node or parent is not set.');
            return;
        }

        const { width } = view.getVisibleSize();
        const offScreenPosition = new Vec3(width, 0, 0);

        tween(this.animatedNode)
            .to(0.3, { position: offScreenPosition }, { easing: easing.sineInOut })
            .call(() => this.node.destroy())
            .start();
    }

    async show(aniName: string, parent: Node): Promise<void> {
        this.animatedNode = this.node.getChildByName(aniName);
        this.parent = parent;
        this.initUI();
        await this.animateIn();
    }

    closePop(): void {
        this.animateOut();
    }

    enableClickBlankToClose(excludedNodes: Node[]): Promise<void> {
        return super.enableClickBlankToClose(excludedNodes);
    }

    unableClickBlankToClose() {
        super.unableClickBlankToClose();
    }
}
