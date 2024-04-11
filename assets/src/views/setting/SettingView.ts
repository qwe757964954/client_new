import { _decorator, Button, Color, Component, Label, Node, Sprite, Vec3 } from 'cc';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('SettingView')
export class SettingView extends Component {
    @property(Node)
    public center:Node = null;          // 个人中心
    @property(Node)
    public sound:Node = null;           // 声音设置
    @property(Node)
    public account:Node = null;         // 账户设置

    @property(Button)
    public centerTab:Button = null;     // 个人中心TAB
    @property(Button)
    public soundTab:Button = null;      // 声音设置TAB
    @property(Button)
    public accountTab:Button = null;    // 账户设置TAB
    @property(Button)
    public aboutUsTab:Button = null;    // 关于我们TAB


    // private _mainScene:MainScene = null;//主场景

    start() {
        this.init();
    }

    update(deltaTime: number) {
        
    }
    //销毁
    protected onDestroy(): void {
        this.destoryEvent();
    }
    //初始化
    public init():void {
        // this.initEvent();
        this.btnChangeTabFunc(null, "Center");
    }
    // //设置主场景
    // public set mainScene(mainScene:MainScene){
    //     this._mainScene = mainScene;
    // }
    //初始化事件
    public initEvent(){
        // CCUtil.onTouch(this.centerTab, this.onClickCenter, this);
        // CCUtil.onTouch(this.btnMenu, this.onClickMenu, this);
    }
    //销毁事件
    public destoryEvent(){
        // CCUtil.offTouch(this.btnHead, this.onClickHead, this);
        // CCUtil.offTouch(this.btnMenu, this.onClickMenu, this);
    }

    // 切换tab
    btnChangeTabFunc(data: Event, customEventData: string) {
        console.log("btnChangeTabFunc customEventData = ", customEventData);
        this.changeTabStaus(this.center, this.centerTab.node, false);
        this.changeTabStaus(this.sound, this.soundTab.node, false);
        this.changeTabStaus(this.account, this.accountTab.node, false);
        switch (customEventData) {
            case "Center":
                this.changeTabStaus(this.center, this.centerTab.node, true);
                break;
            case "Sound":
                this.changeTabStaus(this.sound, this.soundTab.node, true);
                break;
            case "Account":
                this.changeTabStaus(this.account, this.accountTab.node, true);
                break;
            default:
                this.changeTabStaus(this.center, this.centerTab.node, true);
                break;
        }
    }
    // 关于我们
    btnAboutUsFunc() {
        console.log("btnAboutUsFunc");
        
    }

    changeTabStaus(view: Node, tab: Node, visible: boolean) {
        view.active = visible;
        // 文字和底部图
        let lb = tab.getChildByName("Label");
        let sp = tab.getChildByName("Sprite");
        lb && (lb.getComponent(Label).color = visible ? new Color(255, 255, 255, 255) : new Color(83, 191, 34, 255));
        sp && (sp.active = visible);
    }

    // 返回主界面
    btnCloseFunc(){
        console.log("btnCloseFunc");
        
    }
}


