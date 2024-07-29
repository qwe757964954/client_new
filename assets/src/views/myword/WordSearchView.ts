import { _decorator, Node } from 'cc';
import { PrefabType, PrefabTypeEntry } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { WordsDetailData } from '../../models/AdventureModel';
import { BaseView } from '../../script/BaseView';
import { WordDetailPanel } from '../TextbookVocabulary/WordDetailPanel';
import { WordSentence } from './SearchWordView';
import { WordPanel } from './WordPanel';
const { ccclass, property } = _decorator;

@ccclass('WordSearchView')
export class WordSearchView extends BaseView {

    @property({ type: Node, tooltip: "返回 top_layout" })
    public top_layout: Node = null;

    @property(Node)
    public content_layout: Node = null;

    _wordData: WordsDetailData = null; //单词详细信息
    _word: string = ""; //单词名字
    _imgShow: boolean = true; //是否显示图片

    _sentenceData: WordSentence = null; //例句信息
    _sentenceId: string = ""; //例句ID

    _tabIdx: number = 1; //显示更多的tab页

    _wordDetailPanel: WordDetailPanel = null;

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
            ViewsManager.instance.closeView(PrefabType.WordSearchView);
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
    private async initViewComponent(prefabType: PrefabTypeEntry, onComponentInit: (node: Node) => void, alignOptions?: object) {
        let node = await this.loadAndInitPrefab(prefabType, this.node, alignOptions);
        onComponentInit(node);
    }
}


