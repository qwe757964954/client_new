import { _decorator, isValid, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { BaseView } from '../../script/BaseView';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { Dropdown } from '../collect/DropDown';
import { ActionItem } from './ActionItem';
import { PlayerActions } from './BagInfo';

const { ccclass, property } = _decorator;

@ccclass('ActionView')
export class ActionView extends BaseView {
    @property(List)
    public themeList: List = null;

    @property(Dropdown)
    public dropdown: Dropdown = null;

    protected initUI(): void {
        this.themeList.numItems = PlayerActions.length;
    }

    protected initEvent(): void {
        console.log("ActionView initEvent");
    }

    onLoadActionVertical(item: Node, idx: number) {
        const itemScript: ActionItem = item.getComponent(ActionItem);
        itemScript.updateProps(PlayerActions[idx])
        // Initialize item properties if necessary
    }

    onActionVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!isValid(selectedId) || selectedId < 0 || !isValid(item)) { return; }
        console.log("onThemeVerticalSelected", selectedId);
        EventMgr.dispatch(EventType.Bag_Player_Action_Event,PlayerActions[selectedId]);
    }
}
