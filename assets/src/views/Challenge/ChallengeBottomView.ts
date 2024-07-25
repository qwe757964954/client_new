import { _decorator, Component, error, Label, Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { ResLoader } from '../../manager/ResLoader';
import { CurrentBookStatus } from '../../models/TextbookModel';
import List from '../../util/list/List';
import { EducationDataInfos } from '../TextbookVocabulary/TextbookInfo';
import { UnitNumItem } from './UnitNumItem';
const { ccclass, property } = _decorator;

@ccclass('ChallengeBottomView')
export class ChallengeBottomView extends Component {
    @property(Label)
    public collect_num: Label = null;   // 收单元
    @property(Label)
    public collect_total: Label = null;   // 总单元

    @property(Label)
    public more_text: Label = null;

    @property(List)
    public collectScroll:List = null;
    @property(Node)
    public chest_box:Node = null;
    private _totalUnit:number = 0;
    private _currentUnitIndex:number = 0;
    start() {

    }

    updateItemList(data:CurrentBookStatus){
        this.loadRewardBox();
        this._totalUnit = data.gate_total_num;
        this._currentUnitIndex = data.gate_pass_num;
        this.collectScroll.numItems = data.gate_total_num;
        this.collectScroll.update();
        let isComplete = this._currentUnitIndex >= this._totalUnit;/**当前收集的进度 */
        this.chest_box.getComponent(Sprite).grayscale = !isComplete;
        this.collect_num.string = this._currentUnitIndex.toString();
        this.collect_total.string = this._totalUnit.toString();
        let scroll_width = this.collectScroll.scrollView.getComponent(UITransform).width;
        let content_width = this.collectScroll.scrollView.content.getComponent(UITransform).width;
        this.more_text.node.active = content_width > scroll_width;
    }

    loadRewardBox(){
        let key_str = EducationDataInfos[0].box;
        ResLoader.instance.load(key_str, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
            }
            this.chest_box.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }

    onLoadCollectHorizontal(item:Node, idx:number){
        let item_sript:UnitNumItem = item.getComponent(UnitNumItem);
        let unit_num = idx + 1;
        let isComplete:boolean = this._currentUnitIndex>=unit_num;
        item_sript.updateRewardStatus(isComplete);
        // let unitStatus:UnitItemStatus = this._unitListArr[idx];
        // item_sript.updateRewardStatus(unitStatus.studywordnum >=unitStatus.totalwordnum);
    }
}


