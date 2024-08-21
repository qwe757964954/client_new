import { _decorator, JsonAsset, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { ResponseData, VocabularyParentNode } from './GrammarInfo';
import { VocabularyItem } from './VocabularyItem';
const { ccclass, property } = _decorator;

@ccclass('GrammarVocabularyView')
export class GrammarVocabularyView extends BaseView {
    @property(List)
    public vocabulary_scrollView: List = null;//列表

    @property(Node)
    public top_layout: Node = null;

    private _select_id:number = 0;

    private _jsonAarr:string[] = ["grammar/grammar","grammar/grammar1","grammar/grammar2"];

    private _vocabularyData:ResponseData = null;
    async setSelectId(select_id:number){
        this._select_id = select_id;
        await this.loadRankData(this._select_id);
        this.vocabulary_scrollView.numItems = this._vocabularyData.Data.length;
    }

    initUI() {
        this.initNavTitle();
    }

    async loadRankData(select:number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ResLoader.instance.load(this._jsonAarr[select], JsonAsset, async (err: Error | null, jsonData: JsonAsset) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    this._vocabularyData = jsonData.json as ResponseData;
                    resolve();
                }
            });
        });
    }

    /**初始化导航栏 */
    initNavTitle(){
        this.createNavigation(`语法训练`,this.top_layout, () => {
            ViewsMgr.closeView(PrefabType.GrammarVocabularyView);
        });
    }
    onLoadVocabularyGrid(item:Node, idx:number){
        console.log("onLoadVocabularyGrid",item,idx);
        let item_sript:VocabularyItem = item.getComponent(VocabularyItem);
        let parentInfo:VocabularyParentNode = this._vocabularyData.Data[idx];
        item_sript.updatePropsItem(parentInfo);
    }

    onVocabularyGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        console.log("onVocabularyGridSelected",selectedId);
        this.hidenAllItem();
        let item_sript:VocabularyItem = item.getComponent(VocabularyItem);
        item_sript.showScrollView();
    }

    hidenAllItem(){
        for (let index = 0; index < this.vocabulary_scrollView.numItems; index++) {
            let item = this.vocabulary_scrollView.getItemByListId(index);
            let item_script = item.getComponent(VocabularyItem);
            item_script.hidenScrollView();
        }
    }
}


