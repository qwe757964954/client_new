import { _decorator, Color, Component, EventTouch, Label, Node, Sprite, SpriteFrame, UIOpacity } from 'cc';
import ListItem from '../../util/list/ListItem';
import { StudyRecordDateData } from './StudyRecordView';
import CCUtil from '../../util/CCUtil';
import EventManager, { EventMgr } from '../../util/EventManager';
import { EventType } from '../../config/EventType';
const { ccclass, property } = _decorator;

@ccclass('ReviewDateItem')
export class ReviewDateItem extends ListItem {
    @property({ type: Sprite, tooltip: "背景" }) //
    public bg: Sprite = null;

    @property({ type: Node, tooltip: "星星底" }) //
    public starSp: Node = null;

    @property({ type: Label, tooltip: "日期" }) //
    public dateTxt: Label = null;

    @property({ type: [SpriteFrame], tooltip: "图片按钮两个状态帧,0是高亮，1是非选中" })
    public dateBgSprAry: SpriteFrame[] = [];

    @property({ type: [SpriteFrame], tooltip: "星星图片按钮两个状态帧,0是高亮，1是非选中" })
    public starSprAry: SpriteFrame[] = [];

    private idx: number = 0;
    public studyRecordDate: StudyRecordDateData = null;
    //private delCallback:(idx:number,bookStatus:MyTextbookStatus) => void = null;

    /**更新UI */
    updateMyContentItemProps(idx: number, itemInfo: StudyRecordDateData) {
        this.idx = idx;
        this.studyRecordDate = itemInfo;
        if (itemInfo.date != -1) {
            let now = new Date();
            let isToday = itemInfo.date == now.getDate() && itemInfo.month == now.getMonth() && itemInfo.year == now.getFullYear();
            this.bg.spriteFrame = isToday ? this.dateBgSprAry[0] : this.dateBgSprAry[1];
            //this.bg.node.active = isToday;
            this.starSp.active = false;

            this.dateTxt.color = isToday ? new Color("#ffffff") : new Color("#363636");
            this.dateTxt.string = itemInfo.date.toString();
            this.node.active = true;
            let itemDate = new Date(itemInfo.year, itemInfo.month, itemInfo.date);
            if (itemDate.getTime() < now.getTime()) {
                this.node.getComponent(UIOpacity).opacity = 255;
                //this.on(Laya.Event.CLICK, this, this.onItemClick);
                CCUtil.onTouch(this.node, this.onItemClick, this);
            }
            else {
                this.node.getComponent(UIOpacity).opacity = 155;
                CCUtil.offTouch(this.node, this.onItemClick, this);
            }
        }
        else {
            //this.node.active = false;
            this.node.getComponent(UIOpacity).opacity = 0;
        }
    }

    /**设置星星 */
    setScoreUI(score: number) {
        this.starSp.active = true;
        for (let i = 1; i <= 3; i++) {
            this.starSp.getChildByName("star" + i).getComponent(Sprite).spriteFrame = this.starSprAry[1];
        }
        for (let n = 1; n < 4; n++) {
            this.starSp.getChildByName("star" + n).getComponent(Sprite).spriteFrame =
                (n <= score) ? this.starSprAry[0] : this.starSprAry[1];
        }
    }



    onItemClick(e: EventTouch) {
        EventManager.emit(EventType.StudyRecord_ClickDateRecord, this.studyRecordDate);
    }

    init() {

    }

    start() {

    }

    update(deltaTime: number) {

    }
}


