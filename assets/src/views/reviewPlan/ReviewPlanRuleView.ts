import { _decorator, Component, Label, Node } from 'cc';
import GlobalConfig from '../../GlobalConfig';
import CCUtil from '../../util/CCUtil';
import { ToolUtil } from '../../util/ToolUtil';
import { GameSourceType } from '../adventure/sixModes/BaseModeView';
const { ccclass, property } = _decorator;

@ccclass('ReviewPlanRuleView')
export class ReviewPlanRuleView extends Component {
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property(Label)
    public labelRule: Label = null;//规则内容
    @property(Node)
    public frame: Node = null;//背景框
    protected onLoad(): void {
        this.initEvent();
        let scale = ToolUtil.getValue(GlobalConfig.WIN_DESIGN_RATE, 0.1, 1.0);
        CCUtil.setNodeScale(this.frame, scale);
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

    init(type: GameSourceType) {
        if (GameSourceType.word_game == type) {
            this.labelRule.string = "大冒险规则";
        } else {
            this.labelRule.string = "教材单词规则";
        }
    }
}


