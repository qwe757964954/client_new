import { _decorator, Label, Node, ProgressBar, sp } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { PropID } from '../../config/PropConfig';
import { TextConfig } from '../../config/TextConfig';
import GlobalConfig from '../../GlobalConfig';
import { ViewsMgr } from '../../manager/ViewsManager';
import { s2cReviewPlan } from '../../models/NetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import { ToolUtil } from '../../util/ToolUtil';
import { ReviewSourceType, ReviewWordListView } from './ReviewWordListView';
const { ccclass, property } = _decorator;

const spAnimNames = ["jingtai", "danchou", "shilian"];
const eggAnimNames = ["idle1", "crush1", "idle2", "crush2", "idle3", "crush3", "idle4", "crush4", "idle5", "crush5"];

@ccclass('ReviewPlanView')
export class ReviewPlanView extends BaseComponent {
    @property(sp.Skeleton)
    public sp: sp.Skeleton = null;//动画
    @property(sp.Skeleton)
    public egg: sp.Skeleton = null;//蛋
    @property(Node)
    public btnBack: Node = null;//返回按钮
    @property(Node)
    public btnDraw: Node = null;//抽奖按钮
    @property(Node)
    public btnDrawTimes: Node = null;//抽奖10次按钮
    @property(Node)
    public plTop: Node = null;//顶部
    @property(Node)
    public plBottom: Node = null;//底部
    @property(Node)
    public plLeft: Node = null;//左边
    @property(Node)
    public plRight: Node = null;//右边
    @property(Node)
    public plAnim: Node = null;//动画层
    @property({ readonly: true })
    '// 分割线': string = '--------单词大冒险--------';
    @property(Node)
    public btnTodayReview1: Node = null;//今日复习按钮
    @property(Node)
    public btnReview1: Node = null;//复习按钮
    @property(Label)
    public labelStudy1: Label = null;//已学习
    @property(Label)
    public labelReview1: Label = null;//已复习
    @property(Label)
    public labelTip1: Label = null;//复习规划提示
    @property(ProgressBar)
    public progressBar1: ProgressBar = null;//复习进度
    @property({ readonly: true })
    '// 分割线2': string = '--------教材单词--------';
    @property(Node)
    public btnTodayReview2: Node = null;//今日复习按钮
    @property(Node)
    public btnReview2: Node = null;//复习按钮
    @property(Label)
    public labelStudy2: Label = null;//已学习
    @property(Label)
    public labelReview2: Label = null;//已复习
    @property(Label)
    public labelTip2: Label = null;//复习规划提示
    @property(ProgressBar)
    public progressBar2: ProgressBar = null;//复习进度

    private _canDraw: boolean = true;//是否可以抽奖
    private _eggID: number = 0;//蛋ID

    start() {
        this.init();
        this.initEvent();
    }
    protected onEnable(): void {
        ServiceMgr.studyService.reqReviewPlan();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.btnBack, this.onBtnBackClick, this);
        CCUtil.onTouch(this.btnDraw, this.onBtnDrawClick, this);
        CCUtil.onTouch(this.btnDrawTimes, this.onBtnDrawTimesClick, this);
        CCUtil.onTouch(this.btnTodayReview1, this.onBtnTodayReview1Click, this);
        CCUtil.onTouch(this.btnReview1, this.onBtnReview1Click, this);
        CCUtil.onTouch(this.labelTip1, this.onLabelTip1Click, this);
        CCUtil.onTouch(this.btnTodayReview2, this.onBtnTodayReview2Click, this);
        CCUtil.onTouch(this.btnReview2, this.onBtnReview2Click, this);
        CCUtil.onTouch(this.labelTip2, this.onLabelTip2Click, this);

        this.addEvent(InterfacePath.c2sReviewPlan, this.onRepReviewPlan.bind(this));
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.btnBack, this.onBtnBackClick, this);
        CCUtil.offTouch(this.btnDraw, this.onBtnDrawClick, this);
        CCUtil.offTouch(this.btnDrawTimes, this.onBtnDrawTimesClick, this);
        CCUtil.offTouch(this.btnTodayReview1, this.onBtnTodayReview1Click, this);
        CCUtil.offTouch(this.btnReview1, this.onBtnReview1Click, this);
        CCUtil.offTouch(this.labelTip1, this.onLabelTip1Click, this);
        CCUtil.offTouch(this.btnTodayReview2, this.onBtnTodayReview2Click, this);
        CCUtil.offTouch(this.btnReview2, this.onBtnReview2Click, this);
        CCUtil.offTouch(this.labelTip2, this.onLabelTip2Click, this);

        this.clearEvent();
    }
    /**初始化 */
    init() {
        // this.labelTip1.node.active = false;
        // this.labelTip2.node.active = false;
        let scale = ToolUtil.getValue(GlobalConfig.WIN_DESIGN_RATE, 0.78, 1.5);
        CCUtil.setNodeScale(this.plAnim, scale);
        if (scale < 1.0) CCUtil.setNodeScale(this.plRight, scale);

        this.egg.node.active = false;

        this.sp.setCompleteListener(this.onAnimationComplete.bind(this));
        this.egg.setCompleteListener(this.onAnimationComplete.bind(this));
    }
    /**设置UI层显示 */
    setUIVisible(isShow: boolean) {
        this.plTop.active = isShow;
        this.plBottom.active = isShow;
        this.plLeft.active = isShow;
        this.plRight.active = isShow;
    }
    /**返回按钮 */
    onBtnBackClick() {
        this.node.destroy();
    }
    /**抽奖按钮 */
    onBtnDrawClick() {
        if (!this._canDraw) return;
        this._canDraw = false;
        this.sp.setAnimation(0, spAnimNames[1], false);
        this.egg.node.active = false;
    }
    /**抽奖10次按钮 */
    onBtnDrawTimesClick() {
        if (!this._canDraw) return;
        this._canDraw = false;
        this.sp.setAnimation(0, spAnimNames[2], false);
        this.setUIVisible(false);
        this.egg.node.active = false;
    }
    /**单词大冒险 今日复习按钮 */
    onBtnTodayReview1Click() {
        ViewsMgr.showView(PrefabType.ReviewWordListView, (node: Node) => {
            node.getComponent(ReviewWordListView).init(ReviewSourceType.word_game);
        });
    }
    /**单词大冒险 复习按钮 */
    onBtnReview1Click() {
        ViewsMgr.showTip(TextConfig.Function_Tip);
    }
    /**单词大冒险  复习规划提示*/
    onLabelTip1Click() {
        ViewsMgr.showView(PrefabType.ReviewAdjustPlanView);
    }
    /**教材单词 今日复习按钮 */
    onBtnTodayReview2Click() {
        ViewsMgr.showView(PrefabType.ReviewWordListView, (node: Node) => {
            node.getComponent(ReviewWordListView).init(ReviewSourceType.classification);
        });
    }
    /**教材单词 复习按钮 */
    onBtnReview2Click() {
        ViewsMgr.showTip(TextConfig.Function_Tip);
    }
    /**教材单词  复习规划提示*/
    onLabelTip2Click() {
        ViewsMgr.showView(PrefabType.ReviewAdjustPlanView);
    }
    /**动画结束回调 */
    onAnimationComplete(trackEntry: sp.spine.TrackEntry) {
        let name = trackEntry.animation.name;
        if (name === spAnimNames[1]) {
            console.log("单抽动画结束");
            this.egg.node.active = true;
            this._eggID = ToolUtil.getRandomInt(0, 4);
            this.egg.setAnimation(0, eggAnimNames[this._eggID * 2 + 1], false);
        } else if (name == spAnimNames[2]) {
            console.log("十连抽动画结束");
            ViewsMgr.showRewards([{ id: PropID.coin, num: 10 }, { id: PropID.diamond, num: 20 }], () => {
                this.sp.setAnimation(0, spAnimNames[0], false);
                this.setUIVisible(true);
                this._canDraw = true;
            });
        } else if (name == eggAnimNames[this._eggID * 2 + 1]) {
            this._canDraw = true;
            ViewsMgr.showRewards([{ id: PropID.stamina, num: 1 }]);
        }
    }
    /**复习规划返回 */
    onRepReviewPlan(data: s2cReviewPlan) {
        if (200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        let info = data.word_game;
        if (info) {
            this.labelStudy1.string = ToolUtil.replace(TextConfig.ReviewPlan_Study, info.study_num);
            this.labelReview1.string = ToolUtil.replace(TextConfig.ReviewPlan_Review, info.review_num);
        }
        info = data.classification;
        if (info) {
            this.labelStudy2.string = ToolUtil.replace(TextConfig.ReviewPlan_Study, info.study_num);
            this.labelReview2.string = ToolUtil.replace(TextConfig.ReviewPlan_Review, info.review_num);
        }
    }
}


