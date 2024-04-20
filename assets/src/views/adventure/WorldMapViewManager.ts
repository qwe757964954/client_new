import { _decorator, Component, instantiate, Node, Prefab, view } from 'cc';
import { EventType } from '../../config/EventType';
import EventManager from '../../util/EventManager';
import { WorldMapView } from './WorldMapView';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';

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

    //自定义事件
    private _eveId: string; //切换岛屿
    private _exitIslandEveId: string; //退出岛屿
    private _enterLevelEveId: string; //进入关卡
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
    /**切换岛屿 */
    private switchIsland(data = []) {
        if (!this.levelArr[data[0]]) {
            console.error("没有这个页面", data);
            return
        }
        this.showIsland(data[0]);
    }

    //进入关卡
    private enterLevel(data: any) {
        console.log('进入关卡', data);
        ViewsManager.instance.showView(PrefabType.StudyModeView, (node: Node) => {
            console.log(node.name);
        });
    }
    /**初始化监听事件 */
    private initEvent() {
        this._eveId = EventManager.on(EventType.Study_Page_Switching, this.switchIsland.bind(this));
        this._exitIslandEveId = EventManager.on(EventType.Exit_World_Island, this.hideIsland.bind(this));
        this._enterLevelEveId = EventManager.on(EventType.Enter_Island_Level, this.enterLevel.bind(this));

    }
    /**移除监听 */
    private removeEvent() {
        EventManager.off(EventType.Study_Page_Switching, this._eveId);
        EventManager.off(EventType.Study_Page_Switching, this._exitIslandEveId);
    }

    /**销毁 */
    onDestroy() {
        this.removeEvent();
    }



    /**
     * 显示视图
     */
    showIsland(id: number) {
        if (this.currentNode) {
            this.currentNode.removeFromParent();
        }
        let copynode = instantiate(this.levelArr[id])
        this.currentNode = copynode
        this.defaultNode.addChild(copynode)
    }
    private currentNode: Node = null;
    /**隐藏视图 */
    hideIsland() {
        if (this.currentNode) {
            this.currentNode.removeFromParent();
        }
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


