import { _decorator, Button, color, Component, isValid, Node } from 'cc';
import { BookItemData } from '../../models/TextbookModel';
import List from '../../util/list/List';
import { TabTopItem } from './TabTopItem';
const { ccclass, property } = _decorator;
@ccclass('TabTopView')
export class TabTopView extends Component {
    @property(List)
    public tabScroll:List = null;
    @property(Button)
    public myTextbookBtn:Button = null;
    private _dataArr:BookItemData[] = [];
    private callSelectCallback:(selectId:number)=>void = null;
    start() {

    }
    /**初始化数据 */
    loadTabData(data:BookItemData[],callBack:(selectId:number)=>void){
        this.callSelectCallback = callBack;
        this._dataArr = data;
        this.tabScroll.numItems = this._dataArr.length;
        this.tabScroll.update();
        this.tabScroll.selectedId = 0;
    }

    onTabListHorizontalRender(item:Node, idx:number){
        let tabItemScript:TabTopItem = item.getComponent(TabTopItem);
        let itemInfo:BookItemData = this._dataArr[idx];
        tabItemScript.updateItemProps(idx,itemInfo);
    }
    onTabListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        this.clearTopItemColor();
        let tabItemScript:TabTopItem = item.getComponent(TabTopItem);
        tabItemScript.tab_name.color = tabItemScript.idx === selectedId ? color("#f9b600") : color("#DFC49F");
        if(this.callSelectCallback){
            this.callSelectCallback(selectedId);
        }
    }

    clearTopItemColor(){
        for (let index = 0; index < this.tabScroll.numItems; index++) {
            let item = this.tabScroll.getItemByListId(index);
            if(isValid(item)){
                let tabItemScript:TabTopItem = item.getComponent(TabTopItem);
                tabItemScript.tab_name.color = color("#DFC49F");
            }
        }
    }

    /**点击我得词书 */
    onClickMyTextbook(){
        if(this.callSelectCallback){
            this.callSelectCallback(-1);
        }
    }
    /**点击往右箭头 */
    onClickRightArrowBotton(){
        this.tabScroll.scrollTo(this._dataArr.length - 1);
    }
}