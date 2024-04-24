import { _decorator, Component, isValid, Node } from 'cc';
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
        console.log("RightNavView  start");
    }

    protected onLoad(): void {
        console.log("RightNavView  onLoad");
        this.navScroll.numItems = this._navDataArr.length;
        this.navScroll.update();
        this.navScroll.selectedId = 0;
    }

    loadNavListData(data:RightNavItemData[],callBack:(selectId:number)=>void){
        this.callSelectCallback = callBack;
        this._navDataArr = data;
    }

    onNavListVerticalRender(item:Node, idx:number){
        let navItemScript:RightNavItem = item.getComponent(RightNavItem);
        let itemInfo:RightNavItemData = this._navDataArr[idx];
        navItemScript.updateNavProps(idx,itemInfo);
    }
    //当列表项被选择...
    onNavListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item)
            return;
        this.clearTopItemColor();
        let navItemScript:RightNavItem = item.getComponent(RightNavItem);
        navItemScript.itembg.active = navItemScript.idx !== selectedId;
        navItemScript.itemSelect.active = navItemScript.idx === selectedId;
        if(this.callSelectCallback){
            this.callSelectCallback(selectedId);
        }
    }
    clearTopItemColor(){
        for (let index = 0; index < this.navScroll.numItems; index++) {
            let item = this.navScroll.getItemByListId(index);
            if(isValid(item)){
                let navItemScript:RightNavItem = item.getComponent(RightNavItem);
                navItemScript.itembg.active = true;
                navItemScript.itemSelect.active = false;
            }
        }
    }
    onClickArrowBtn(){

    }

}


