import { _decorator, Component, Label, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('NavTitleView')
export class NavTitleView extends Component {
    @property({ type: Label, tooltip: "titl名称" })
    public title_name: Label = null;
    @property({ type: Node, tooltip: "返回按钮" })
    public btn_returnbtn: Node = null;

    private _returnCallback: Function | null = null;
    start() {
        this.initEvent();
    }
    initEvent() {
        CCUtil.onTouch(this.btn_returnbtn, this.onClickReture, this);
    }
    /**移除监听 */
    removeEvent() {
        CCUtil.offTouch(this.btn_returnbtn, this.onClickReture, this);
    }
    updateNavigationProps(title_name: string,returnCb:Function) {
        this.setTitleName(title_name);
        this._returnCallback = returnCb;
    }
    setTitleName(title_name: string) {
        this.title_name.string = title_name;
    }
    /**点击返回 */
    onClickReture(){
        console.log("导航点击返回");
        if(this._returnCallback){
            this._returnCallback();
        }
    }
    onDestroy(): void{
        this.removeEvent();
    }
}


