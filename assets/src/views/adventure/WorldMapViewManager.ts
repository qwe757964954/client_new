import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { EventType } from '../../config/EventType';
import EventManager from '../../util/EventManager';

const { ccclass, property } = _decorator;

@ccclass('WorldMapViewManager')
export class WorldMapViewManager extends Component {

    @property({ type: [Prefab], tooltip: "页面" })
    public levelArr: Prefab[] = [];
    private _eveId: string;
    start() {

    }

    update(deltaTime: number) {

    }
    protected onLoad(): void {
        this.initUI()
        this.initEvent()
        this.showView(0);

    }
    /**初始化UI */
    private initUI() {
        // for (let i = 0; i < this.levelArr.length; i++) {
        //     if (this.levelArr[i]) {
        //         this.levelArr[i].active = false;
        //     }
        // }
    }
    /**切换页面 */
    private switchView(data = []) {
        if (!this.levelArr[data[0]]) {
            console.error("没有这个页面", data);
            return
        }
        this.showView(data[0]);
    }
    /**初始化监听事件 */
    private initEvent() {
        this._eveId = EventManager.on(EventType.study_page_switching, this.switchView.bind(this));

    }
    /**移除监听 */
    private removeEvent() {
        EventManager.off(EventType.study_page_switching, this._eveId);

    }

    /**销毁 */
    onDestroy() {
        this.removeEvent();
    }



    /**
     * 显示视图
     */
    showView(id: number) {
        console.log("显示视图", this.currentNode);
        if (this.currentNode) this.currentNode.parent.removeChild(this.currentNode);
        let copynode = instantiate(this.levelArr[id])
        this.currentNode = copynode
        this.node.addChild(copynode)
    }
    private currentNode: Node = null;
    /**隐藏视图 */
    hideView() {

    }
    /**关闭视图 */
    closeView() {

    }

    /**单例 */
    private static _instance: WorldMapViewManager = null;
    /**获取单例 */
    public static get instance(): WorldMapViewManager {
        if (this._instance == null) {
            this._instance = new WorldMapViewManager();
        }
        return this._instance;
    }
}


