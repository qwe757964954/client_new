import { Label, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
import { SettingTabInfos } from './SettingInfo';
const { ccclass, property } = _decorator;

@ccclass('SettingTabItem')
export class SettingTabItem extends ListItem {
    @property(Label)
    public tab_name: Label = null;
    start() {

    }

    updatePropsItem(idx: number) {
        this.tab_name.string = SettingTabInfos[idx].title;
    }
}


