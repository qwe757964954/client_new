import { _decorator, easing, tween, Vec3, view } from 'cc';
import { BasePopupBase } from './BasePopupBase';

const { ccclass } = _decorator;

@ccclass('BasePopup')
export class BasePopup extends BasePopupBase {

    public async animateIn(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.node.scale = new Vec3(0.2, 0.2, 1.0);
            const { width, height } = view.getVisibleSize();
            const minscale = Math.min(height / 1000, width / 1778).toFixed(3);

            tween(this.node)
                .to(0.2, { scale: new Vec3(parseFloat(minscale), parseFloat(minscale), 1.0) }, { easing: easing.backOut })
                .call(() => resolve())
                .start();
        });
    }

    public animateOut(): void {
        tween(this.node)
            .to(0.2, { scale: new Vec3(0.0, 0.0, 0.0) }, { easing: easing.backIn })
            .call(() => this.node.parent.destroy())
            .start();
    }
}
