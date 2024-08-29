import { _decorator, Label, Node, tween, UIOpacity, Vec3 } from 'cc';
import { BasePopStudy } from '../../../../script/BasePopStudy';
const { ccclass, property } = _decorator;

@ccclass('ComboBestView')
export class ComboBestView extends BasePopStudy {
    @property(Label)
    public comboText: Label = null;

    @property(Node)
    public gift: Node = null;

    private animateComboTextChange() {
        const scaleTween = tween(this.comboText.node)
            .to(0.2, { scale: new Vec3(1.5, 1.5, 1.5) })
            .to(0.2, { scale: new Vec3(1, 1, 1) });

        const opacityTween = tween(this.comboText.node.getComponent(UIOpacity))
            .to(0.2, { opacity: 255 })
            .to(0.2, { opacity: 0 })
            .to(0.2, { opacity: 255 });

        tween(this.comboText.node)
            .sequence(scaleTween)
            .call(() => opacityTween.start())
            .start();
    }

    private animateGift() {
        const rotationTween = tween(this.gift)
            .to(0.5, { angle: 25 })
            .to(0.5, { angle: -25 })
            .to(0.5, { angle: 0 });

        const shakeTween = tween(this.gift)
            .to(0.5, { position: new Vec3(this.gift.position.x + 10, this.gift.position.y, 0) })
            .to(0.5, { position: new Vec3(this.gift.position.x - 10, this.gift.position.y, 0) })
            .to(0.5, { position: new Vec3(this.gift.position.x, this.gift.position.y, 0) });

        tween(this.gift)
            .parallel(rotationTween, shakeTween)
            .start();
    }

    changeComboText(num: number) {
        this.animateComboTextChange();
        this.comboText.string = `X${num}`;
        this.animateGift();
    }
}
