import { Node, Prefab, Widget, instantiate, isValid } from "cc";
import { Hierarchy, PrefabConfig, PrefabType } from "../config/PrefabType";
import { NavTitleView } from "../views/common/NavTitleView";
import { PopView } from "../views/common/PopView";
import { TipView } from "../views/common/TipView";
import { TopAmoutView } from "../views/common/TopAmoutView";
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
        LoadManager.loadPrefab(viewConfig.path).then((prefab: Prefab) => {
            console.log("显示界面", viewConfig.path);
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
    static showAlert(content: string, callBack?: Function) {
        ViewsManager.instance.showView(PrefabType.PopView, (node: Node) => {
            node.getComponent(PopView).init(content, callBack);
        });
    }
    // 显示提示
    static showTip(content: string, callBack?: Function) {
        ViewsManager.instance.showView(PrefabType.TipView, (node: Node) => {
            node.getComponent(TipView).init(content, callBack);
        });
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