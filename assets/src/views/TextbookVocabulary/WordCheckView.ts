import { _decorator, error, instantiate, isValid, Node, Prefab, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { BookItemData, CheckOrderType, CheckWordModel, CheckWordResponse, CheckWordType, CurrentBookStatus } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import List from '../../util/list/List';
import { NavTitleView } from '../common/NavTitleView';
import { TabTopView } from './TabTopView';
const { ccclass, property } = _decorator;
/*
export interface BookItemData {
    name?:string,
    num?:number,
    sort_no?:number,
    type_name?:string
}
*/


@ccclass('WordCheckView')
export class WordCheckView extends BaseView {
    @property(Node)
    public top_layout:Node = null;          // 顶部导航栏
    @property(List)
    public wordCheckScrollView:List = null;
    private _bookData:CurrentBookStatus = null;
    private _tabTop:TabTopView = null;
    private _bookTabData:BookItemData[] = [];
    start() {
        this.initTabData();
        this.initUI();
    }

    initTabData(){
        let tabStrArr = ["全部单词","已学单词","未学单词","收藏单词"];
        for (let i = 0; i < tabStrArr.length; i++) {
            const element = tabStrArr[i];
            let data:BookItemData = {
                name:element,
            }
            this._bookTabData.push(data);
        }
    }

    async initUI(){
        this.initNavTitle();
        this._tabTop = await this.initTabContent();
        this._tabTop.loadTabData(this._bookTabData,(selectId:number)=>{
            let type:CheckWordType = (selectId+1) as CheckWordType;
            this.onRequestCheckWord(type, CheckOrderType.UnitSortOrder);
        });
        
    }

    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps("单词列表",()=>{
                ViewsManager.instance.closeView(PrefabType.WordCheckView);
                GlobalConfig.initRessolutionHeight();
            });
        });
    }
    /** 初始化模块事件 */
	protected onInitModuleEvent() {
		this.addModelListener(NetNotify.Classification_CheckWord,this.onCheckWord);
	}
    onCheckWord(data:CheckWordResponse) {
        console.log("WordCheckView......","onCheckWord......");
        console.log(data);
    }
    /**初始化tab选项 */
    initTabContent(): Promise<TabTopView>{
        return new Promise((resolve, reject) => {
            ResLoader.instance.load(`prefab/${PrefabType.TabTopView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
                if (err) {
                    error && console.error(err);
                    reject(err);
                    return;
                }
                let node = instantiate(prefab);
                this.node.addChild(node);
                let widgetCom = node.getComponent(Widget);
                if (!isValid(widgetCom)) {
                    widgetCom = node.addComponent(Widget);
                    widgetCom.isAlignTop = true;
                    widgetCom.isAlignHorizontalCenter = true;
                }
                widgetCom.top = 117.027;
                widgetCom.horizontalCenter = 0;
                widgetCom.updateAlignment();
                let tabScript = node.getComponent(TabTopView);
                resolve(tabScript);
            });
        })
        
    }

    onRequestCheckWord(word_type:CheckWordType,order_type:CheckOrderType){
        let params:CheckWordModel = {
            type_name:this._bookData.type_name,
            book_name:this._bookData.book_name,
            grade:this._bookData.grade,
            word_type:word_type,
            order_type:order_type,
        }
        TBServer.reqCheckWord(params);
    }

    initData(data:CurrentBookStatus){
        this._bookData = data;
    }
}


