import { _decorator, Component, isValid, Label, Node, Sprite } from 'cc';
import { EventType } from '../../../config/EventType';
import { ViewsMgr } from '../../../manager/ViewsManager';
import { GateData, MapLevelData } from '../../../models/AdventureModel';
import CCUtil from '../../../util/CCUtil';
import { EventMgr } from '../../../util/EventManager';

const { ccclass, property } = _decorator;

const StarEnglish = ["one", "two", "three"];

@ccclass('BaseMapPointItem')
export class BaseMapPointItem extends Component {
    @property({ type: [Node], tooltip: "星星" })
    public stars: Node[] = [];
    
    @property({ type: Node, tooltip: "底盘" })
    public bgNode: Node = null;
    
    @property({ type: Label, tooltip: "关卡Label" })
    public levelLabel: Label = null;

    public data: GateData | MapLevelData  = null;

    protected initStars(flagInfo: any) {
        this.clearPointStars();
        if (isValid(flagInfo)) {
            for (let i = 0; i < 3; i++) {
                if (isValid(flagInfo[`star_${StarEnglish[i]}`])) {
                    this.stars[i].getComponent(Sprite).grayscale = false;
                } else {
                    this.stars[i].getComponent(Sprite).grayscale = true;
                }
            }
        }
    }

    protected clearPointStars() {
        this.stars.forEach(star => {
            star.getComponent(Sprite).grayscale = true;
        });
    }
    
    start() {
        this.initEvent();
    }

    protected initEvent() {
        CCUtil.onBtnClick(this.bgNode, this.onItemClick.bind(this), true);
    }

    protected onItemClick() {
        console.log("onItemClick called with data:", this.data);
        if (!isValid(this.data)) {
            console.warn("No data available for onItemClick");
            return;
        }
        let gData = this.data as GateData;
        if (isValid(gData.can_play) && !gData.can_play) {
            ViewsMgr.showTip("请先通过前置关卡");
            return;
        }

        EventMgr.emit(EventType.MapPoint_Click, this.data);
        // To be overridden by subclasses
    }
}
