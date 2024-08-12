import { _decorator, EventTouch, Node } from 'cc';
import { s2cWordbookErrorbook, s2cWordbookErrorbookInfo } from '../../models/NetModel';
import { InterfacePath } from '../../net/InterfacePath';
import { ServiceMgr } from '../../net/ServiceManager';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ReviewSourceType } from '../reviewPlan/ReviewWordListView';
import { WordItem, WordItemInfo } from './WordItem';
const { ccclass, property } = _decorator;

export const ErrorWordbookType = {
    Errorbook: "err",//错题本
    Collect: "collect",//收藏本
}

@ccclass('ErrorWordbookView')
export class ErrorWordbookView extends BaseComponent {
    @property(List)
    public list: List = null;
    @property(Node)
    public btnReview1: Node = null;
    @property(Node)
    public btnReview2: Node = null;
    @property([Node])
    public btnSortAry: Node[] = [];
    @property(Node)
    public btnShowCn: Node = null;

    private _isInit: boolean = false;
    private _sourceType: string = null;
    private _lastSelectTab: Node = null;
    private _showCnFlag: boolean = false;
    private _listData: s2cWordbookErrorbookInfo[] = [];
    private _selectAry: boolean[] = [];

    protected onDestroy(): void {
        this.clearEvent();
    }
    protected onLoad(): void {
        this.initEvent();
    }

    private initEvent() {
        CCUtil.onTouch(this.btnReview1, this.onBtnReview1, this);
        CCUtil.onTouch(this.btnReview2, this.onBtnReview2, this);
        CCUtil.onTouch(this.btnShowCn, this.onBtnShowCn, this);
        for (let i = 0; i < this.btnSortAry.length; i++) {
            const element = this.btnSortAry[i];
            element["idx"] = i;
            CCUtil.onTouch(element, this.onBtnSort, this);
        }

        this.addEvent(InterfacePath.c2sWordbookErrorbook, this.onRepErrorbook.bind(this));
    }
    public onEnable(): void {
        if (this._isInit) {
            if (this._lastSelectTab) {
                this._lastSelectTab.active = false;
                this._lastSelectTab = null;
            }
            this.onSortByNode(this.btnSortAry[0]);
        }
    }
    public init(sourceType: string) {
        if (this._isInit) return;
        this._isInit = true;
        this._sourceType = sourceType;
        ServiceMgr.wordbookSrv.reqErrorbook(this._sourceType);
    }
    /**错题本返回 */
    private onRepErrorbook(data: s2cWordbookErrorbook) {
        if (200 != data.code) return;
        if (!data.word_list || data.word_type != this._sourceType) return;
        this._listData = data.word_list;
        this._lastSelectTab = null;
        this.onSortByNode(this.btnSortAry[0]);
        // this.list.numItems = this._listData.length;
    }
    /**获得单词中文 */
    private getCn(data: s2cWordbookErrorbookInfo) {
        let cn;
        if (ReviewSourceType.word_game == data.source_type) {
            cn = data.gw_cn;
        } else if (ReviewSourceType.classification == data.source_type) {
            cn = data.cw_cn;
        } else {
            cn = data.g_cn;
        }
        return cn;
    }
    /**列表加载 */
    private onLoadList(node: Node, idx: number) {
        let data = this._listData[idx];
        let itemInfo = new WordItemInfo();
        itemInfo.idx = idx;
        itemInfo.word = data.word;
        itemInfo.symbol = data.symbol;
        itemInfo.symbolus = data.symbolus;
        itemInfo.cn = this.getCn(data);
        let isSelect = this._selectAry[idx];
        if (null == isSelect) isSelect = false;
        itemInfo.isSelect = isSelect;
        itemInfo.isShowCn = this._showCnFlag;
        node.getComponent(WordItem).init(itemInfo, () => {
            ServiceMgr.studyService.moreWordDetail(data.word);
        }, (_, status) => {
            this._selectAry[idx] = status;
        });
    }
    /**词义训练 */
    private onBtnReview1() {

    }
    /**拼写训练 */
    private onBtnReview2() {

    }
    /**排序按钮 */
    private onSortByNode(node: Node) {
        console.log("onSortByNode", this._sourceType, this._listData.length);
        let tabNode = node.getChildByName("img_tab");
        if (this._lastSelectTab == tabNode) return;
        tabNode.active = true;
        if (this._lastSelectTab) {
            this._lastSelectTab.active = false;
        }
        this._lastSelectTab = tabNode;
        /**排序 */
        let idx = node["idx"];
        if (0 == idx) {
            this._listData.sort((a, b) => {
                return a.create_time < b.create_time ? 1 : -1;
            });
        } else if (1 == idx) {
            this._listData.sort((a, b) => {
                return a.create_time >= b.create_time ? 1 : -1;
            });
        } else if (2 == idx) {
            this._listData.sort((a, b) => {
                return a.word > b.word ? 1 : -1;
            });
        } else {
            this._listData.sort((a, b) => {
                return a.word <= b.word ? 1 : -1;
            });
        }

        this._selectAry = [];
        this.list.numItems = this._listData.length;
    }
    private onBtnSort(event: EventTouch) {
        let node: Node = event.currentTarget;
        this.onSortByNode(node);
    }
    private onBtnShowCn() {
        let tabNode = this.btnShowCn.getChildByName("img_tab");
        this._showCnFlag = !tabNode.active;
        tabNode.active = this._showCnFlag;
        this.list.updateAll();
    }
}


