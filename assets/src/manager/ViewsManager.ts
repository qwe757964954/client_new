import { Node, Prefab, instantiate, isValid } from "cc";
import { Hierarchy, PrefabConfig, PrefabType } from "../config/PrefabType";
import { LoadManager } from "./LoadManager";
import { PopView } from "../views/common/PopView";
import { TipView } from "../views/common/TipView";

//界面管理类
export class ViewsManager {
    //场景层
    public sceneLayer: Node = null;
    //弹窗层
    public popupLayer: Node = null;
    //提示层
    public tipLayer: Node = null;
    //加载层
    public loadingLayer: Node = null;

    private _loadingPrefabMap: { [key: string]: number } = {};

    //单例
    private static _instance: ViewsManager = null;
    public static get instance(): ViewsManager {
        if (!this._instance) {
            this._instance = new ViewsManager();
        }
        return this._instance;
    }
    //初始化层级
    public initLayer(sceneLayer: Node, popupLayer: Node, tipLayer: Node, loadingLayer: Node) {
        this.sceneLayer = sceneLayer;
        this.popupLayer = popupLayer;
        this.tipLayer = tipLayer;
        this.loadingLayer = loadingLayer;

        this._loadingPrefabMap = {};
    }
    // 获取父节点
    public getParentNode(hierarchy: Hierarchy) {
        if (Hierarchy.SCENELAYER == hierarchy) return this.sceneLayer;
        if (Hierarchy.POPUPLAYER == hierarchy) return this.popupLayer;
        if (Hierarchy.TIPLAYER == hierarchy) return this.tipLayer;
        if (Hierarchy.LOADINGLAYER == hierarchy) return this.loadingLayer;
        return this.sceneLayer;
    }

    // 显示界面
    public showView(viewConfig: PrefabConfig, callBack?: Function) {
        if (this.isExistView(viewConfig)) return;
        let parent = this.getParentNode(viewConfig.zindex);
        this._loadingPrefabMap[viewConfig.path]++;
        LoadManager.loadPrefab(viewConfig.path).then((prefab: Prefab) => {
            let node = instantiate(prefab);
            node.name = viewConfig.path.replace("/", "_");

            if (this._loadingPrefabMap.hasOwnProperty(viewConfig.path)) {
                this._loadingPrefabMap[viewConfig.path]--;
            }
            if (!parent || !isValid(parent, true)) return;//如果父类不存或已经被销毁则直接返回
            parent.addChild(node);
            if (callBack) callBack(node);
        });
    }
    // 关闭界面
    public closeView(viewConfig: PrefabConfig) {
        let parent = this.getParentNode(viewConfig.zindex);
        parent?.getChildByName(viewConfig.path.replace("/", "_"))?.destroy();
    }
    // 是否存在界面
    public isExistView(viewConfig: PrefabConfig): boolean {
        let parent = this.getParentNode(viewConfig.zindex);
        if (this._loadingPrefabMap.hasOwnProperty(viewConfig.path) && this._loadingPrefabMap[viewConfig.path] > 0) {
            return true;
        }
        if (parent.getChildByName(viewConfig.path.replace("/", "_"))) {
            return true;
        }
        return false;
    }
    // 显示弹框
    showAlert(content: string, callBack?: Function) {
        this.showView(PrefabType.PopView, (node: Node) => {
            node.getComponent(PopView).init(content, callBack);
        });
    }
    // 显示提示
    showTip(content: string, callBack?: Function) {
        this.showView(PrefabType.TipView, (node: Node) => {
            node.getComponent(TipView).init(content, callBack);
        });
    }
}