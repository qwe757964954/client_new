import { _decorator } from 'cc';
import { EventType } from '../../config/EventType';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
const { ccclass, property } = _decorator;

@ccclass('MainNotifyView')
export class MainNotifyView extends BaseView {
    protected initUI(): void {
        
    }
    protected initEvent(): void {
        CCUtil.onBtnClick(this.node,this.onClickNotice.bind(this));
    }
    onClickNotice(){
        console.log('onClickNotice');
        EventManager.emit(EventType.Notice_ShowNotice);
    }
}

