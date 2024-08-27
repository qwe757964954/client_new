import { EventTouch, Node, NodeEventType, UITransform, Vec2, Vec3, _decorator } from 'cc';
import { BaseView } from './BaseView';

const { ccclass } = _decorator;

@ccclass('BasePopupBase')
export abstract class BasePopupBase extends BaseView {
    private touchEndHandler: (evt: EventTouch) => void = null;
    protected animatedNode: Node | null = null;
    protected parent: Node | null = null;
    onDestroy(): void {
        super.onDestroy();
        if(this.parent){
            this.node.destroy();
            return
        }
        if (this.node.parent) {
            this.node.parent.destroy(); // Ensure parent is destroyed to prevent memory leaks
        }
    }

    async show(aniName?: string, parent?: Node): Promise<void> {
        this.initUI();
        await this.animateIn();

        // if (aniName) {
        //     await this.animateIn();
        // }
    }

    abstract animateIn(): Promise<void>;
    abstract animateOut(): void;

    closePop(): void {
        this.animateOut();
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

    unableClickBlankToClose() {
        if (this.touchEndHandler) {
            this.node.off(NodeEventType.TOUCH_END, this.touchEndHandler, this);
            this.touchEndHandler = null;
            console.log("Touch end handler successfully removed.");
        } else {
            console.log("No touch end handler to remove.");
        }
    }

    private isTouchOutsideExcludedNodes(touchPos: Vec3, excludedNodes: Node[]): boolean {
        return excludedNodes.every(node => {
            const uiTransform = node.getComponent(UITransform);
            if (uiTransform) {
                const boundingBox = uiTransform.getBoundingBoxToWorld();
                return !boundingBox.contains(new Vec2(touchPos.x, touchPos.y));
            }
            return true;
        });
    }
}
