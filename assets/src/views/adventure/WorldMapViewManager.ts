import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { EventType } from '../../config/EventType';
import EventManager from '../../util/EventManager';
import { WorldMapView } from './WorldMapView';
import { ViewsManager } from '../../manager/ViewsManager';

const { ccclass, property } = _decorator;

@ccclass('WorldMapViewManager')
export class WorldMapViewManager extends Component {

    @property({ type: [Prefab], tooltip: "页面" })
    public levelArr: Prefab[] = [];
    @property({ type: Node, tooltip: "默认UI节点" })
    public defaultNode: Node = null;


    @property(Node)
    public sceneLayer: Node = null;//场景层
    @property(Node)
    public popupLayer: Node = null;//弹窗层
    @property(Node)
    public tipLayer: Node = null;//提示层
    @property(Node)
    public loadingLayer: Node = null;//加载层
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
        ViewsManager.instance.initLayer(this.sceneLayer, this.popupLayer, this.tipLayer, this.loadingLayer);

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
        this.defaultNode.addChild(copynode)
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


