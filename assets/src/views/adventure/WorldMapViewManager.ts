import { _decorator, Component, Node } from 'cc';
import { EventType } from '../../config/EventType';
import EventManager from '../../util/EventManager';

const { ccclass, property } = _decorator;

@ccclass('WorldMapViewManager')
export class WorldMapViewManager extends Component {

    @property({ type: [Node], tooltip: "页面" })
    public levelArr: Node[] = [];
    @property({ type: Node, tooltip: "默认页面" })
    public defaultView: Node = null;
    private _eveId: string;
    start() {

    }

    update(deltaTime: number) {

    }
    protected onLoad(): void {
        this.initUI()
        this.initEvent()
        this.switchView([0]);
    }
    /**初始化UI */
    private initUI() {
        for (let i = 0; i < this.levelArr.length; i++) {
            if (this.levelArr[i]) {
                this.levelArr[i].active = false;
            }
        }
    }
    /**切换页面 */
    private switchView(data = []) {
        if (data[1]) {

        } else if (!this.levelArr[data[0]]) {
            console.error("没有这个页面", data);
            return
        }
        if (data[1]) {//返回主页面
            this.showView(this.defaultView);
        } else {//进入其他页面
            this.showView(this.levelArr[data[0]], this.defaultView);
        }
        if (data[2]) {
            this.levelArr[data[2]].active = false;
        }

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
    showView(node: Node, closenode?: Node) {
        node.active = true;
        if (closenode) closenode.active = false;
    }
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


