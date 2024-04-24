import { _decorator, Button, Color, Component, isValid, Node } from 'cc';
import List from '../../util/list/List';
import { TabTopItem } from './TabTopItem';
const { ccclass, property } = _decorator;

export interface TabItemData{
    name:string,
    isSelected:boolean
}

@ccclass('TabTopView')
export class TabTopView extends Component {
    @property(List)
    public tabScroll:List = null;
    @property(Button)
    public myTextbookBtn:Button = null;
    private _dataArr:TabItemData[] = [];
    private callSelectCallback:(selectId:number)=>void = null;
    start() {

    }
    /**初始化数据 */
    loadTabData(data:TabItemData[],callBack:(selectId:number)=>void){
        this.callSelectCallback = callBack;
        this._dataArr = data;
        this.tabScroll.numItems = this._dataArr.length;
        this.tabScroll.update();
    }

    onTabListHorizontalRender(item:Node, idx:number){
        console.log("onTabListHorizontal_______________");
        let tabItemScript:TabTopItem = item.getComponent(TabTopItem);
        let itemInfo:TabItemData = this._dataArr[idx];
        tabItemScript.updateItemProps(idx,itemInfo);
    }
    onTabListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        this.clearTopItemColor();
        let tabItemScript:TabTopItem = item.getComponent(TabTopItem);
        tabItemScript.tab_name.color = tabItemScript.idx === selectedId ? Color.WHITE : Color.GREEN;
        if(this.callSelectCallback){
            this.callSelectCallback(selectedId);
        }
    }

    clearTopItemColor(){
        for (let index = 0; index < this.tabScroll.numItems; index++) {
            let item = this.tabScroll.getItemByListId(index);
            if(isValid(item)){
                let tabItemScript:TabTopItem = item.getComponent(TabTopItem);
                tabItemScript.tab_name.color = Color.GREEN;
            }
        }
    }

    /**点击我得词书 */
    onClickMyTextbook(){
        console.log("onClickMyTextbook_________________________");
        if(this.callSelectCallback){
            this.callSelectCallback(-1);
        }
    }
    /**点击往右箭头 */
    onClickRightArrowBotton(){
        console.log("onClickRightArrowBotton________________________");
        this.tabScroll.scrollTo(this._dataArr.length - 1);
    }
}