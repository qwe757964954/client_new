import { _decorator, color, Component, isValid, Node } from 'cc';
import { BookListItemData } from '../../models/TextbookModel';
import List from '../../util/list/List';
import { RightNavItem } from './RightNavItem';
const { ccclass, property } = _decorator;

@ccclass('RightNavView')
export class RightNavView extends Component {
    @property(List)
    public navScroll: List = null;

    private _navDataArr :BookListItemData[] = [];
    
    private callSelectCallback:(selectId:number)=>void = null;


    start() {
        console.log("RightNavView  start");
    }

    protected onLoad(): void {
        console.log("RightNavView  onLoad");
        
    }

    loadNavListData(data:BookListItemData[],callBack:(selectId:number)=>void){
        console.log("loadNavListData",data);
        this.callSelectCallback = callBack;
        this._navDataArr = data;
        this.navScroll.numItems = this._navDataArr.length;
        this.navScroll.update();
        this.navScroll.selectedId = 0;
        if(this.callSelectCallback){
            this.callSelectCallback(0);
        }
    }

    onNavListVerticalRender(item:Node, idx:number){
        let navItemScript:RightNavItem = item.getComponent(RightNavItem);
        let itemInfo:BookListItemData = this._navDataArr[idx];
        navItemScript.updateNavProps(idx,itemInfo);
    }
    //当列表项被选择...
    onNavListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        console.log("onNavListSelected",selectedId);
        if (!item)
            return;
        this.clearTopItemColor();
        let navItemScript:RightNavItem = item.getComponent(RightNavItem);
        navItemScript.itemName.color = navItemScript.idx === selectedId ? color("#ffffff"): color("#dfc49f");
        if(this.callSelectCallback){
            this.callSelectCallback(selectedId);
        }
    }
    clearTopItemColor(){
        for (let index = 0; index < this.navScroll.numItems; index++) {
            let item = this.navScroll.getItemByListId(index);
            if(isValid(item)){
                let navItemScript:RightNavItem = item.getComponent(RightNavItem);
                navItemScript.itemName.color = color("#dfc49f");
            }
        }
    }
    onClickArrowBtn(){
        console.log("onClickArrowBtn");
        this.navScroll.scrollTo(this._navDataArr.length - 1);
    }

}


