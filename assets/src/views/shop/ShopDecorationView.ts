import { _decorator } from 'cc';
import { BaseView } from '../../script/BaseView';
import List from '../../util/list/List';
const { ccclass, property } = _decorator;

@ccclass('ShopDecorationView')
export class ShopDecorationView extends BaseView {
    @property(List)
    public decoration_list: List = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}

