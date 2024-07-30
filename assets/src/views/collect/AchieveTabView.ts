import { _decorator, Component, isValid, Node } from 'cc';
import List from '../../util/list/List';
import { AchieveTabItem } from './AchieveTabItem';
import { MonsterCardTabInfo } from './CollectInfo';
const { ccclass, property } = _decorator;

@ccclass('AchieveTabView')
export class AchieveTabView extends Component {
    @property(List)
    public tab_list: List = null;
    private _tabDatas:MonsterCardTabInfo[] = [];
    

    updateData(data:MonsterCardTabInfo[]){
        this._tabDatas = data;
        this.tab_list.numItems = this._tabDatas.length;
        this.tab_list.selectedId = 0;
    }

    onLoadTabHorizontal(item:Node, idx:number){
        let item_sript:AchieveTabItem = item.getComponent(AchieveTabItem);
        let data = this._tabDatas[idx];
        item_sript.updateTabItem(data);
    }

    onTabListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
    }


}

