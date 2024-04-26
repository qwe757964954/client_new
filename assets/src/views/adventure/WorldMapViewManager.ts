import { _decorator, Component, instantiate, Node, Prefab, view } from 'cc';
import { EventType } from '../../config/EventType';
import EventManager from '../../util/EventManager';
import { WorldMapView } from './WorldMapView';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
import { StudyModeView } from './sixModes/StudyModeView';

const { ccclass, property } = _decorator;

@ccclass('WorldMapViewManager')
export class WorldMapViewManager extends Component {

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

    start() {

    }

    update(deltaTime: number) {

    }
    protected onLoad(): void {
        this.initUI();
        this.initEvent();
    }
    /**初始化UI */
    private initUI() {
        ViewsManager.instance.initLayer(this.sceneLayer, this.popupLayer, this.tipLayer, this.loadingLayer);

    }

    /**初始化监听事件 */
    private initEvent() {

    }
    /**移除监听 */
    private removeEvent() {

    }

    /**销毁 */
    onDestroy() {
        this.removeEvent();
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


