import { _decorator, Color, Component, EventTouch, Node, Sprite, tween, UITransform, Vec3 } from 'cc';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('SwitchComponent')
export class SwitchComponent extends Component {
    @property({ type: Node })
    thumb: Node | null = null;

    @property({ type: Node })
    background: Node | null = null;

    @property
    switchWidth: number = 100;

    @property
    switchHeight: number = 50;

    @property
    switchDuration: number = 0.2;

    @property
    isOn: boolean = false;

    private _touchStarted: boolean = false;
    private _thumbWidth: number = 0;

    // Event name constants
    private _swichListener:(status:boolean) => void = null;
    onLoad() {
        if (this.thumb && this.background) {
            const thumbTransform = this.thumb.getComponent(UITransform);
            if (thumbTransform) {
                this._thumbWidth = thumbTransform.width;
            }
            this.updateSwitchPosition();
            this.updateBackgroundColor();
        }
        this.initEvent();
    }

    initEvent() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        // Add click handling
        CCUtil.onBtnClick(this.thumb, this.onClick.bind(this));
    }

    removeEvent() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        this._touchStarted = true;
    }

    onTouchMove(event: EventTouch) {
        if (!this._touchStarted || !this.thumb) return;

        const delta = event.getDelta();
        const thumbPos = this.thumb.position.clone();
        thumbPos.x += delta.x;

        const maxPos = this.switchWidth - this._thumbWidth / 2;
        const minPos = -this._thumbWidth / 2;
        thumbPos.x = Math.max(Math.min(thumbPos.x, maxPos), minPos);

        this.thumb.setPosition(thumbPos);
    }

    onTouchEnd(event: EventTouch) {
        if (!this._touchStarted) return;

        this._touchStarted = false;
        const thumbPosX = this.thumb?.position.x ?? 0;
        const center = this.switchWidth / 2;
        const newState = thumbPosX > center;

        this.setSwitchState(newState);
    }

    onClick() {
        this.setSwitchState(!this.isOn);
    }

    updateSwitchPosition() {
        if (this.thumb) {
            const thumbPosX = this.isOn ? (this.switchWidth - this._thumbWidth / 2) : -this._thumbWidth / 2;
            tween(this.thumb)
                .to(this.switchDuration, { position: new Vec3(thumbPosX, this.thumb.position.y, this.thumb.position.z) })
                .start();
        }
    }

    updateBackgroundColor() {
        if (this.background) {
            const color = this.isOn ? new Color(245, 168, 22) : new Color(255, 255, 255); // Yellow for on, White for off
            const sprite = this.background.getComponent(Sprite);
            if (sprite) {
                sprite.color = color;
            }
        }
    }

    setSwitchState(state: boolean) {
        if (this.isOn !== state) {
            this.isOn = state;
            this.updateSwitchPosition();
            this.updateBackgroundColor();
            this.emitSwitchChangedEvent(); // Trigger the custom event
        }
    }
    emitSwitchChangedEvent() {
        this._swichListener(this.isOn);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    setSwichListener(callback:(status:boolean) => void){
        this._swichListener = callback;
    }
}
