import { Label, _decorator } from 'cc';
import ListItem from '../../util/list/ListItem';
import { MainActivityInfo } from './MainInfo';
const { ccclass, property } = _decorator;

@ccclass('RightActivityItem')
export class RightActivityItem extends ListItem {
    @property(Label)
    public activity_name: Label = null;
    start() {

    }

    updateActivityItem(data: MainActivityInfo){
        this.activity_name.string = data.title;
    }
    
}

