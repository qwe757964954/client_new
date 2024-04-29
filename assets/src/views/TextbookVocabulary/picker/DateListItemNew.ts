import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DateListItemNew')
export class DateListItemNew extends Component {

    @property(Number)
    public index:Number = 0;

    @property(Label)
    public labNum:Label = null;

    private parentView:Node = null;

    onLoad() {
        
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    updateItem(index:number,itemData:any,obj:any){
        this.parentView = obj;
        if(itemData === undefined){
            this.node.active = false;
            return;
        }

        this.index = index;
        this.node.active = true;
        this.labNum.string = itemData;
        
    }
}


