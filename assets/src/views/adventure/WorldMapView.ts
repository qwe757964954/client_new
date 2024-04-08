import { _decorator, Button, Component, Node, Sprite, Tween, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;
/**大冒险 世界地图 何存发 2024年4月8日14:45:44 */
@ccclass('WorldMapView')
export class WorldMapView extends Component {


    @property({ type: [Node], tooltip: "地图" })
    public mapView: Node[] = [];
    @property({ type: Button, tooltip: "帮助按钮" })
    public btn_help: Button = null!;
    private _openlevels: number = 0;//开放到第几关

    private selectID: number = 0;//选中的关卡
    start() {

    }

    onLoad(): void {
        this.initUI()
        this.initEvent();
    }
    /**初始化ui */
    private initUI() {
        for (let i = 0; i < this.mapView.length; i++) {
            if (i > this._openlevels) {
                this.mapView[i].getComponent(Sprite).grayscale = true
                let _node = this.mapView[i].children
                _node[0].getComponent(Sprite).grayscale = true
            }
            if (i == this.selectID) {
                tween(this.mapView[i]).to(0.5, { scale: v3(0.85, 0.85) }).to(0.5, { scale: v3(0.8, 0.8) }).union().repeatForever().start()
            }
        }
    }
    /**切换关卡 */
    private switchLevels(i: number) {
        console.log('切换关卡')
        for (let i in this.mapView) {
            Tween.stopAllByTarget(this.mapView[i])
            this.mapView[i].scale = v3(0.8, 0.8, 0.8)
        }
        tween(this.mapView[i]).to(0.5, { scale: v3(0.85, 0.85) }).to(0.5, { scale: v3(0.8, 0.8) }).union().repeatForever().start()


    }

    /**初始化监听事件 */
    initEvent() {
        for (let i in this.mapView) {
            this.mapView[i].on(Node.EventType.TOUCH_END, this.switchLevels.bind(this, i), this)
        }
        this.btn_help.node.on(Node.EventType.TOUCH_END, this.openHelp, this)
    }
    /**移除监听 */
    removeEvent() {
        for (let i in this.mapView) {
            this.mapView[i].off(Node.EventType.TOUCH_END, this.switchLevels, this)
        }
        this.btn_help.node.off(Node.EventType.TOUCH_END, this.openHelp, this)

    }
    /**打开帮助页面 */
    private openHelp() {
        console.log('帮助页面!')
    }

    update(deltaTime: number) {

    }
    onDestroy() {
        this.removeEvent()
    }



}


