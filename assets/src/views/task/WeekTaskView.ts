import { _decorator, Node } from 'cc';
import { BaseView } from '../../script/BaseView';
const { ccclass, property } = _decorator;

@ccclass('WeekTaskView')
export class WeekTaskView extends BaseView {
    @property(Node)
    public top_layout:Node = null;
    @property(Node)
    public content_layout:Node = null;
    initEvent(){
        
    }
    removeEvent(){
        
    }
}


