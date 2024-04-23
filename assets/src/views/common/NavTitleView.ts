import { _decorator, Button, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NavTitleView')
export class NavTitleView extends Component {
    @property({ type: Label, tooltip: "titl名称" })
    public title_name: Label = null;
    @property({ type: Button, tooltip: "返回按钮" })
    public btn_returnbtn: Button = null;

    private _returnCallback: Function | null = null;
    start() {

    }
    updateNavigationProps(title_name: string,returnCb:Function) {
        this.title_name.string = title_name;
        this._returnCallback = returnCb;
    }
    /**点击返回 */
    onClickReture(){
        console.log("导航点击返回");
        if(this._returnCallback){
            this._returnCallback();
        }
    }
}


