import { _decorator, Label, Node, sp, Vec3 } from 'cc';
import { EventType } from '../../config/EventType';
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
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { ToolUtil } from '../../util/ToolUtil';
import { GameSourceType } from '../adventure/sixModes/BaseModeView';
import { RewardItem } from '../common/RewardItem';

const { ccclass, property } = _decorator;

const Spine_Reward = {
    path: "spine/result/uieffect_6",
    anim: "animation_1",
};

@ccclass('ReviewEndView')
export class ReviewEndView extends BaseComponent {
    @property(List)
    public listReward: List = null;
    @property(Node)
    public btnEnd: Node = null;
    @property(Node)
    public btnContinue: Node = null;
    @property(PetModel)
    public pet: PetModel = null;
    @property(sp.Skeleton)
    public rewardNode: sp.Skeleton = null;
    @property(Label)
    public label: Label = null;

    private _statusData: s2cReviewPlanStatus = null;
    private _data: ItemData[] = null;
    private _souceType: GameSourceType = null;
    public static isShowReviewEnded: boolean = false;

    protected onLoad(): void {
        this.initEvents();
    }

    protected onDestroy(): void {
        ReviewEndView.isShowReviewEnded = false;
        this.removeEvents();
    }

    private initEvents() {
        CCUtil.onTouch(this.btnEnd, this.onBtnEndClick, this);
        CCUtil.onTouch(this.btnContinue, this.onBtnContinueClick, this);
        this.addEvent(InterfacePath.c2sReviewPlanStatus, this.onRepReviewPlanStatus.bind(this));
    }

    private removeEvents() {
        CCUtil.offTouch(this.btnEnd, this.onBtnEndClick, this);
        CCUtil.offTouch(this.btnContinue, this.onBtnContinueClick, this);
        this.clearEvent();
    }

    public init(source: GameSourceType, data: ItemData[]) {
        this._souceType = source;
        this._data = data;
        this.btnContinue.active = false;
        this.label.node.active = false;

        this.pet.initSelf();
        this.pet.show(true);
        CCUtil.setNodeCamera2DUI(this.pet.node);
        this.adjustPetSize();

        if (data.length > 0) {
            LoadManager.loadSpine(Spine_Reward.path, this.rewardNode).then(() => {
                this.listReward.numItems = data.length;
                this.rewardNode.setAnimation(0, Spine_Reward.anim, false);
            });
        }
        ReviewEndView.isShowReviewEnded = true;
        ServiceMgr.studyService.reqReviewPlanStatus(source);
    }

    private adjustPetSize() {
        this.pet.node.scale = this.pet.level <= 2 ? new Vec3(1.5, 1.5, 1.5) : new Vec3(1, 1, 1);
    }

    private onRepReviewPlanStatus(data: s2cReviewPlanStatus) {
        this._statusData = data;
        this.label.node.active = true;
        if (data.review_wp_list.length > 0) {
            this.btnContinue.active = true;
            this.label.string = ToolUtil.replace(TextConfig.ReviewPlan_End, data.need_review_num);
        } else {
            this.btnContinue.active = false;
            this.label.string = this._souceType === GameSourceType.word_game ? TextConfig.ReviewPlan_End3 : TextConfig.ReviewPlan_End2;
        }
    }

    private onBtnEndClick() {
        EventMgr.emit(EventType.Wordbook_List_Refresh);
        ServiceMgr.studyService.reqReviewPlan();
        ViewsMgr.closeView(PrefabType.ReviewEndView);
    }

    private onListRewardLoad(node: Node, idx: number) {
        node.getComponent(RewardItem).init(this._data[idx]);
    }

    private onBtnContinueClick() {
        const data = this._statusData;
        if (data.code !== 200) {
            ViewsMgr.showAlert(data.msg);
            return;
        }
        if (!data.review_wp_list.length) {
            ViewsMgr.showTip(TextConfig.ReviewPlan_Null);
            return;
        }
        ReviewEndView.isShowReviewEnded = false;
        ServiceMgr.studyService.reqReviewPlanStatus(this._souceType);
        ViewsMgr.closeView(PrefabType.ReviewEndView);
        /*
        const wordsData: ReviewWordModel[] = data.review_wp_list.map(value => {
            const word = new ReviewWordModel();
            word.cn = value.cn;
            word.w_id = value.w_id;
            word.word = value.word;
            word.wp_id = value.wp_id;
            word.symbol = value.symbol;
            word.symbolus = value.symbolus;
            return word;
        });
        

        const errorKeys = Object.keys(data.error_wp_info);

        const errorNum = errorKeys.length;

        const additionalWords = errorKeys
            .map(key => {
                return wordsData.find(val => val.wp_id === key);
            })
            .filter(word => word !== undefined) as ReviewWordModel[];
        wordsData.push(...additionalWords);

        ViewsMgr.showView(PrefabType.WordMeaningView, (node: Node) => {
            node.getComponent(WordMeaningView).initData(wordsData, {
                source_type: GameSourceType.review,
                ws_id: data.ws_id,
                pass_num: data.pass_num,
                word_num: Math.min(data.review_wp_list.length, data.word_num),
                error_num: errorNum,
                souceType: this._souceType,
                wordCount: data.review_wp_list.length,
                monster_id: EducationLevel.ElementaryGrade1
            });
            this.node.destroy();
        });
        */
    }
}
