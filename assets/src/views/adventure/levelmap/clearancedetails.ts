import { _decorator, Button, Component, Node, tween, v3 } from 'cc';
import CCUtil from '../../../util/CCUtil';
import { Characters } from '../../../config/CharactersConfig';
import { ClearancedetailsItem } from './ClearancedetailsItem';
const { ccclass, property } = _decorator;

@ccclass('clearancedetails')
export class Clearancedetails extends Component {
    @property({ type: Button, tooltip: "关闭" })
    public btn_close: Button = null;
    @property({ type: Node, tooltip: "列表" })
    public listNode: Node = null;
    @property({ type: [Node], tooltip: "列表内容" })
    public listItem: Node[] = [];
    start() {

    }
    protected onLoad(): void {
        this.initlist()
        this.initUI()
        this.initEvent()
    }

    //初始化列表
    private initlist() {
        let nameArr = [Characters.total, Characters.complex, Characters.read, Characters.write];
        for (let i in this.listItem) {
            let com: ClearancedetailsItem = this.listItem[i].getComponent(ClearancedetailsItem)
            com.setui(nameArr[i])
        }

    }
    private initEvent() {
        CCUtil.onTouch(this.btn_close, this.onbtn_closeClick, this)

    }
    /**初始化UI */
    private initUI() {
        this.node.active = false
        this.node.position = v3(900, 0, 0)
    }

    private removeEvent() {
        CCUtil.offTouch(this.btn_close, this.onbtn_closeClick, this)

    }
    private onbtn_closeClick() {
        tween(this.node).to(0.3, { position: v3(900, 0, 0) }).call(() => {
            this.node.active = false
        }).start()
    }
    update(deltaTime: number) {

    }
    protected onDestroy(): void {
        this.removeEvent()
    }
}


