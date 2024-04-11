import { _decorator, Button, Component, Node, tween, v3 } from 'cc';
import { clearancedetailsItem } from './clearancedetailsItem';
import { characters } from '../../../config/charactersConfig';
import CCUtil from '../../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('clearancedetails')
export class clearancedetails extends Component {
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
     this.initEvent()   
    }

    //初始化列表
    private initlist() {
        let nameArr = [characters.total, characters.complex, characters.read, characters.write];
        for (let i in this.listItem) {
            let com: clearancedetailsItem = this.listItem[i].getComponent(clearancedetailsItem)
            com.setui(nameArr[i])
        }

    }
    private initEvent() {
        CCUtil.onTouch(this.btn_close, this.onbtn_closeClick, this)

    }

    private removeEvent() {
        CCUtil.offTouch(this.btn_close, this.onbtn_closeClick, this)

    }
    private onbtn_closeClick() {
        console.log('缓动结束回调!')
        tween(this.node).to(0.3, { position: v3(900, 0, 0) }).call(() => {
        }).start()
    }
    update(deltaTime: number) {

    }
    protected onDestroy(): void {
        this.removeEvent()
    }
}


