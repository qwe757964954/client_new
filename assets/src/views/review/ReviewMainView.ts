import { _decorator, Component, Label, Node, Sprite } from 'cc';
import CCUtil from '../../util/CCUtil';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
const { ccclass, property } = _decorator;

@ccclass('ReviewMainView')
export class ReviewMainView extends Component {

    @property({ type: Node, tooltip: "返回按钮" })
    public btn_back: Node = null;

    @property({ type: Node, tooltip: "帮助按钮" }) //
    public helpBtn: Node = null;

    @property({ type: Node, tooltip: "复习计划按钮" }) //
    public reviewBtn: Node = null;

    @property({ type: Node, tooltip: "错词本按钮" }) //
    public wrongBtn: Node = null;

    @property({ type: Node, tooltip: "搜集单词按钮" }) //
    public collectBtn: Node = null;

    @property({ type: Node, tooltip: "单抽按钮" }) //
    public drawBtn1: Node = null;

    @property({ type: Node, tooltip: "十连抽按钮" }) //  rewardShow
    public drawBtn10: Node = null;

    @property({ type: Node, tooltip: "300奖励领取按钮" }) //
    public reward300: Node = null;

    @property({ type: Node, tooltip: "600奖励领取按钮" }) //
    public reward600: Node = null;

    @property({ type: Node, tooltip: "1000奖励领取按钮" }) //
    public reward1000: Node = null;

    @property({ type: Node, tooltip: "奖励预览按钮" }) //
    public rewardShow: Node = null;


    @property({ type: Label, tooltip: "能量文本" })
    public eneryTxt: Label = null;

    @property({ type: Label, tooltip: "金币文本" })
    public goldTxt: Label = null;

    @property({ type: Label, tooltip: "石头文本" })  //
    public stoneTxt: Label = null;

    @property({ type: Sprite, tooltip: "能量进度条精灵" })  //powerBar
    public powerBar: Sprite = null;

    @property({ type: Node, tooltip: "奖励1结点" })
    public reward1: Node = null;

    @property({ type: Node, tooltip: "奖励2结点" })
    public reward2: Node = null;

    @property({ type: Node, tooltip: "奖励3结点" })
    public reward3: Node = null;

    private errorNum: number = 0;
    private rewardList: Array<Node> = [];

    init() {
        this.rewardList = [this.reward1, this.reward2, this.reward3];
        this.initAni();
    }

    initEvent() {
        CCUtil.onTouch(this.btn_back, this.closeView, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.btn_back, this.closeView, this);
    }

    /**初始化骨骼动画 */
    initAni() {

    }

    /**关闭页面 TODO*/
    private closeView() {
        //director.loadScene(SceneType.MainScene);
        ViewsManager.instance.closeView(PrefabType.ReviewMainView);
    }

    protected onLoad(): void {
        this.init();
        this.initEvent();
    }

    protected onDestroy(): void {

    }

    start() {

    }

    update(deltaTime: number) {

    }
}


