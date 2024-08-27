import { Camera, Color, Layers, Node, Prefab, UITransform, Vec3, Widget, instantiate, isValid } from "cc";
import { Hierarchy, PrefabConfig, PrefabType } from "../config/PrefabType";
import { RoleBaseModel } from "../models/RoleBaseModel";
import CCUtil from "../util/CCUtil";
import ImgUtil from "../util/ImgUtil";
import { NodeUtil } from "../util/NodeUtil";
import { ConfirmView } from "../views/common/ConfirmView";
import { NavTitleView } from "../views/common/NavTitleView";
import { PopView } from "../views/common/PopView";
import { RewardView } from "../views/common/RewardView";
import { TipSmallView } from "../views/common/TipSmallView";
import { TipView } from "../views/common/TipView";
import { TopAmoutView } from "../views/common/TopAmoutView";
import { ItemData } from "./DataMgr";
import { LoadManager } from "./LoadManager";
import { PopMgr } from "./PopupManager";
import { ResLoader } from "./ResLoader";

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

    genPureColorSpriteFrame(color: Color = Color.BLACK) {

    }

    // 显示学习视图
    public showLearnView(viewConfig: PrefabConfig): Promise<Node> {
        const parent = this.getParentNode(viewConfig.zindex);
        const nodeName = this.getNodeName(viewConfig.path);
        const node = ImgUtil.create_2DNode(nodeName);
        parent.addChild(node);

        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${viewConfig.path}`, Prefab, (err, prefab) => {
                if (err) {
                    console.error("Failed to load prefab:", err);
                    return reject(err);
                }

                const prefabNode = instantiate(prefab);
                node.addChild(prefabNode);
                CCUtil.addWidget(node, { left: 0, right: 0, top: 0, bottom: 0 });

                resolve(prefabNode);
            });
        });
    }

    // 显示视图
    public showView(viewConfig: PrefabConfig, callBack?: Function) {
        if (this.isExistView(viewConfig)) {
            console.log("View already exists", viewConfig.path);
            return;
        }

        const parent = this.getParentNode(viewConfig.zindex);
        this.incrementLoadingState(viewConfig.path);

        const tmpNode = this.createTemporaryNode(viewConfig.path);
        parent.addChild(tmpNode);

        console.time(viewConfig.path);
        LoadManager.loadPrefab(viewConfig.path, parent, viewConfig.isCache)
            .then((node: Node) => {
                console.log("View loaded", viewConfig.path);
                console.timeEnd(viewConfig.path);

                node.name = this.getNodeName(viewConfig.path);
                this.decrementLoadingState(viewConfig.path);

                if (callBack) callBack(node);

                // Remove temporary node
                tmpNode.destroy();
            })
            .catch((error) => {
                console.error("Error loading view", viewConfig.path, error);
                this.decrementLoadingState(viewConfig.path);
                tmpNode.destroy();
            });
    }

    // 异步显示视图
    public async showViewAsync(viewConfig: PrefabConfig): Promise<Node> {
        if (this.isExistView(viewConfig)) {
            console.log("View already exists", viewConfig.path);
            return Promise.reject(new Error(`View already exists: ${viewConfig.path}`));
        }

        console.log("Loading view", viewConfig.path);
        const parent = this.getParentNode(viewConfig.zindex);
        this.incrementLoadingState(viewConfig.path);

        const tmpNode = this.createTemporaryNode(viewConfig.path);
        parent.addChild(tmpNode);

        try {
            const node = await LoadManager.loadPrefab(viewConfig.path, parent);
            console.log("View loaded", viewConfig.path);
            node.name = this.getNodeName(viewConfig.path);

            // Remove temporary node if it still exists
            tmpNode.destroy();

            return node;
        } catch (error) {
            console.error("Failed to load view", viewConfig.path, error);
            tmpNode.destroy();
            throw error;
        } finally {
            this.decrementLoadingState(viewConfig.path);
        }
    }

    // 辅助方法: 获取节点名称
    private getNodeName(path: string): string {
        return path.replaceAll("/", "_");
    }

    // 辅助方法: 创建临时节点
    private createTemporaryNode(path: string): Node {
        const tmpNode = new Node();
        tmpNode.name = `tmp_${this.getNodeName(path)}`;
        return tmpNode;
    }

    // 辅助方法: 增加加载状态
    private incrementLoadingState(path: string) {
        this._loadingPrefabMap[path] = (this._loadingPrefabMap[path] || 0) + 1;
    }

    // 辅助方法: 减少加载状态
    private decrementLoadingState(path: string) {
        if (this._loadingPrefabMap[path] > 0) {
            this._loadingPrefabMap[path]--;
            if (this._loadingPrefabMap[path] === 0) {
                delete this._loadingPrefabMap[path];
            }
        }
    }
    // 关闭界面
    public closeView(viewConfig: PrefabConfig) {
        console.log("closeView", viewConfig.path);
        let parent = this.getParentNode(viewConfig.zindex);
        let name = this.getNodeName(viewConfig.path);
        parent?.getChildByName("tmp_" + name)?.destroy();
        parent?.getChildByName(name)?.destroy();
    }
    // 是否存在界面
    public isExistView(viewConfig: PrefabConfig): boolean {
        let parent = this.getParentNode(viewConfig.zindex);
        if (this._loadingPrefabMap.hasOwnProperty(viewConfig.path) && this._loadingPrefabMap[viewConfig.path] > 0) {
            return true;
        }
        if (parent.getChildByName(this.getNodeName(viewConfig.path))) {
            return true;
        }
        return false;
    }
    // 显示提示弹框
    public showAlert(content: string, callBack?: Function) {
        this.showView(PrefabType.PopView, (node: Node) => {
            node.getComponent(PopView).init(content, callBack);
        });
    }
    static showAlert(content: string, callBack?: Function) {
        ViewsMgr.showAlert(content, callBack);
    }
    // 显示提示
    public showTip(content: string, callBack?: () => void) {
        this.showView(PrefabType.TipView, (node: Node) => {
            node.getComponent(TipView).init(content, false,callBack);
        });
    }

    // 显示带颜色提示  富文本提示
    public showColorTip(content: string, callBack?: () => void) {
        this.showView(PrefabType.TipView, (node: Node) => {
            node.getComponent(TipView).init(content, true,callBack);
        });
    }

    /** 显示局部提示
     * @param content 提示内容
     * @param refNode 与提示相关联的节点
     * @param dtPos 位置的偏移
     * @param callBack 回调
     */
    public showTipSmall(content: string, refNode?: Node, dtPos?: Vec3, callBack?: Function) {
        this.showView(PrefabType.TipSmallView, (node: Node) => {
            let pos = null;
            if (refNode) {
                pos = new Vec3(0, 0, 0);
                let layer = node.layer;
                let refLayer = refNode.layer;
                if (layer !== refLayer) {//不同摄像机下显示
                    let cameras = refNode.scene.getComponentsInChildren(Camera);
                    for (let i = 0; i < cameras.length; i++) {
                        let camera = cameras[i];
                        if (camera.visibility & refLayer) {
                            camera.convertToUINode(refNode.worldPosition, node.parent, pos);
                            break;
                        }
                    }
                } else {
                    node.parent.getComponent(UITransform).convertToNodeSpaceAR(refNode.worldPosition, pos);
                }
                if (dtPos) {
                    pos.add(dtPos);
                }
            }
            node.getComponent(TipSmallView).init(content, pos, callBack);
        });
    }
    static showTip(content: string, callBack?: () => void) {
        ViewsMgr.showTip(content, callBack);
    }

    // 显示确定弹窗
    public async showConfirm(content: string, sureCall?: Function, cancelCall?: Function, sureStr?: string, cancelStr?: string, canClose: boolean = true) {
        let node: Node = await PopMgr.showPopup(PrefabType.ConfirmView);
        let nodeScript: ConfirmView = node.getComponent(ConfirmView);
        nodeScript.getComponent(ConfirmView).init(content, sureCall, cancelCall, sureStr, cancelStr, canClose);
        return nodeScript;
    }
    static showConfirm(content: string, sureCall?: Function, cancelCall?: Function, sureStr?: string, cancelStr?: string, canClose: boolean = true) {
        ViewsMgr.showConfirm(content, sureCall, cancelCall, sureStr, cancelStr, canClose);
    }
    /**
     * 显示奖励弹窗
     * ViewMgr.showRewards([{id: ItemID.coin., num: 2}]);
     */
    public showRewards(data: ItemData[], callBack?: Function) {
        this.showView(PrefabType.RewardView, (node: Node) => {
            node.getComponent(RewardView).init(data, callBack);
        });
    }
    /**
     * 显示加载界面
     * ViewMgr.showWaiting()
     */
    public showWaiting() {
        this.showView(PrefabType.WaitingView);
    }
    /**
     * 移除加载界面
     * ViewMgr.removeWaiting()
     */
    public removeWaiting() {
        this.closeView(PrefabType.WaitingView);
    }
    /**关闭提示弹框 */
    public closeAlertView() {
        this.closeView(PrefabType.PopView);
    }
    /**关闭提示 */
    public closeTipView() {
        this.closeView(PrefabType.TipView);
    }
    /**关闭确定弹窗 */
    public closeConfirmView() {
        this.closeView(PrefabType.ConfirmView);
    }

    /**
     * 导航栏公共模块
     * @param parent 父节点
     * @param left widget 左
     * @param top widget 上
     * @returns 
     * 
     * 示例代码
     * 
     * ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("会员中心",()=>{
                ViewsMgr.closeView(PrefabType.MemberCentreView);
            });
        });
     */
    static addNavigation(parent: Node, left: number, top: number): Promise<NavTitleView> {

        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.NavTitleView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    reject(err);
                    return;
                }

                let node = instantiate(prefab);
                parent.addChild(node);

                let widgetCom = node.getComponent(Widget);
                if (!isValid(widgetCom)) {
                    widgetCom = node.addComponent(Widget);
                    widgetCom.isAlignTop = true;
                    widgetCom.isAlignLeft = true;
                }
                widgetCom.top = left;
                widgetCom.left = top;
                widgetCom.updateAlignment();

                let navTitleView = node.getComponent(NavTitleView);
                if (navTitleView) {
                    resolve(navTitleView);
                } else {
                    reject(new Error('NavTitleView component not found'));
                }
            });
        });
    }
    // 添加数值公共模块
    /**
     * 
     * @param parent 父节点
     * @param verticalCenter  widget垂直居中 
     * @param right widget右
     * @returns 
     * 
     * 示例代码
     * 
     * ViewsManager.addAmount(this.top_layout,15.78,22.437).then((amoutScript: TopAmoutView) => {
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:0},
                {type:AmoutType.Coin,num:0},
                {type:AmoutType.Energy,num:0}];
            amoutScript.loadAmoutData(dataArr);
        });
     */
    static addAmount(parent: Node, verticalCenter: number, right: number): Promise<TopAmoutView> {
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.TopAmoutView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                parent.addChild(node);
                let widgetCom = node.getComponent(Widget);
                if (!isValid(widgetCom)) {
                    widgetCom = node.addComponent(Widget);
                    widgetCom.isAlignRight = true;
                    widgetCom.isAlignVerticalCenter = true;
                }
                widgetCom.right = right;
                widgetCom.verticalCenter = verticalCenter;
                widgetCom.updateAlignment();
                prefab.addRef();
                node.once(Node.EventType.NODE_DESTROYED, () => {
                    LoadManager.releaseAsset(prefab);
                });
                resolve(null);
                /*
                let amoutScript = node.getComponent(TopAmoutView);
                if (amoutScript) {
                    resolve(amoutScript);
                } else {
                    reject(new Error('addAmout component not found'));
                }
                    */
            });
        });
    }

    public static async addRoleToNode(parent: Node): Promise<Node> {
        try {
            // 加载 Prefab
            const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.RoleModel.path}`, Prefab);
            const node = instantiate(prefab);
            NodeUtil.setLayerRecursively(node, Layers.Enum.UI_2D);
            parent.addChild(node);
            // 获取并初始化 RoleBaseModel 组件
            const roleModel = node.getComponent(RoleBaseModel);
            if (roleModel) {
                await roleModel.initSelf(); // 假设 initSelf 是一个返回 Promise 的异步函数
                roleModel.show(true);
            } else {
                throw new Error('RoleBaseModel component not found on the node.');
            }
            return node;
        } catch (error) {
            console.error('Failed to add pet to node:', error);
            throw error; // 如果需要，将错误抛出到调用者
        }
    }

    public static async addPetToNode(parent: Node): Promise<Node> {
        try {
            // 加载 Prefab
            const prefab = await ResLoader.instance.loadAsyncPromise<Prefab>("resources", `prefab/${PrefabType.PetModel.path}`, Prefab);
            const node = instantiate(prefab);
            NodeUtil.setLayerRecursively(node, Layers.Enum.UI_2D);
            parent.addChild(node);
            // 获取并初始化 RoleBaseModel 组件
            const roleModel = node.getComponent(RoleBaseModel);
            if (roleModel) {
                await roleModel.initSelf(); // 假设 initSelf 是一个返回 Promise 的异步函数
                roleModel.show(true);
            } else {
                throw new Error('RoleBaseModel component not found on the node.');
            }
            return node;
        } catch (error) {
            console.error('Failed to add pet to node:', error);
            throw error; // 如果需要，将错误抛出到调用者
        }
    }
}

export const ViewsMgr = ViewsManager.instance;