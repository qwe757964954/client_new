import { _decorator, Label, Node, sp, Vec3 } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ItemData } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsMgr } from '../../manager/ViewsManager';
import { s2cReviewPlanStatus } from '../../models/NetModel';
import { PetModel } from '../../models/PetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ToolUtil } from '../../util/ToolUtil';
import { WordSourceType } from '../adventure/sixModes/BaseModeView';
import { WordMeaningView } from '../adventure/sixModes/WordMeaningView';
import { RewardItem } from '../common/RewardItem';
import { ReviewWordModel } from './ReviewPlanView';
import { ReviewSourceType } from './ReviewWordListView';
const { ccclass, property } = _decorator;

const Spine_Reward = {
    path: "spine/result/uieffect_6",
    anim: "animation_1",
};

@ccclass('ReviewEndView')
export class ReviewEndView extends BaseComponent {
    @property(List)
    public listReward: List = null;//奖励列表
    @property(Node)
    public btnEnd: Node = null;//结束按钮
    @property(Node)
    public btnContinue: Node = null;//继续按钮
    @property(PetModel)
    public pet: PetModel = null;//宠物
    @property(sp.Skeleton)
    public rewardNode: sp.Skeleton = null;//奖励
    @property(Label)
    public label: Label = null;//文字

    private _statusData: s2cReviewPlanStatus = null;//数据
    private _data: ItemData[] = null;//数据
    private _souceType: ReviewSourceType = null;//来源类型

    protected onLoad(): void {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    initEvent() {
        CCUtil.onTouch(this.btnEnd, this.onBtnEndClick, this);
        CCUtil.onTouch(this.btnContinue, this.onBtnContinueClick, this);

        this.addEvent(InterfacePath.c2sReviewPlanStatus, this.onRepReviewPlanStatus.bind(this));
    }
    removeEvent() {
        CCUtil.offTouch(this.btnEnd, this.onBtnEndClick, this);
        CCUtil.offTouch(this.btnContinue, this.onBtnContinueClick, this);
        this.clearEvent();
    }
    init(source: ReviewSourceType, data: ItemData[]) {
        this._souceType = source;
        this._data = data;
        this.btnContinue.active = false;
        this.label.node.active = false;

        this.pet.initSelf();
        this.pet.show(true);
        CCUtil.setNodeCamera2DUI(this.pet.node);
        this.fixPetSize();

        if (data && data.length > 0) {
            LoadManager.loadSpine(Spine_Reward.path, this.rewardNode).then(() => {
                this.listReward.numItems = data.length;
                this.rewardNode.setAnimation(0, Spine_Reward.anim, false);
                // this.rewardNode.setCompleteListener(() => {
                //     // this.rewardNode.node.active = false;
                // });
            });
        }
        ServiceMgr.studyService.reqReviewPlanStatus(source);
    }
    /**调整宠物大小 */
    fixPetSize() {
        if (this.pet.level <= 2) {//特殊处理，后面考虑走配置
            this.pet.node.scale = new Vec3(1.5, 1.5, 1.5);
        } else {
            this.pet.node.scale = new Vec3(1, 1, 1);
        }
    }
    /**复习规划状态 */
    onRepReviewPlanStatus(data: s2cReviewPlanStatus) {
        this._statusData = data;

        this.label.node.active = true;
        if (data.review_wp_list && data.review_wp_list.length > 0) {
            this.btnContinue.active = true;
            this.label.string = ToolUtil.replace(TextConfig.ReviewPlan_End, data.need_review_num);
        } else {
            this.btnContinue.active = false;
            if (ReviewSourceType.word_game == this._souceType) {
                this.label.string = TextConfig.ReviewPlan_End3;
            } else if (ReviewSourceType.classification == this._souceType) {
                this.label.string = TextConfig.ReviewPlan_End2;
            }
        }
    }
    /**完成复习 */
    onBtnEndClick() {
        ServiceMgr.studyService.reqReviewPlan();//刷新复习规划
        this.node.destroy();
    }
    /**列表加载 */
    onListRewardLoad(node: Node, idx: number) {
        node.getComponent(RewardItem).init(this._data[idx]);
    }
    /**继续复习 */
    onBtnContinueClick() {
        let data = this._statusData;
        if (data && 200 != data.code) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        if (!data || !data.review_wp_list || data.review_wp_list.length == 0) {
            ViewsMgr.showTip(TextConfig.ReviewPlan_Null);
            return;
        }
        let wordsdata: ReviewWordModel[] = [];
        data.review_wp_list.forEach((value) => {
            let word: ReviewWordModel = new ReviewWordModel();
            word.cn = value.cn;
            word.w_id = value.w_id;
            word.word = value.word;
            word.wp_id = value.wp_id;
            word.symbol = value.symbol;
            word.symbolus = value.symbolus;
            wordsdata.push(word);
        });
        let errorNum = 0;
        for (const key in data.error_wp_info) {
            const value = data.error_wp_info[key];
            errorNum++;
            let word = wordsdata.find(val => val.wp_id == key);
            if (!word) continue;
            wordsdata.push(word);
        }
        let wordCount = data.review_wp_list.length;
        let wordNum = Math.min(wordCount, data.word_num);

        ViewsMgr.showView(PrefabType.WordMeaningView, (node: Node) => {
            node.getComponent(WordMeaningView).initData(wordsdata, {
                source_type: WordSourceType.review,
                ws_id: data.ws_id, pass_num: data.pass_num, word_num: wordNum, error_num: errorNum, souceType: this._souceType, wordCount: wordCount
            });
            this.node.destroy();
        });

    }
}


