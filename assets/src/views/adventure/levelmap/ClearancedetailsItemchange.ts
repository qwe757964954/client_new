import { _decorator, Button, Component, Label, Node, ProgressBar } from 'cc';
import CCUtil from '../../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('ClearancedetailsItem')
export class ClearancedetailsItemchange extends Component {

    @property({ type: Label, tooltip: "标题" })
    public title: Label = null;
    @property({ type: Button, tooltip: "前往按钮" })
    public btn_Goto: Button = null;
    @property({ type: ProgressBar, tooltip: "进度条" })
    public Progress: ProgressBar = null;
    @property({ type: Label, tooltip: "进度条的文本" })
    public ProgressLabel: Label = null;
    start() {

    }

    update(deltaTime: number) {

    }
    protected onLoad(): void {
        this.initEvent()
    }
    /**还没写 TODO */
    private onBtnGotoClick() {

    }

    private initEvent() {
        CCUtil.onTouch(this.btn_Goto, this.onBtnGotoClick, this)

    }

    private removeEvent() {
        CCUtil.offTouch(this.btn_Goto, this.onBtnGotoClick, this)

    }
    //设置ui
    setui(str: string) {
        this.title.string = str

    }
    protected onDestroy(): void {
        this.removeEvent()
    }
}


