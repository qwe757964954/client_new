import { _decorator, Component, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import { TimerMgr } from '../../util/TimerMgr';
const { ccclass, property } = _decorator;
/**建筑建造成功 */
@ccclass('BuildingSuccessView')
export class BuildingSuccessView extends Component {
    @property(Node)
    public bg: Node = null;//背景
    @property(Node)
    public center: Node = null;//中间
    @property(Node)
    public frame: Node = null;//框
    @property(Node)
    public layout: Node = null;//布局
    @property([Node])
    public conditions: Node[] = [];//条件

    private _canClose: boolean = false;//是否可以关闭

    start() {

    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化事件 */
    private initEvent() {
        CCUtil.onTouch(this.bg, this.onClickBg, this);
    }
    /**移除事件 */
    private removeEvent() {
        CCUtil.offTouch(this.bg, this.onClickBg, this);
    }
    /**初始化数据 */
    public initData() {
        TimerMgr.once(() => {
            this._canClose = true;
        }, 2000);
        //条件
        // for (let i = 0; i < this.conditions.length; i++) {
        //     let item = this.conditions[i];
        //     item.getChildByName("Label1");
        //     item.getChildByName("Label3");
        // }
        //奖励列表
        // LoadManager.loadPrefab(PrefabType.RewardItem.path, this.layout).then((node: Node) => {
        //     node.getComponent(RewardItem);
        // });
    }
    /**背景点击 */
    public onClickBg() {
        if (!this._canClose) return;
        this._canClose = false;
        this.node.destroy();
    }
}


