import { _decorator, Component, Label, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import { ReviewSourceType } from './ReviewWordListView';
const { ccclass, property } = _decorator;

@ccclass('ReviewPlanRuleView')
export class ReviewPlanRuleView extends Component {
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property(Label)
    public labelRule: Label = null;//规则内容
    protected onLoad(): void {
        this.initEvent();
    }
    protected onDestroy(): void {
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
    }
    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onBtnCloseClick, this);
    }

    onBtnCloseClick() {
        this.node.destroy();
    }

    init(type: ReviewSourceType) {
        if (ReviewSourceType.word_game == type) {
            this.labelRule.string = "大冒险规则";
        } else {
            this.labelRule.string = "教材单词规则";
        }
    }
}


