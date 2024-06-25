import { _decorator, Component, isValid, Node } from 'cc';
import { EmailDataInfo } from '../../models/FriendModel';
import List from '../../util/list/List';
import { EmailListItem } from './EmailListItem';
const { ccclass, property } = _decorator;

@ccclass('FriendEmailView')
export class FriendEmailView extends Component {

    @property(List)
    public emailList:List = null;

    private _emailDataList:EmailDataInfo[] = [];

    updateData(data:EmailDataInfo[]){
        this._emailDataList = data;
        this.emailList.numItems = this._emailDataList.length;

    }
    onLoadEmailVertical(item:Node, idx:number){
        let item_script = item.getComponent(EmailListItem);
        let emailData: EmailDataInfo = this._emailDataList[idx];
        item_script.initData(emailData);
    }

    onEmailVerticalSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if(!isValid(selectedId) || selectedId < 0 || !isValid(item)){return;}
        console.log("onTabLeftVerticalSelected",selectedId);
        // this._clickListener?.(selectedId);
    }
}
