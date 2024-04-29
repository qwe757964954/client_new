import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { UnitListItemStatus } from '../../models/TextbookModel';
import List from '../../util/list/List';
import { UnitNumItem } from './UnitNumItem';
const { ccclass, property } = _decorator;

@ccclass('ChallengeBottomView')
export class ChallengeBottomView extends Component {
    @property(Label)
    public collect_num: Label = null;   // 收单元
    @property(Label)
    public collect_total: Label = null;   // 总单元

    @property(List)
    public collectScroll:List = null;
    @property(Node)
    public chest_box:Node = null;
    private _unitListArr:UnitListItemStatus[] = [];
    private _currentUnitIndex:number = 0;
    start() {

    }

    updateItemList(dataArr:UnitListItemStatus[],current_index:number){
        this._unitListArr = dataArr;
        this._currentUnitIndex = current_index;
        this.collectScroll.numItems = this._unitListArr.length;
        this.collectScroll.update();
        let isComplete = this._currentUnitIndex >= this._unitListArr.length - 1;/**当前收集的进度 */
        this.chest_box.getComponent(Sprite).grayscale = !isComplete;
        this.collect_num.string = (this._currentUnitIndex + 1).toString();
        this.collect_total.string = this._unitListArr.length.toString();
    }

    onLoadCollectHorizontal(item:Node, idx:number){
        console.log("onLoadCollectHorizontal", item,idx);
        let item_sript:UnitNumItem = item.getComponent(UnitNumItem);
        let unitStatus:UnitListItemStatus = this._unitListArr[idx];
        item_sript.updateRewardStatus(unitStatus.studywordnum >=unitStatus.totalwordnum);
    }
}


