import { _decorator, Component, Node, Sprite } from 'cc';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('BuildingProduceView')
export class BuildingProduceView extends Component {
    @property(Sprite)
    public btnClose: Sprite = null;//关闭按钮

    private _closeCallBack: Function = null;

    start() {
        this.init();
    }
    // 销毁
    onDestroy() {
        this.removeEvent();
    }
    // 初始化
    init() {
        this.initEvent();
    }
    // 初始化事件
    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onClickClose, this);
    }
    // 移除事件
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onClickClose, this);
    }
    // 处理销毁
    dispose() {
        this.node.destroy();
    }
    // 关闭按钮
    onClickClose() {
        if(this._closeCallBack) this._closeCallBack();
        this.dispose();
    }
    // 初始化数据
    initData(callBack:Function) {
        this._closeCallBack = callBack;
    }
}


