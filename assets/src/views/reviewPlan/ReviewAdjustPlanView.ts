import { _decorator, Component, Label, Node, Sprite, SpriteFrame, Toggle } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { ViewsMgr } from '../../manager/ViewsManager';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;

const maxSelectCount = 10;

@ccclass('ReviewAdjustPlanView')
export class ReviewAdjustPlanView extends Component {
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property(Node)
    public btnStudy: Node = null;//学习按钮
    @property(List)
    public list: List = null;//列表
    @property([SpriteFrame])
    public imgFrames: SpriteFrame[] = [];
    @property(Node)
    public btnSelect1: Node = null;
    @property(Node)
    public btnSelect2: Node = null;
    @property(Label)
    public label: Label = null;

    private _selectState: boolean[];
    private _selectCount: number = 0;

    start() {
        this.init();
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onClickClose, this);
        CCUtil.onTouch(this.btnStudy, this.onClickStudy, this);
        CCUtil.onTouch(this.btnSelect1, this.onClickSelect1, this);
        CCUtil.onTouch(this.btnSelect2, this.onClickSelect2, this);
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onClickClose, this);
        CCUtil.offTouch(this.btnStudy, this.onClickStudy, this);
        CCUtil.offTouch(this.btnSelect1, this.onClickSelect1, this);
        CCUtil.offTouch(this.btnSelect2, this.onClickSelect2, this);
    }
    /**初始化 */
    init() {
        let count = 20;
        this._selectState = Array.from({ length: count }, () => false);
        this._selectCount = 0;
        this.refreshSelectLable();
        this.list.numItems = count;
    }
    /**关闭按钮点击 */
    onClickClose() {
        this.node.destroy();
    }
    /**学习按钮点击 */
    onClickStudy() {
        if (this._selectCount < maxSelectCount) return;
        ViewsMgr.showTip(TextConfig.Function_Tip);
    }
    /**加载list */
    onLoadList(node: Node, idx: number) {
        node.getChildByName("word").getComponent(Label).string = "word";
        node.getChildByName("mean").getComponent(Label).string = "vj.好的";
        let toggle = node.getComponentInChildren(Toggle);
        toggle["idx"] = idx;
        toggle.isChecked = this._selectState[idx];
        toggle.node.off(Toggle.EventType.TOGGLE, this.checkToggleEvent, this);
        toggle.node.on(Toggle.EventType.TOGGLE, this.checkToggleEvent, this);
    }
    /**顺序十个 */
    onClickSelect1() {
        let needCount = maxSelectCount;
        if (this._selectState.length >= needCount) {
            this._selectState.fill(true, 0, needCount - 1);
            this._selectState.fill(false, needCount);
            this._selectCount = needCount;
            this.list.updateAll();
        }
        this.refreshSelectLable();
    }
    /**随机十个 */
    onClickSelect2() {
        this._selectState.fill(false);
        this._selectCount = 0;
        let count = this._selectState.length;
        let needCount = maxSelectCount;
        if (count >= needCount) {
            let tmpList = Array.from({ length: count }, (_, x) => x);
            for (let i = 0; i < needCount; i++) {
                let idx = ToolUtil.getRandomInt(0, tmpList.length - 1);
                this._selectState[tmpList[idx]] = true;
                this._selectCount++;
                tmpList.splice(idx, 1);
            }
        }
        this.refreshSelectLable();
        this.list.updateAll();
    }
    /**选中事件 */
    checkToggleEvent(toggle: Toggle) {
        let status = toggle.isChecked;
        let idx = toggle["idx"];
        if (status) {
            if (!this._selectState[idx]) {
                if (this._selectCount >= maxSelectCount) {
                    status = false;
                    toggle.isChecked = false;
                    ViewsMgr.showTip(TextConfig.ReviewPlan_Tip);
                } else {
                    this._selectCount++;
                }
            }
        } else {
            if (this._selectState[idx]) {
                this._selectCount--;
            }
        }
        this._selectState[idx] = status;
        this.refreshSelectLable();
    }
    /**更新选择显示 */
    refreshSelectLable() {
        this.label.string = ToolUtil.replace(TextConfig.ReviewPlan_Select, this._selectCount);
        this.btnStudy.getComponent(Sprite).grayscale = this._selectCount < maxSelectCount;
    }
}

