import { _decorator, Component, Node, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Shake')
export class Shake extends Component {
    private originalPosition: Vec3 | null = null;
    private shakeTween: Tween<Node> | null = null;
    private _isShaking: boolean = false;
    start() {
        this.originalPosition = null;
    }

    /** 抖动
     * @param duration 抖动时长
     * @param intensity 抖动强度
     */
    shakeNode(duration: number = 0.5, intensity: number = 6) {
        if (this._isShaking) return;
        this._isShaking = true;
        let node = this.node;
        this.originalPosition = node.position.clone();
        this.shakeTween = tween(node)
            .to(0.05, { position: new Vec3(this.originalPosition.x + Math.random() * intensity - intensity / 2, this.originalPosition.y - Math.random() * intensity - intensity / 2, 0) })
            .to(0.05, { position: new Vec3(this.originalPosition.x - Math.random() * intensity - intensity / 2, this.originalPosition.y + Math.random() * intensity - intensity / 2, 0) })
            .union()
            .repeatForever()
            .start();

        // 自动停止抖动的定时器
        this.scheduleOnce(() => {
            this.stopShake();
        }, duration);
    }

    stopShake() {
        this.unscheduleAllCallbacks();
        this._isShaking = false;
        if (this.shakeTween) {
            this.shakeTween.stop();
            this.shakeTween = null;
        }
        if (this.node && this.originalPosition) {
            this.node.setPosition(this.originalPosition); // 确保回到原来的位置
            this.originalPosition = null;
        }
    }
}


