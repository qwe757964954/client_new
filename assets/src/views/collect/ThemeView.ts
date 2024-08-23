import { _decorator, isValid, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
import { Dropdown } from './DropDown';
import { ThemeItem } from './ThemeItem';

const { ccclass, property } = _decorator;

@ccclass('ThemeView')
export class ThemeView extends BaseView {
    @property(List)
    public themeList: List = null;

    @property(Dropdown)
    public dropdown: Dropdown = null;

    protected initUI(): void {
        this.offViewAdaptSize();
        this.themeList.numItems = 6;
    }

    protected initEvent(): void {
        console.log("ThemeView initEvent");
    }

    onLoadThemeVertical(item: Node, idx: number) {
        const itemScript: ThemeItem = item.getComponent(ThemeItem);
        // Initialize item properties if necessary
    }

    onThemeVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!isValid(selectedId) || selectedId < 0 || !isValid(item)) { return; }
        console.log("onThemeVerticalSelected", selectedId);
    }
}
