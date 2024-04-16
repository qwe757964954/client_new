import { _decorator, Button, Component, Node, Sprite, Tween, tween, v3 } from 'cc';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;
/**大冒险 世界地图 何存发 2024年4月8日14:45:44 */
@ccclass('WorldMapView')
export class WorldMapView extends Component {


    @property({ type: [Node], tooltip: "地图" })
    public mapView: Node[] = [];
    @property({ type: Button, tooltip: "返回按钮" })
    public btn_back: Button = null!;
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

    }
    /**切换关卡 */
    private switchLevels(i: number) {
        console.log('切换关卡', i)
        EventManager.emit(EventType.study_page_switching, [2])


    }

    /**初始化监听事件 */
    initEvent() {
        for (let i in this.mapView) {
            CCUtil.onTouch(this.mapView[i], this.switchLevels.bind(this, i), this)
        }
        CCUtil.onTouch(this.btn_back.node, this.onBtnBackClick, this)

    }
    /**移除监听 */
    removeEvent() {
        for (let i in this.mapView) {
            CCUtil.offTouch(this.mapView[i], this.switchLevels.bind(this, i), this)
        }
        CCUtil.offTouch(this.btn_back.node, this.onBtnBackClick, this)

    }
    /**点击返回按钮 */
    onBtnBackClick() {
        EventManager.emit(EventType.study_page_switching, [0])
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


