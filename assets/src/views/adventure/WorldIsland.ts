import { _decorator, Button, Component, instantiate, Node, Prefab, tween, v3 } from 'cc';
import CCUtil from '../../util/CCUtil';
import { EventType } from '../../config/EventType';
import EventManager from '../../util/EventManager';
const { ccclass, property } = _decorator;

/**魔法森林 何存发 2024年4月9日17:51:36 */
@ccclass('WorldIsland')
export class WorldIsland extends Component {

    @property({ type: Node, tooltip: "列表" })
    public mapList: Node = null;
    @property({ type: Node, tooltip: "地图块" })
    public mapItem: Node = null;
    @property({ type: Node, tooltip: "返回按钮" })
    public back: Node = null;
    @property({ type: Button, tooltip: "闯关详情" })
    public btn_details: Button = null;
    @property({ type: Button, tooltip: "我的位置" })
    public btn_pos: Button = null;
    @property({ type: Node, tooltip: "面板" })
    public panel: Node = null;
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

    private onBtnDetailsClick() {
        tween(this.panel).to(0.3, { position: v3(0, 0, 0) }).call(() => {
        }).start()
    }
    private onBtnBackClick() {
        EventManager.emit(EventType.study_page_switching, [1, null, 6])

    }

    /**初始化列表 */
    private initlist() {
        this.mapList.removeAllChildren()
        for (let i = 0; i < 29; i++) {
            let node = instantiate(this.mapItem)
            this.mapList.insertChild(node, 0)
            node.position = v3(1, 347 * i, 0)
            if (i >= 25) {
                node.scale = v3(0.0001, 1, 0)
            }
        }

    }

    protected onDestroy(): void {
        this.removeEvent()
    }

}


