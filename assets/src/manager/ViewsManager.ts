import { BlockInputEvents, Color, Node, Prefab, Widget, instantiate, isValid } from "cc";
import { Hierarchy, PrefabConfig, PrefabType } from "../config/PrefabType";
import { BasePopup } from "../script/BasePopup";
import CCUtil from "../util/CCUtil";
import ImgUtil from "../util/ImgUtil";
import { ConfirmView } from "../views/common/ConfirmView";
import { NavTitleView } from "../views/common/NavTitleView";
import { PopView } from "../views/common/PopView";
import { RewardView } from "../views/common/RewardView";
import { TipView } from "../views/common/TipView";
import { TopAmoutView } from "../views/common/TopAmoutView";
import { ItemData } from "./DataMgr";
import { LoadManager } from "./LoadManager";
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
    /**
     * 
     * @param viewConfig 
     * 示例代码： ViewsManager.instance.closePopup(PrefabType.SettingPlanView);
     */
    closePopup(viewConfig: PrefabConfig) {
        // 关闭界面
        let parent = this.getParentNode(viewConfig.zindex);
        parent?.getChildByName(viewConfig.path.replace("/", "_"))?.destroy();
    }

    /**
     * 
     * @param viewConfig  需要有scpt_name 且继承 BasePopup  参考 SettingPlanView
     * @param data 打开需要添加的参数，tudo
     * @returns 
     * 示例：
     * ViewsManager.instance.showPopup(PrefabType.SettingPlanView).then((node: Node)=>{
            let nodeScript:SettingPlanView = node.getComponent(SettingPlanView);
            let titleBookName = `${this._curUnitStatus.book_name}${this._curUnitStatus.grade}`;
            nodeScript.updateTitleName(titleBookName);
        })
     */
    async showPopup(viewConfig: PrefabConfig, data?: any): Promise<Node> {
        // Retrieve or create the parent node based on z-index
        let parent = this.getParentNode(viewConfig.zindex);
        let nd_name = viewConfig.path.replace("/", "_");
        let nd: Node = ImgUtil.create_2DNode(nd_name);
        parent.addChild(nd);

        // Add blocking input events and set widget settings
        nd.addComponent(BlockInputEvents);
        CCUtil.addWidget(nd, { left: 0, right: 0, top: 0, bottom: 0 });

        // Ensure that the node is properly initialized
        await ImgUtil.create_PureNode(nd);

        return new Promise((resolve, reject) => {
            // Load the prefab and instantiate it
            ResLoader.instance.load(`prefab/${viewConfig.path}`, Prefab, async (err, prefab) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                // Instantiate and add the prefab as a child node
                let node = instantiate(prefab);
                nd.addChild(node);
                CCUtil.addWidget(nd, { left: 0, right: 0, top: 0, bottom: 0 });

                // Retrieve the component and execute the show animation
                let scpt: BasePopup = node.getComponent(viewConfig.componentName);

                try {
                    // await scpt.showAnim();
                    scpt.showAnim();
                    resolve(node as Node); // Resolve after the animation completes
                } catch (animationError) {
                    console.error(animationError);
                    reject(animationError);
                }
            });
        });
    }



    // 显示界面
    public showView(viewConfig: PrefabConfig, callBack?: Function) {
        if (this.isExistView(viewConfig)) {
            console.log("显示界面 已存在", viewConfig.path);
            return;
        }
        console.log("显示界面 load", viewConfig.path);
        let parent = this.getParentNode(viewConfig.zindex);
        if (this._loadingPrefabMap.hasOwnProperty(viewConfig.path)) {
            this._loadingPrefabMap[viewConfig.path]++;
        } else {
            this._loadingPrefabMap[viewConfig.path] = 1;
        }
        let tmpNode = new Node();
        let tmpName = "tmp_" + viewConfig.path.replace("/", "_");
        tmpNode.name = tmpName;
        parent.addChild(tmpNode);

        console.time(viewConfig.path);
        LoadManager.loadPrefab(viewConfig.path, parent, viewConfig.isCache).then((node: Node) => {
            console.log("显示界面", viewConfig.path);
            console.timeEnd(viewConfig.path);
            node.name = viewConfig.path.replace("/", "_");

            if (this._loadingPrefabMap.hasOwnProperty(viewConfig.path)) {
                this._loadingPrefabMap[viewConfig.path]--;
            }
            if (callBack) callBack(node);
            // 异常处理，避免预制体加载过程中被移除了
            let tmpNode = parent.getChildByName(tmpName);
            if (tmpNode) {
                tmpNode.destroy();
            } else {
                console.log("界面已经被移除", viewConfig.path);
                node.destroy();
            }
        }).catch((error) => {
            console.log("显示界面 error", error);
            if (this._loadingPrefabMap.hasOwnProperty(viewConfig.path)) {
                this._loadingPrefabMap[viewConfig.path]--;
            }
        });
    }

    public async showViewAsync(viewConfig: PrefabConfig): Promise<Node> {
        // Check if the view already exists
        if (this.isExistView(viewConfig)) {
            console.log("View already exists", viewConfig.path);
            return Promise.reject(new Error(`View already exists: ${viewConfig.path}`));
        }

        console.log("Loading view", viewConfig.path);
        const parent = this.getParentNode(viewConfig.zindex);

        // Increment loading state
        this._loadingPrefabMap[viewConfig.path] = (this._loadingPrefabMap[viewConfig.path] || 0) + 1;

        // Create a temporary node to hold the loading state
        const tmpNode = new Node();
        tmpNode.name = `tmp_${viewConfig.path.replace("/", "_")}`;
        parent.addChild(tmpNode);

        try {
            // Load the prefab
            const node = await LoadManager.loadPrefab(viewConfig.path, parent);
            console.log("Loaded view", viewConfig.path);
            node.name = viewConfig.path.replace("/", "_");

            // Remove temporary node if it still exists
            if (tmpNode && tmpNode.parent) {
                tmpNode.destroy();
            }

            return node;
        } catch (error) {
            console.error("Failed to load view", viewConfig.path, error);

            // Ensure temporary node is removed
            if (tmpNode && tmpNode.parent) {
                tmpNode.destroy();
            }

            throw error;
        } finally {
            // Decrement loading state
            if (--this._loadingPrefabMap[viewConfig.path] <= 0) {
                delete this._loadingPrefabMap[viewConfig.path];
            }
        }
    }



    // 关闭界面
    public closeView(viewConfig: PrefabConfig) {
        console.log("closeView", viewConfig.path);
        let parent = this.getParentNode(viewConfig.zindex);
        let name = viewConfig.path.replace("/", "_");
        parent?.getChildByName("tmp_" + name)?.destroy();
        parent?.getChildByName(name)?.destroy();
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
    // 显示提示弹框
    public showAlert(content: string, callBack?: Function) {
        this.showView(PrefabType.PopView, (node: Node) => {
            node.getComponent(PopView).init(content, callBack);
        });
    }
    static showAlert(content: string, callBack?: Function) {
        ViewsManager.instance.showAlert(content, callBack);
    }
    // 显示提示
    public showTip(content: string, callBack?: Function) {
        this.showView(PrefabType.TipView, (node: Node) => {
            node.getComponent(TipView).init(content, callBack);
        });
    }
    static showTip(content: string, callBack?: Function) {
        ViewsManager.instance.showTip(content, callBack);
    }
    // 显示确定弹窗
    public async showConfirm(content: string, sureCall?: Function, cancelCall?: Function, sureStr?: string, cancelStr?: string, canClose: boolean = true) {
        let node: Node = await this.showPopup(PrefabType.ConfirmView);
        let nodeScript: ConfirmView = node.getComponent(ConfirmView);
        nodeScript.getComponent(ConfirmView).init(content, sureCall, cancelCall, sureStr, cancelStr, canClose);
    }
    static showConfirm(content: string, sureCall?: Function, cancelCall?: Function, sureStr?: string, cancelStr?: string, canClose: boolean = true) {
        ViewsManager.instance.showConfirm(content, sureCall, cancelCall, sureStr, cancelStr, canClose);
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
                ViewsManager.instance.closeView(PrefabType.MemberCentreView);
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
     * ViewsManager.addAmout(this.top_layout,15.78,22.437).then((amoutScript: TopAmoutView) => {
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:0},
                {type:AmoutType.Coin,num:0},
                {type:AmoutType.Energy,num:0}];
            amoutScript.loadAmoutData(dataArr);
        });
     */
    static addAmout(parent: Node, verticalCenter: number, right: number): Promise<TopAmoutView> {
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

                let amoutScript = node.getComponent(TopAmoutView);
                if (amoutScript) {
                    resolve(amoutScript);
                } else {
                    reject(new Error('addAmout component not found'));
                }
            });
        });
    }
}

export const ViewsMgr = ViewsManager.instance;