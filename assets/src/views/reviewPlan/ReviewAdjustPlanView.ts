import { _decorator, Component, Label, Node } from 'cc';
import { TextConfig } from '../../config/TextConfig';
import { ViewsMgr } from '../../manager/ViewsManager';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('ReviewAdjustPlanView')
export class ReviewAdjustPlanView extends Component {
    @property(Node)
    public btnClose: Node = null;//关闭按钮
    @property(Node)
    public btnSave: Node = null;//保存按钮
    @property([Node])
    public items: Node[] = [];
    @property(Label)
    public labelWords: Label = null;//单词数

    private _selectID: number = null;//选中ID
    private _dataID: number = null;//数据ID

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
        CCUtil.onTouch(this.btnSave, this.onClickSave, this);
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            CCUtil.onTouch(item, this.onClickItem.bind(this, i), this);
        }
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onClickClose, this);
        CCUtil.offTouch(this.btnSave, this.onClickSave, this);
    }
    /**初始化 */
    init() {
        this.onSelectItem(0);
    }
    /**关闭按钮点击 */
    onClickClose() {
        this.node.destroy();
    }
    /**保存按钮点击 */
    onClickSave() {
        if (this._selectID == this._dataID) return;
        ViewsMgr.showTip(TextConfig.Function_Tip);
    }
    /**item点击 */
    onClickItem(id: number) {
        this.onSelectItem(id);
    }
    /**选中item */
    onSelectItem(id: number) {
        if (this._selectID == id) return;
        this._selectID = id;
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            item.getChildByName("img_adjust_select").active = (i == id);
            // item.getChildByName("Label1").getComponent(Label).string = "";
        }
    }
}
