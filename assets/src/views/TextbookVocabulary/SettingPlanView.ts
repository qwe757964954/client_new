import { _decorator, Component, Label, Node } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import List from '../../util/list/List';
const { ccclass, property } = _decorator;

@ccclass('SettingPlanView')
export class SettingPlanView extends Component {
    @property(List)
    public leftScroll:List = null
    @property(List)
    public rightScroll:List = null

    private _opCallback:(isSave:boolean)=>void = null

    start() {
        this.leftScroll.numItems = 20;
        this.rightScroll.numItems = 7;
    }

    update(deltaTime: number) {
        
    }
    
    setOperationCallback(callback:(isSave:boolean)=>void){
        this._opCallback = callback;
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
        if(this._opCallback){
            this._opCallback(false);
        }
        ViewsManager.instance.closeView(PrefabType.SettingPlanView);
    }

    onClickSave(){
        console.log("onClickSave");
        if(this._opCallback){
          
            this._opCallback(true);
        }
    }
}


