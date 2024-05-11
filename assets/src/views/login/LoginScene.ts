import { _decorator, Component, Node } from 'cc';
import { SoundMgr } from '../../manager/SoundMgr';
import { ViewsManager } from '../../manager/ViewsManager';
const { ccclass, property } = _decorator;

@ccclass('LoginScene')
export class LoginScene extends Component {
    @property(Node)
    public sceneLayer: Node = null;//场景层
    @property(Node)
    public popupLayer: Node = null;//弹窗层
    @property(Node)
    public tipLayer: Node = null;//提示层
    @property(Node)
    public loadingLayer: Node = null;//加载层
    onLoad() {
        SoundMgr.loginBgm();
        ViewsManager.instance.initLayer(this.sceneLayer, this.popupLayer, this.tipLayer, this.loadingLayer);
    }
}


