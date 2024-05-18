import { _decorator, Component, ProgressBar, Tween, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EditAnimView')
export class EditAnimView extends Component {
    @property(ProgressBar)
    public progress: ProgressBar = null;

    start() {

    }

    showAnim() {
        this.stopAnim();
        this.progress.progress = 0;

        let children = this.node.children;
        children.forEach(child => {
            child.active = false;
        });
        tween(this.progress).delay(0.5).call(() => {
            children.forEach(child => {
                child.active = true;
            });
        }).to(0.5, { progress: 1.0 }).start();
    }

    stopAnim() {
        Tween.stopAllByTarget(this.node);
    }
}


