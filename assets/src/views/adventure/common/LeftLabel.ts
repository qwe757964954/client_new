import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;


/**侧边通用小组件 何存发 2024年4月11日11:01:53 */
@ccclass('LeftLabel')
export class LeftLabel extends Component {

    @property({ type: [Node], tooltip: "组件列表" })
    public nodeList: Node[] = [];
    @property({ type: [SpriteFrame], tooltip: "是否选中" })
    public isSelect: SpriteFrame[] = [];
    start() {

    }

    update(deltaTime: number) {

    }
    /**设置选中的图片 */
    setSelect(i: number) {
        for (let j in this.nodeList) {
            if (i == ~~j) {
                this.nodeList[j].getComponent(Sprite).spriteFrame = this.isSelect[0];
            } else {
                this.nodeList[j].getComponent(Sprite).spriteFrame = this.isSelect[1];
            }
        }
    }


    onDestroy() {

    }
}


