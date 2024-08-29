import { _decorator, Label, tween, UIOpacity, Vec3 } from 'cc';
import { BasePopStudy } from '../../../../script/BasePopStudy';
const { ccclass, property } = _decorator;

@ccclass('ComboRightView')
export class ComboRightView extends BasePopStudy {
    @property(Label)
    public comboText:Label = null;
    
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

    changeComboText(num: number) {
        this.animateComboTextChange();
        this.comboText.string = `X${num}`;
        this.scheduleOnce(()=>{
            this.animateOut();
        },2);
    }

}

