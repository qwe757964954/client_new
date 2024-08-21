import { _decorator, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { GrammarTipItem } from './GrammarTipItem';
import { GrammarTrainingItem } from './GrammarTrainingItem';
import { GrammarVocabularyView } from './GrammarVocabularyView';
const { ccclass, property } = _decorator;

export interface TipItemInfo {
    tip: string;
    bg:string;
    lamp:string;
}


@ccclass('GrammarTrainingView')
export class GrammarTrainingView extends BaseView {
    @property(Node)
    public top_layout:Node = null;
    @property(Node)
    public content_layout:Node = null;

    @property(List)
    public tab_scrollView:List = null;

    @property(List)
    public tip_scrollView:List = null;

    private _tipData:TipItemInfo[] = [
        {
            tip:"快去开启挑战吧！",
            bg:"grammar/no_start_bg/spriteFrame",
            lamp:"grammar/lamp1/spriteFrame"
        },
        {
            tip:"共5道题，正确率80%，奖励为100金币",
            bg:"grammar/medium_bg/spriteFrame",
            lamp:"grammar/lamp2/spriteFrame"
        },
        {
            tip:"共8道题，正确率80%，奖励为300金币",
            bg:"grammar/outstanding_bg/spriteFrame",
            lamp:"grammar/lamp3/spriteFrame"
        },
        {
            tip:"共10道题，正确率90%，奖励为500金币，20钻石",
            bg:"grammar/excellence_bg/spriteFrame",
            lamp:"grammar/lamp4/spriteFrame"
        },
    ]

    private _tabData:string[] = ["grammar/item_bg1/spriteFrame",
    "grammar/item_bg2/spriteFrame",
    "grammar/item_bg3/spriteFrame"]
    initUI() {
        this.initNavTitle();
        this.initAmout();
        this.tab_scrollView.numItems = this._tabData.length;
        this.tip_scrollView.numItems = this._tipData.length;
    }

    /**初始化导航栏 */
    initNavTitle(){
        this.createNavigation(`语法训练`,this.top_layout, () => {
            ViewsMgr.closeView(PrefabType.GrammarTrainingView);
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmount(this.top_layout,11.314,160.722);
    }

    onLoadTabHorizontal(item:Node, idx:number){
        console.log("onLoadTabHorizontal",idx);
        let item_sript:GrammarTrainingItem = item.getComponent(GrammarTrainingItem);
        item_sript.updatePropsItem(this._tabData[idx]);
    }

    onLoadTipGrid(item:Node, idx:number){
        console.log("onLoadTipGrid",idx);
        let item_sript:GrammarTipItem = item.getComponent(GrammarTipItem);
        let tipInfo:TipItemInfo = this._tipData[idx];
        item_sript.updatePropsItem(tipInfo);
    }

    onTipGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        console.log("onTipGridSelected",selectedId);
        ViewsMgr.showView(PrefabType.GrammarVocabularyView,(node: Node)=>{
            let vocabulary_script:GrammarVocabularyView = node.getComponent(GrammarVocabularyView);
            vocabulary_script.setSelectId(selectedId);
        });

    }
}


