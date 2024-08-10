import { _decorator, Component, EventTouch, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
const { ccclass, property } = _decorator;

@ccclass('ReviewWordbookView')
export class ReviewWordbookView extends Component {
    @property(List)
    public list: List = null;
    @property(Node)
    public btnReview: Node = null;
    @property([Node])
    public btnSortAry: Node[] = [];
    @property(Node)
    public btnShowCn: Node = null;

    private _lastSelectTab: Node = null;
    private _showCnFlag: boolean = false;
    private _listData: any[] = [];

    private initEvent() {
        CCUtil.onTouch(this.btnReview, this.onBtnReview, this);
        CCUtil.onTouch(this.btnShowCn, this.onBtnShowCn, this);
        for (let i = 0; i < this.btnSortAry.length; i++) {
            const element = this.btnSortAry[i];
            element["idx"] = i;
            CCUtil.onTouch(element, this.onBtnSort, this);
        }
    }
    public init() {
        this.initEvent();
    }

    private onLoadList(node: Node, idx: number) {
    }

    private onBtnReview() {

    }
    private onBtnSort(event: EventTouch) {
        let node: Node = event.currentTarget;
        let tabNode = node.getChildByName("img_tab");
        if (tabNode.active) return;
        tabNode.active = true;
        let idx = node["idx"];
        if (this._lastSelectTab) {
            this._lastSelectTab.active = false;
        }
        this._lastSelectTab = tabNode;
    }
    private onBtnShowCn() {
        let tabNode = this.btnShowCn.getChildByName("img_tab");
        this._showCnFlag = !tabNode.active;
        tabNode.active = this._showCnFlag;
        this.list.updateAll();
    }
}


