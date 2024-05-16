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
        tween(this.progress).to(1.0, { progress: 1.0 }).start();
    }

    stopAnim() {
        Tween.stopAllByTarget(this.node);
    }
}


