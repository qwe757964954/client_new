import { _decorator, Component, isValid, Node } from 'cc';
import List from '../../util/list/List';
import { FriendTabInfos } from './FriendInfo';
import { FriendTabItem } from './FriendTabItem';
const { ccclass, property } = _decorator;

@ccclass('FriendLeftTabView')
export class FriendLeftTabView extends Component {

    @property(List)
    public listView: List = null;//列表

    private _clickListener:(click:number) => void = null;

    protected start(): void {
        // this.updateTabList();
    }

    updateTabList(){
        this.listView.numItems = FriendTabInfos.length;
        this.listView.selectedId = 0;
    }

    public setTabClickListener(listener:(click:number) => void): void{
        this._clickListener = listener;
    }

    onLoadLeftTabVertical(item:Node, idx:number){
        let item_script = item.getComponent(FriendTabItem);
        item_script.updateTabItemProps(idx);
    }

    onTabLeftVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        this._clickListener?.(selectedId);
    }
}


