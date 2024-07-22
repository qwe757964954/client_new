import { _decorator, Component, Label, Node } from 'cc';
import { ItemData } from '../../manager/DataMgr';
import CCUtil from '../../util/CCUtil';
import { RewardView } from '../common/RewardView';
const { ccclass, property } = _decorator;

@ccclass('ReviewRewardView')
export class ReviewRewardView extends Component {
    @property(Node)
    public btnSure: Node = null;//确定按钮
    @property(Node)
    public btnDraw: Node = null;//抽奖按钮
    @property(Label)
    public label: Label = null;//次数
    @property(RewardView)
    public rewardView: RewardView = null;//奖励展示

    private _drawCall: Function = null;//抽奖回调
    private _sureCall: Function = null;//确定回调

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.btnSure, this.onClickSure, this);
        CCUtil.onTouch(this.btnDraw, this.onClickDraw, this);
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.btnSure, this.onClickSure, this);
        CCUtil.offTouch(this.btnDraw, this.onClickDraw, this);
    }
    /**初始化 */
    init(data: ItemData[], type: number, drawCall?: Function, sureCall?: Function) {
        this._drawCall = drawCall;
        this._sureCall = sureCall;
        this.rewardView.init(data, () => {
            if (this._sureCall) this._sureCall();
            this.node.destroy();
        });
        if (1 == type) {
            this.label.string = "再抽1次";
        } else {
            this.label.string = "再抽10次";
        }

    }
    /**确定按钮点击 */
    onClickSure() {
        if (this._sureCall) this._sureCall();
        this.node.destroy();
    }
    /**抽奖按钮点击 */
    onClickDraw() {
        if (this._drawCall) this._drawCall();
        this.node.destroy();
    }
}


