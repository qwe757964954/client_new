import { Node } from "cc";

//界面管理类
export class ViewsManager {
    //场景层
    public sceneLayer:Node = null;
    //弹窗层
    public popupLayer:Node = null;
    //提示层
    public tipLayer:Node = null;
    //加载层
    public loadingLayer:Node = null;

    //单例
    private static _instance:ViewsManager = null;
    public static get instance():ViewsManager{
        if(!this._instance){
            this._instance = new ViewsManager();
        }
        return this._instance;
    }
    //初始化层级
    public initLayer(sceneLayer:Node, popupLayer:Node, tipLayer:Node, loadingLayer:Node){
        this.sceneLayer = sceneLayer;
        this.popupLayer = popupLayer;
        this.tipLayer = tipLayer;
        this.loadingLayer = loadingLayer;
    }

    //显示界面
    public showView(viewName:string){
        
    }
    //关闭界面
    public closeView(viewName:string){
        
    }
}