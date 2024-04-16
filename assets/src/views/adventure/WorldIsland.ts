import { _decorator, Button, Component, instantiate, Node, Prefab, tween, v3 } from 'cc';
import CCUtil from '../../util/CCUtil';
import { EventType } from '../../config/EventType';
import EventManager from '../../util/EventManager';
import { MapView } from './levelmap/MapView';
const { ccclass, property } = _decorator;

/**魔法森林 何存发 2024年4月9日17:51:36 */
@ccclass('WorldIsland')
export class WorldIsland extends Component {

    @property({ type: Node, tooltip: "列表" })
    public mapList: Node = null;
    @property({ type: Node, tooltip: "返回按钮" })
    public back: Node = null;
    @property({ type: Button, tooltip: "闯关详情" })
    public btn_details: Button = null;
    @property({ type: Button, tooltip: "我的位置" })
    public btn_pos: Button = null;
    @property({ type: Node, tooltip: "面板" })
    public panel: Node = null;
    @property({ type: Node, tooltip: "关卡选择页面" })
    public levelPanel: Node = null;
    start() {

    }

    update(deltaTime: number) {

    }
    protected onLoad(): void {
        this.initUI()
        this.initEvent()
    }

    /**初始化UI */
    private initUI() {
        this.initlist()
        this.levelPanel.position = v3(900, 100, 0);
    }

    /**初始化监听事件 */
    private initEvent() {
        CCUtil.onTouch(this.back, this.onBtnBackClick, this)
        CCUtil.onTouch(this.btn_details, this.onBtnDetailsClick, this)

    }
    /**移除监听 */
    private removeEvent() {
        CCUtil.offTouch(this.back, this.onBtnBackClick, this)
        CCUtil.offTouch(this.btn_details, this.onBtnDetailsClick, this)
    }

    onBtnDetailsClick() {
        this.panel.active = true;
        tween(this.panel).to(0.3, { position: v3(0, 0, 0) }).call(() => {
        }).start()
    }
    private onBtnBackClick() {
        EventManager.emit(EventType.study_page_switching, [1])

    }

    /**初始化列表 */
    private initlist() {
       
    }


    protected onDestroy(): void {
        this.removeEvent()
    }

}


