import { _decorator, Component, instantiate, Node, Prefab, v3 } from 'cc';
import { map } from './levelmap/map';
const { ccclass, property } = _decorator;

/**魔法森林 何存发 2024年4月9日17:51:36 */
@ccclass('WorldIsland')
export class WorldIsland extends Component {

    @property({ type: Node, tooltip: "列表" })
    public mapList: Node = null;
    @property({ type: Node, tooltip: "地图块" })
    public mapItem: Node = null;
    start() {

    }

    update(deltaTime: number) {

    }
    protected onLoad(): void {
        this.initUI()
    }

    /**初始化UI */
    private initUI() {
        this.initlist()
    }

    /**初始化监听事件 */
    private initEvent() {
    }
    /**移除监听 */
    private removeEvent() { }

    /**初始化列表 */
    private initlist() {
        this.mapList.removeAllChildren()
        let intx = -226
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

    }

}


