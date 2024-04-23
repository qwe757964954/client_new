import { _decorator, Button, Component, Node } from 'cc';
import List from '../../util/list/List';
import { TabTopItem } from './TabTopItem';
const { ccclass, property } = _decorator;

export interface TabItemData{
    name:string,
    isSelected:boolean
}

@ccclass('TabContentView')
export class TabContentView extends Component {
    @property(List)
    public tabScroll:List = null;
    @property(Button)
    public tabBtn:Button = null;
    
    private _dataArr:TabItemData[] = [];

    start() {

    }
    /**初始化数据 */
    loadTabData(data:TabItemData[]){
        this._dataArr = data;
        this.tabScroll.numItems = this._dataArr.length;
        this.tabScroll.update();
    }

    onTabListHorizontal(item:Node, idx:number){
        console.log("onTabListHorizontal_______________");
        let tabItemScript:TabTopItem = item.getComponent(TabTopItem);
        let itemInfo:TabItemData = this._dataArr[idx];
        tabItemScript.updateItemProps(idx,itemInfo);
    }
    update(deltaTime: number) {
        
    }
}