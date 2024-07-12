import { EventTouch, Node, NodeEventType, UITransform, Vec3, _decorator, easing, tween, view } from 'cc';
import { BaseView } from './BaseView';
const { ccclass, property } = _decorator;

@ccclass('BasePopup')
export class BasePopup extends BaseView  {
    onDestroy(): void {
        super.onDestroy();
        this.node.parent.destroy();
    }
    closePop(){
        this.closeAnim();
    }

    start() {
        this.initEvent();
	}

    showAnim(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.initUI();
            this.node.scale = new Vec3(0.2, 0.2, 1.0);
            let realSize = view.getVisibleSize();
            let minscale =  Number(Math.min(realSize.height / 1000, realSize.width / 1778).toFixed(3));
            tween(this.node)
                .to(0.2, { scale: new Vec3(minscale, minscale, minscale) }, { easing: easing.backOut })
                .call(() => {
                    resolve();
                })
                .start();
        });
    }
    closeAnim() {
        tween(this.node).to(0.2, { scale: new Vec3(0.0, 0.0, 0.0) }, { easing: easing.backIn }).call(() => {
            this.node.parent.destroy();
        }).start();
    }
    /**
     * 点击非nds数组中的对象，则关闭弹窗，需手动调用开启;
     * 其他触摸控件如Button、Toggle等会优先响应，不用加到数组
     */
    enableClickBlankToClose(nds: Node[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const touchEndHandler = (evt: EventTouch) => {
                const startPos = evt.getUIStartLocation();
                const endPos = evt.getUILocation();
                const subPos = endPos.subtract(startPos);
                if (Math.abs(subPos.x) < 15 && Math.abs(subPos.y) < 15) {
                    let needClose = true;
                    for (let i = 0; i < nds.length; ++i) {
                        const uiTransform = nds[i].getComponent(UITransform);
                        if (uiTransform && uiTransform.getBoundingBoxToWorld().contains(startPos)) {
                            needClose = false;
                            break;
                        }
                    }
                    if (needClose) {
                        this.node.off(NodeEventType.TOUCH_END, touchEndHandler, this);
                        resolve();
                        // SoundMgr.click();
                        this.closePop();   
                    }
                }
            };
            this.node.on(NodeEventType.TOUCH_END, touchEndHandler, this);
        });
    }
    
}


