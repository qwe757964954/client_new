import { _decorator, Label, macro, Node, tween, Tween, UITransform, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import { ViewsManager } from '../../manager/ViewsManager';
import { AnnouncementDataResponse, AnnouncementItem } from '../../models/AnnouncementModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { ATServer } from '../../service/AnnouncementService';
import { LabelUtils } from '../../util/LabelUtils';
import { NoticeContentData } from './Brocast';

const { ccclass, property } = _decorator;

@ccclass('LabelBrocast')
export class LabelBrocast extends BaseView {
    @property({ type: Node, tooltip: "Mask结点" })
    maskNd: Node = null;

    @property({ type: Label, tooltip: "文本内容节点" })
    lblContent: Label = null;

    @property
    speed: number = 100;

    @property({ tooltip: "每隔10秒再滚动一次" })
    total_time: number = 10;

    walk_time: number = 0;
    tweenAnim: Tween<Node> = null;
    bStart: boolean = false;
    private _announcement_index: number = 0;
    private _announcement_list: AnnouncementItem[] = [];

    protected initUI(): void {
        ATServer.reqAnnouncement();
        this.schedule(() => {
            if (this._announcement_list.length > 0) {
                this.bStart = true;
                this.walk_time = this.total_time;
                this.playBroadCast();
            }
        }, this.total_time, macro.REPEAT_FOREVER, 2);
    }

    onInitModuleEvent() {
        this.addModelListeners([
            [EventType.Notice_ShowNotice, this.onShowNotice],
            [NetNotify.Classification_Announcement, this.onAnnouncement],
        ]);
    }

    onAnnouncement(response: AnnouncementDataResponse) {
        this._announcement_list = response.announcement_list.filter(item => this.isAnnouncementActive(item));
        console.log('onAnnouncement', response);
        if (this._announcement_list.length > 0) {
            this._announcement_index = 0;
            this.playBroadCast();
        }
    }

    async onShowNotice(data: NoticeContentData) {
        await ViewsManager.instance.showPopup(PrefabType.NoticeDialogView);
    }

    setContent(content: string) {
        this.lblContent.string = content;
    }

    resetAuto() {
        this.bStart = true;
        this.walk_time = 0;
    }

    stopAuto() {
        this.bStart = false;
        this.walk_time = 0;
    }

    /**播放跑马灯 */
    playBroadCast() {
        if (!this.bStart || this._announcement_list.length === 0) {
            return;
        }

        const announcement = this._announcement_list[this._announcement_index];
        this.setContent(announcement.title + ": " + announcement.content);

        Tween.stopAllByTarget(this.lblContent.node);
        this.lblContent.node.setPosition(v3(this.maskNd.getComponent(UITransform).width, 0, 0));

        const maskWidth: number = this.maskNd.getComponent(UITransform).width;
        const contentWidth: number = LabelUtils.measureSize(this.lblContent.string, this.lblContent.fontSize, this.lblContent.lineHeight);
        const totalLen: number = maskWidth + contentWidth;
        const flyTime: number = totalLen / this.speed;

        this.tweenAnim = tween(this.lblContent.node)
            .to(flyTime, { position: v3(-contentWidth, 0, 0) })
            .call(() => {
                this._announcement_index = (this._announcement_index + 1) % this._announcement_list.length;
                this.playBroadCast();
            })
            .start();
    }

    private isAnnouncementActive(announcement: AnnouncementItem): boolean {
        const now = new Date();
        const startTime = new Date(announcement.start_time);
        const endTime = new Date(announcement.end_time);
        return now >= startTime && now <= endTime && announcement.is_active;
    }
}
