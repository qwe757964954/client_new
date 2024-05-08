import { _decorator, Color, Component, Node, Sprite, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

//过渡界面
@ccclass('TransitionView')
export class TransitionView extends Component {
    @property({ type: Sprite, tooltip: "背景" })
    public bg: Sprite = null;

    private _callback: Function = null;
    start() {
        let uiOpacity = this.bg.getComponent(UIOpacity);
        uiOpacity.opacity = 0;
        tween(uiOpacity).to(0.5, { opacity: 255 }).call(() => {
            if (this._callback) this._callback();
        }).to(0.5, { opacity: 0 }).call(() => {
            this.node.removeFromParent();
            this.destroy();
        }).start();
    }

    setTransitionCallback(callback: Function) {
        this._callback = callback;
    }
}


