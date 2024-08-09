import { _decorator, error, Node, Prefab, SpriteFrame, view } from 'cc';
import { EventType } from '../../config/EventType';
import { KeyConfig } from '../../config/KeyConfig';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { BookAwardListModel, BookPlanDetail, CurrentBookStatus, ModifyPlanData, UnitListItemStatus } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import StorageUtil from '../../util/StorageUtil';
import { ChallengeLeftView } from '../TextbookVocabulary/ChallengeLeftView';
import { ChallengeRemindView, IChallengeRemindData } from '../TextbookVocabulary/ChallengeRemindView';
import { SettingPlanView } from '../TextbookVocabulary/SettingPlanView';
import { TextbookListView } from '../TextbookVocabulary/TextbookListView';
import { WordCheckView } from '../TextbookVocabulary/WordCheckView';
import { BreakThroughView } from './BreakThroughView';
import { ChallengeBottomView } from './ChallengeBottomView';
import { RightUnitCallbackType, RightUnitView } from './RightUnitView';

const { ccclass, property } = _decorator;

@ccclass('TextbookChallengeView')
export class TextbookChallengeView extends BaseView {
    @property(Node)
    public top_layout: Node = null; // Top navigation bar

    @property(Node)
    public content_layout: Node = null; // Content

    private _unitDetailView: RightUnitView = null;
    private _bottomView: ChallengeBottomView = null;
    private _bookData: CurrentBookStatus = null;
    private _unitListArr: UnitListItemStatus = null;
    private _planData: BookPlanDetail = null;
    private _monsterView: ChallengeLeftView = null;

    protected async initUI() {
        await this.initLeftMonster();
        this.initNavTitle();
        this.initAmount();
        await this.initChallengeBottom();
        await this.initRightBookUnitInfo();
        TBServer.reqCurrentBook();
        if (StorageUtil.getData(KeyConfig.FIRST_TEXTBOOK_CHALLENGE, "1") === "1") {
            this.showFirstEnter();
        }
    }

    protected async showFirstEnter() {
        const message = `<color=#864d42>亲爱的闯词同学：\n欢迎来到教材词汇挑战之旅！这里充满着无尽的知识和奖励的神秘宝箱，它包含了能够富裕探险者智慧和能力的奖励。很久以前，这个宝箱是由勇敢的学者们守护的，他们用智慧和勇气保护着它。但是有一天夜晚，一群贪婪的怪兽悄悄闯入王国，偷走了宝箱的钥匙，并将其分散在各个教材单元深处。这些怪兽用不同的单词作为保护钥匙的魔法屏障，试图阻止任何人发现它们。</color><color=#466cc9>你的任务是击败这些“钥匙怪”，并夺取它们手中的“怪物钥匙”，开启神秘宝箱。</color>`;
        const data: IChallengeRemindData = {
            sure_text: "查看任务",
            content_text: message,
        };
        const node = await ViewsManager.instance.showPopup(PrefabType.ChallengeRemindView);
        const remindScript = node.getComponent(ChallengeRemindView);
        remindScript.initRemind(data);
        StorageUtil.saveData(KeyConfig.FIRST_TEXTBOOK_CHALLENGE, "0");
    }

    onInitModuleEvent() {
        this.addModelListener(NetNotify.Classification_CurrentBook, this.onCurrentBookStatus.bind(this));
        this.addModelListener(NetNotify.Classification_UnitListStatus, this.onUnitListStatus.bind(this));
        this.addModelListener(NetNotify.Classification_PlanModify, this.onPlanModify.bind(this));
        this.addModelListener(NetNotify.Classification_BookPlanDetail, this.onBookPlanDetail.bind(this));
        this.addModelListener(NetNotify.Classification_BookAwardList, this.onBookAwardList.bind(this));
        this.addModelListener(EventType.Update_Textbook_Challenge, this.onUpdateTextbookChallenge.bind(this));
    }

    onUpdateTextbookChallenge() {
        TBServer.reqCurrentBook();
    }

    onCurrentBookStatus(data: CurrentBookStatus) {
        console.log("onCurrentBookStatus", data);
        this._bookData = data;
        this._unitDetailView.updateUnitProps(this._bookData);
        this.getUnitListStatus();
        this.getBookPlanDetail();
        this._bottomView.updateItemList(data);
        this._monsterView.updateMonsterInfo(this._bookData.monster_id);
    }

    onPlanModify(data: any) {
        TBServer.reqBookPlanDetail(this._bookData.book_id);
    }

    onBookAwardList(data: BookAwardListModel) {
        // Potential future implementation
    }

    onBookPlanDetail(data: BookPlanDetail) {
        this._planData = data;
        this._unitDetailView.updateRightPlan(data);
    }

    onSelectWordPlan(params: any) {
        if (params.isSave) {
            const modifyData: ModifyPlanData = {
                cu_id: this._planData.cu_id,
                num: parseInt(params.left, 10)
            };
            TBServer.reqModifyPlan(modifyData);
        }
    }

    async onUnitListStatus(data: UnitListItemStatus) {
        this._unitListArr = data;
        await this.loadResources();
    }

    private async loadResources() {
        await Promise.all([
            ResLoader.instance.load(`prefab/${PrefabType.MapPointItem.path}`, Prefab),
            ResLoader.instance.load("adventure/bg/long_background/bg_map_01/spriteFrame", SpriteFrame),
        ]).catch(err => {
            if (err) error(err);
        });
    }

    getUnitListStatus() {
        TBServer.reqUnitListStatus(this._bookData.book_id);
    }

    getBookPlanDetail() {
        TBServer.reqBookPlanDetail(this._bookData.book_id);
    }

    initNavTitle() {
        this.createNavigation("我的词书", this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
        });
    }

    initAmount() {
        ViewsManager.addAmount(this.top_layout, 5.471, 42.399);
    }

    async initRightBookUnitInfo() {
        const node = await this.loadAndInitPrefab(PrefabType.RightUnitView, this.content_layout, {
            isAlignVerticalCenter: true,
            isAlignRight: true,
            verticalCenter: 62.308,
            right: 62.308
        });
        this._unitDetailView = node.getComponent(RightUnitView);
        this._unitDetailView.setCallback(RightUnitCallbackType.MODIFY, this.showSettingPlanView.bind(this));
        this._unitDetailView.setCallback(RightUnitCallbackType.BREAK_THROUGH, this.showBreakThroughView.bind(this));
        this._unitDetailView.setCallback(RightUnitCallbackType.CHANGE_BOOK, this.showChangeBookView.bind(this));
        this._unitDetailView.setCallback(RightUnitCallbackType.CHECK_WORD, this.showCheckWordView.bind(this));
        this._unitDetailView.setCallback(RightUnitCallbackType.REVIEW, this.showReviewView.bind(this));
    }

    private async showSettingPlanView() {
        const node = await ViewsManager.instance.showPopup(PrefabType.SettingPlanView);
        const script = node.getComponent(SettingPlanView);
        const titleBookName = `${this._bookData.book_name}${this._bookData.grade}`;
        script.updateTitleName(titleBookName, this._planData.gate_total - this._planData.gate_pass_total,this.onSelectWordPlan.bind(this));
    }

    private async showBreakThroughView() {
        const node = await ViewsManager.instance.showLearnView(PrefabType.BreakThroughView);
        const script = node.getComponent(BreakThroughView);
        script.initData(this._bookData, this._unitListArr);
        ViewsManager.instance.closeView(PrefabType.TextbookChallengeView);
    }

    private async showChangeBookView() {
        const node = await ViewsManager.instance.showViewAsync(PrefabType.TextbookListView);
        const script = node.getComponent(TextbookListView);
        script.initData(this._bookData);
    }

    private async showCheckWordView() {
        const node = await ViewsManager.instance.showViewAsync(PrefabType.WordCheckView);
        const script = node.getComponent(WordCheckView);
        script.initData(this._bookData);
    }

    private async showReviewView() {
        await ViewsManager.instance.showViewAsync(PrefabType.ReviewPlanView);
    }

    async initChallengeBottom() {
        const node = await this.loadAndInitPrefab(PrefabType.ChallengeBottomView, this.node);
        this._bottomView = node.getComponent(ChallengeBottomView);
    }

    async initLeftMonster() {
        const viewSizeWidth = view.getVisibleSize().width;
        const projectSizeWidth = view.getDesignResolutionSize().width;
        const node = await this.loadAndInitPrefab(PrefabType.ChallengeLeftView, this.content_layout, {
            isAlignLeft: true,
            isAlignVerticalCenter: true,
            verticalCenter: 78.489,
            left: 108.736 * viewSizeWidth / projectSizeWidth
        });
        this._monsterView = node.getComponent(ChallengeLeftView);
    }
}
