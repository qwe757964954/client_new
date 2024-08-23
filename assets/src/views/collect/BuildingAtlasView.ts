import { _decorator, isValid, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { AchieveTabView } from './AchieveTabView';
import { BuildingAtlasItem } from './BuildingAtlasItem';
import { BuildingAtlasTabInfos } from './CollectInfo';
import { ThemeView } from './ThemeView';
const { ccclass, property } = _decorator;

@ccclass('BuildingAtlasView')
export class BuildingAtlasView extends BaseView {
    @property(List)
    public build_list: List = null;
    
    private _achieveTabView:AchieveTabView = null;
    private _themeView:ThemeView = null;
    protected async initUI() {
        this.offViewAdaptSize();
        this.build_list.numItems = 20;
        try {
            await this.initViews();
            this._achieveTabView.updateData(BuildingAtlasTabInfos);
            console.log("CollectView configuration loaded:", );
        } catch (err) {
            console.error("Failed to initialize UI:", err);
        }  
    }
    private async initViews() {
        await Promise.all([
            this.initViewComponent(PrefabType.AchieveTabView, (node) => this._achieveTabView = node.getComponent(AchieveTabView), {
                isAlignTop: true,
                isAlignLeft: true,
                top: 116.538,
                left: 719.241
            }),
            this.initViewComponent(PrefabType.AchieveThemeView, (node) => this._themeView = node.getComponent(ThemeView), {
                isAlignTop: true,
                isAlignLeft: true,
                top: 137.37,
                left: 462.384
            })
        ]);
    }
    onLoadBuildingAtlasGrid(item:Node, idx:number){
        let item_sript:BuildingAtlasItem = item.getComponent(BuildingAtlasItem);
        // let data = this._weekTask[idx];
        // item_sript.initPropsItem(data);
    }

    onBuildingAtlasListGridSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTaskListHorizontalSelected",selectedId);
    }

    

}

