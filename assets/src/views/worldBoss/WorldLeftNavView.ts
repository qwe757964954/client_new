import { _decorator, Component, Node } from 'cc';
import List from '../../util/list/List';
import WordBossArray, { BossInfo } from './BossInfo';
import { WorldLeftItem } from './WorldLeftItem';
const { ccclass, property } = _decorator;

@ccclass('WorldLeftNavView')
export class WorldLeftNavView extends Component {
    @property(List)
    public letNavScroll:List = null;
    private _selectCallback:(idx:number) => void = null;
    start() {
        this.letNavScroll.numItems = WordBossArray.length;
    }

    setSelectClick(callback:(idx:number) => void) {
        this._selectCallback = callback;
    }
    onLoadBossVertical(item:Node, idx:number){
        let item_sript:WorldLeftItem = item.getComponent(WorldLeftItem);
        let info:BossInfo = WordBossArray[idx];
        item_sript.updatePropsItem(info,idx);
    }
    onBossVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number){
        console.log("onBossVerticalSelected",selectedId);
        if(this._selectCallback){
            this._selectCallback(selectedId);
        }
    }
}


