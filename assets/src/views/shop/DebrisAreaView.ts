import { _decorator } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
const { ccclass, property } = _decorator;

@ccclass('DebrisAreaView')
export class DebrisAreaView extends BaseView {
    @property(List)
    public debris_area_list: List = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}

