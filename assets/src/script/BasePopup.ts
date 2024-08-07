import { EventTouch, Node, NodeEventType, UITransform, Vec2, Vec3, _decorator, easing, tween, view } from 'cc';
import { BaseView } from './BaseView';

const { ccclass, property } = _decorator;

@ccclass('BasePopup')
export class BasePopup extends BaseView {

    private touchEndHandler: (evt: EventTouch) => void;

    onDestroy(): void {
        super.onDestroy();
        this.node.parent.destroy();  // Ensure parent is destroyed to prevent memory leaks
    }

    start() {
        this.initEvent();
    }

    showAnim(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.initUI();
            this.node.scale = new Vec3(0.2, 0.2, 1.0);
            const realSize = view.getVisibleSize();
            const minscale = Number(Math.min(realSize.height / 1000, realSize.width / 1778).toFixed(3));

            tween(this.node)
                .to(0.2, { scale: new Vec3(minscale, minscale, minscale) }, { easing: easing.backOut })
                .call(() => resolve())
                .start();
        });
    }

    closeAnim() {
        tween(this.node)
            .to(0.2, { scale: new Vec3(0.0, 0.0, 0.0) }, { easing: easing.backIn })
            .call(() => this.node.parent.destroy())
            .start();
    }

    enableClickBlankToClose(excludedNodes: Node[]): Promise<void> {
        return new Promise<void>((resolve) => {
            this.touchEndHandler = (evt: EventTouch) => {
                const startPos = evt.getUIStartLocation();
                const endPos = evt.getUILocation();
                const subPos = endPos.subtract(startPos);

                if (Math.abs(subPos.x) < 15 && Math.abs(subPos.y) < 15) {
                    if (this.isTouchOutsideExcludedNodes(new Vec3(startPos.x, startPos.y, 0), excludedNodes)) {
                        this.node.off(NodeEventType.TOUCH_END, this.touchEndHandler, this);
                        resolve();
                        this.closePop();
                    }
                }
            };

            this.node.on(NodeEventType.TOUCH_END, this.touchEndHandler, this);
        });
    }

    private isTouchOutsideExcludedNodes(touchPos: Vec3, excludedNodes: Node[]): boolean {
        return excludedNodes.every(node => {
            const uiTransform = node.getComponent(UITransform);
            if (uiTransform) {
                const boundingBox = uiTransform.getBoundingBoxToWorld();
                // Adjust for Vec3 and Vec2 compatibility if necessary
                return !boundingBox.contains(new Vec2(touchPos.x, touchPos.y));
            }
            return true;
        });
    }

    unableClickBlankToClose() {
        if (this.touchEndHandler) {
            this.node.off(NodeEventType.TOUCH_END, this.touchEndHandler, this);
            this.touchEndHandler = null;
        }
    }

    closePop() {
        this.closeAnim();
    }
}
