import { _decorator, Component, Node } from 'cc';
import List from '../../util/list/List';
import { RightNavItem, RightNavItemData } from './RightNavItem';
const { ccclass, property } = _decorator;

@ccclass('RightNavView')
export class RightNavView extends Component {
    @property(List)
    public navScroll: List = null;

    private _navDataArr :RightNavItemData[] = [];
    
    private callSelectCallback:(selectId:number)=>void = null;
    start() {

    }

    loadNavListData(data:RightNavItemData[],callBack:(selectId:number)=>void){
        this.callSelectCallback = callBack;
        this._navDataArr = data;
        this.navScroll.numItems = this._navDataArr.length;
        console.log("loadNavListData+++++++++++++++",data,this._navDataArr.length);
        this.navScroll.update();
    }

    onNavListVerticalRender(item:Node, idx:number){
        console.log("onNavListVerticalRender+++++++++++++++",idx);
        let navItemScript:RightNavItem = item.getComponent(RightNavItem);
        let itemInfo:RightNavItemData = this._navDataArr[idx];
        navItemScript.updateNavProps(idx,itemInfo);
    }
    //当列表项被选择...
    onNavListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item)
            return;
        // let list: List = item.getComponent(ListItem).list;
        // let str: string = '当前操作List为：' + list.node.name + '，当前选择的是：' + selectedId + '，上一次选择的是：' + lastSelectedId;
        // if (list.selectedMode == 2) { //如果是多选模式
        //     str += '，当前值为：' + val;
        // }
        // console.log(str);
    }
    onClickArrowBtn(){

    }

}


