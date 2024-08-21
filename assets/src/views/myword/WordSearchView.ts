import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsMgr } from '../../manager/ViewsManager';
import { WordsDetailData } from '../../models/AdventureModel';
import { BaseView } from '../../script/BaseView';
import { WordPanel } from './WordPanel';
const { ccclass, property } = _decorator;

@ccclass('WordSearchView')
export class WordSearchView extends BaseView {

    @property({ type: Node, tooltip: "返回 top_layout" })
    public top_layout: Node = null;

    @property(Node)
    public content_layout: Node = null;
    _wordData: WordsDetailData = null; //单词详细信息
    private _wordPanel:WordPanel = null;

    protected async initUI() {
        this.initNavTitle();
        await this.initViews();
    }
    /** 初始化数据 */
    public updateData(data: WordsDetailData) {
        this._wordData = data;   
    }
    private initNavTitle() {
        this.createNavigation("单词详情",this.top_layout, () => {
            ViewsMgr.closeView(PrefabType.WordSearchView);
        });
    }
    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.WordPanel, (node) => {
                this._wordPanel = node.getComponent(WordPanel);
                this._wordPanel.updateWordData(this._wordData);
            },{
                isAlignBottom: true,
                bottom: 0
            }),
        ]);
    }
}


