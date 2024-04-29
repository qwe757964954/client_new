import { _decorator, Component, Label, Node } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
const { ccclass, property } = _decorator;

@ccclass('SettingPlanView')
export class SettingPlanView extends Component {
    @property(List)
    public leftScroll:List = null
    @property(List)
    public rightScroll:List = null

    start() {
        this.leftScroll.numItems = 20;
        this.rightScroll.numItems = 7;
    }
    onLoadLeftVerticalList(item:Node, idx:number){
        console.log("onLoadLeftVerticalList",item,idx);
        let label = item.getComponent(Label);
        let indexNum = idx + 1;
        let bookImgUrl = `${indexNum}`;
        label.string = bookImgUrl;
    }   

    onLoadRightVerticalList(item:Node, idx:number){
        console.log("onLoadRightVerticalList",item,idx);
        let label = item.getComponent(Label);
        let indexNum = idx + 1;
        let bookImgUrl = `${indexNum}`;
        label.string = bookImgUrl;
    }
    onClickCancel(){
        console.log("onClickCancel");
        ViewsManager.instance.closeView(PrefabType.SettingPlanView);
        EventMgr.dispatch(EventType.Select_Word_Plan,{isSave:false});
    }

    onClickSave(){
        console.log("onClickSave");
        ViewsManager.instance.closeView(PrefabType.SettingPlanView);
        EventMgr.dispatch(EventType.Select_Word_Plan,{isSave:true});
    }
}


