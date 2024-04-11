import { _decorator, Button, Color, Component, Label, Node, Sprite, Vec3 } from 'cc';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('CenterView')
export class CenterView extends Component {

    start() {
        this.init();
    }

    //销毁
    protected onDestroy(): void {
        // this.destoryEvent();
    }
    //初始化
    public init():void {
        // this.initEvent();
    }
    //初始化事件
    public initEvent(){
        // CCUtil.onTouch(this.centerTab, this.onClickCenter, this);
    }
    //销毁事件
    public destoryEvent(){
        // CCUtil.offTouch(this.btnHead, this.onClickHead, this);
    }

    // 切换头像
    btnChangeHeadFunc() {
        console.log("btnChangeHeadFunc");
    }
    // 修改名称
    btnChangeNameFunc() {
        console.log("btnChangeNameFunc");
    }
    // 称号信息
    btnLookTitleInfoFunc() {
        console.log("btnLookTitleInfoFunc");
    }
    // 我的表格
    btnMyTableFunc() {
        console.log("btnMyTableFunc");
    }
}


