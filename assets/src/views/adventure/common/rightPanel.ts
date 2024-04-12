import { _decorator, Component, instantiate, Node, Prefab, tween, v3 } from 'cc';
import CCUtil from '../../../util/CCUtil';
import EventManager from '../../../util/EventManager';
import { EventType } from '../../../config/EventType';
import { Equip_frame } from '../levelmap/Equip_frame';
import { ViewsManager } from '../../../manager/ViewsManager';
const { ccclass, property } = _decorator;

/**右边选择关卡界面 何存发 2024年4月12日14:21:29 */
@ccclass('rightPanel')
export class rightPanel extends Component {
    @property({ type: Node, tooltip: "关闭按钮" })
    public btn_close: Node = null;
    @property({ type: Node, tooltip: "怪物模型" })
    public monster: Node = null;
    @property({ type: Node, tooltip: "学习类型列表" })
    public studyTypelist: Node = null;
    @property({ type: Prefab, tooltip: "列表加载节点" })
    public listItem: Prefab = null;
    private _eveId: string;

    start() {

    }

    update(deltaTime: number) {

    }

    onLoad() {
        this.initEvent();
        this.initUI()
    }

    private initUI() {
        this.initlist()
    }
    /** 初始化列表 */
    private initlist() {
        this.studyTypelist.removeAllChildren();
        let title = ["", "", "学", "译", "抄", "拼", "读", "写"];
        for (let i = 0; i < 8; i++) {
            let node = instantiate(this.listItem);
            this.touchNodeArr[i] = node;
            CCUtil.onTouch(node, this.levelClick.bind(this, i), this);
            this.studyTypelist.addChild(node);
            let com = node.getComponent(Equip_frame) as Equip_frame;
            if (i <= 1) {
                com.isshow(false)
            }
            com.ispass()
            com.isshowgift()
            com.settitle(title[i]);
            com.setstar(false)
        }
    }
    //点击跳转到闯关界面 TODO
    private levelClick(i: number) {
        EventManager.emit(EventType.study_page_switching, [7, null, 6])
    }
    private touchNodeArr: Node[] = [];

    initEvent() {
        CCUtil.onTouch(this.btn_close, this.onBtnCloseClick, this);
        this._eveId = EventManager.on(EventType.Expand_the_level_page, this.openView.bind(this));

    }
    /** 打开界面 */
    private openView(param: any[]) {
        console.log('接收到的参数=', param);
        this.node.active = true
        tween(this.node).to(0.3, { position: v3(178, 100, 0) }).call(() => {
        }).start()

    }

    onBtnCloseClick() {
        tween(this.node).to(0.3, { position: v3(900, 100, 0) }).call(() => {
            this.node.active = false
        }).start()


    }

    removeEvent() {
        CCUtil.offTouch(this.btn_close, this.onBtnCloseClick, this);
        EventManager.off(EventType.Expand_the_level_page, this._eveId);
        for (let i in this.touchNodeArr) {
            CCUtil.offTouch(this.touchNodeArr[i], this.levelClick.bind(this, i), this);
        }

    }

    onDestroy() {

    }
}


