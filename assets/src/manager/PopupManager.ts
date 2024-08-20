import { BlockInputEvents, Node, Prefab, _decorator, instantiate } from 'cc';
import { PrefabConfig } from '../config/PrefabType';
import { BasePopRight } from '../script/BasePopRight';
import { BasePopup } from '../script/BasePopup';
import CCUtil from '../util/CCUtil';
import ImgUtil from '../util/ImgUtil';
import { ResLoader } from './ResLoader';
import { ViewsMgr } from './ViewsManager';

const { ccclass } = _decorator;

@ccclass('PopupManager')
export class PopupManager {
    //单例
    private static _instance: PopupManager = null;
    public static get instance(): PopupManager {
        if (!this._instance) {
            this._instance = new PopupManager();
        }
        return this._instance;
    }
    private async createBasePopup(viewConfig: PrefabConfig): Promise<Node> {
        // Retrieve or create the parent node based on z-index
        let parent = ViewsMgr.getParentNode(viewConfig.zindex);
        let nd_name = viewConfig.path.replace("/", "_");
        let nd: Node = ImgUtil.create_2DNode(nd_name);
        parent.addChild(nd);
        nd.addComponent(BlockInputEvents);
        CCUtil.addWidget(nd, { left: 0, right: 0, top: 0, bottom: 0 });
        return nd;
    }

    private async createPopup(viewConfig: PrefabConfig): Promise<Node> {
        const nd = await this.createBasePopup(viewConfig);
        // Ensure that the node is properly initialized
        await ImgUtil.create_PureNode(nd);
        return nd;
    }

    /**
     * 
     * @param viewConfig 需要有componentName 且继承 BasePopup  参考 SettingPlanView
     * @returns 
     * let node = await PopMgr.showPopup(PrefabType.SettingPlanView);
     */
    async showPopup(viewConfig: PrefabConfig): Promise<Node> {
        
        const nd = await this.createPopup(viewConfig);

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
                if (scpt) {
                    try {
                        scpt.show(); // Call the base class method for showing
                        resolve(node); // Resolve after the animation completes
                    } catch (animationError) {
                        console.error(animationError);
                        reject(animationError);
                    }
                } else {
                    console.error(`Component ${viewConfig.componentName} not found`);
                    reject(new Error(`Component ${viewConfig.componentName} not found`));
                }
            });
        });
    }
    /**
     * 
     * @param viewConfig 需要有componentName 且继承 BasePopRight  参考 SettingPlanView
     * @param aniName 
     * @returns 
     * 示例代码 await PopMgr.showPopRight(PrefabType.FriendsDialogView,"content");
     */
    async showPopRight(viewConfig: PrefabConfig, aniName: string): Promise<Node> {
        const nd = await this.createBasePopup(viewConfig);

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
                let scpt: BasePopRight = node.getComponent(viewConfig.componentName);

                if (scpt) {
                    try {
                        scpt.show(aniName); // Call the specific method for showing
                        resolve(node); // Resolve after the animation completes
                    } catch (animationError) {
                        console.error(animationError);
                        reject(animationError);
                    }
                } else {
                    console.error(`Component ${viewConfig.componentName} not found`);
                    reject(new Error(`Component ${viewConfig.componentName} not found`));
                }
            });
        });
    }
    /**
     * 
     * @param viewConfig 
     * 示例代码： ViewsManager.instance.closePopup(PrefabType.SettingPlanView);
     */
    closePopup(viewConfig: PrefabConfig) {
        // 关闭界面
        let parent = ViewsMgr.getParentNode(viewConfig.zindex);
        parent?.getChildByName(viewConfig.path.replace("/", "_"))?.destroy();
    }
}

export const PopMgr = PopupManager.instance;