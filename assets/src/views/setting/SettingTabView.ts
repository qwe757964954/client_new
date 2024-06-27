import { _decorator, Color, Component, isValid, Node } from 'cc';
import List from '../../util/list/List';
import { SettingTabInfos } from './SettingInfo';
import { SettingTabItem } from './SettingTabItem';
const { ccclass, property } = _decorator;

@ccclass('SettingTabView')
export class SettingTabView extends Component {
    @property(List)
    public settingList: List = null;
    private _clickListener:(selectId:number)=>void = null;
    start() {

    }

    updateTabDatas(){
        this.settingList.numItems = SettingTabInfos.length;
        this.settingList.update();
        this.settingList.selectedId = 0;
    }

    setTabClickListener(listener:(selectId:number)=>void){
        this._clickListener = listener;
    }

    onLoadTabHorizontal(item:Node, idx:number){
        let item_sript:SettingTabItem = item.getComponent(SettingTabItem);
        item_sript.updatePropsItem(idx);
    }

    onTabListHorizontalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        this.clearAllTabColor();
        let sel_item = item.getComponent(SettingTabItem);
        sel_item.tab_name.color = new Color(255, 255, 255, 255);
        this._clickListener?.(selectedId);
    }
    clearAllTabColor(){
        for (let index = 0; index < this.settingList.numItems; index++) {
            const item = this.settingList.getItemByListId(index);
            let item_script:SettingTabItem = item.getComponent(SettingTabItem);
            item_script.tab_name.color = new Color(83, 191, 34, 255);
        }
    }
}


