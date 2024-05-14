import { _decorator, Component, Label, macro, Node, tween, Tween, UITransform, v3 } from 'cc';
import { LabelUtils } from '../../util/LabelUtils';
import EventManager from '../../util/EventManager';
import { EventType } from '../../config/EventType';
import { ViewsManager } from '../../manager/ViewsManager';
import { PrefabType } from '../../config/PrefabType';
import { NoticeDialogView } from './NoticeDialogView';
import { NoticeContentData } from './Brocast';
const { ccclass, property } = _decorator;

@ccclass('LabelBrocast')
export class LabelBrocast extends Component {
    @property({ type: Node, tooltip: "Mask结点" }) //内容结点
    maskNd: Node = null;
    @property({ type: Label, tooltip: "文本内容节点" }) //内容结点
    lblContent: Label = null;

    @property  //滚动速度
    speed: number = 100;

    @property({ tooltip: "每隔10秒再滚动一次" })
    total_time: number = 10; //每隔60秒

    walk_time: number = 0;

    tweenAnim: Tween<Node> = null;

    bStart: boolean = false; //是否启用跑马灯

    private _showNoticeEveId: string = ""; //显示公告事件

    initEvent() {
        this._showNoticeEveId = EventManager.on(EventType.Notice_ShowNotice, this.onShowNotice.bind(this));
    }

    removeEvent() {
        EventManager.off(EventType.Notice_ShowNotice, this._showNoticeEveId);
    }

    onShowNotice(data: NoticeContentData) {
        ViewsManager.instance.showView(PrefabType.NoticeDialogView, (node: Node) => {
            node.getComponent(NoticeDialogView).init(data.content);
            this.stopAuto();
        });
    }

    setContent(content: string) {
        this.lblContent.string = content;
    }

    //重启自动开始
    resetAuto() {
        this.bStart = true;

        this.walk_time = 0;

        //this.playBroadCast();
    }

    stopAuto() {
        this.bStart = false;
        this.walk_time = 0;
    }

    /**播放跑马灯 */
    playBroadCast() {
        if (!this.bStart) {
            return;
        }
        Tween.stopAllByTarget(this.lblContent.node);
        this.lblContent.node.setPosition(0, 0, 0);

        let maskWidth: number = this.maskNd.getComponent(UITransform).width;
        // 获取字符串宽度
        let contentWidth: number = LabelUtils.measureSize(this.lblContent.string, 24, 40);
        let totalLen: number = maskWidth// + contentWidth;
        let flyTimeLeft = contentWidth / this.speed;
        let flyTime: number = totalLen / this.speed; //跑马灯飞行时间
        this.tweenAnim = tween(this.lblContent.node)
            .to(flyTimeLeft, { position: v3(-contentWidth, 0, 0) })
            .call(() => {
                this.lblContent.node.setPosition(v3(maskWidth, 0, 0));
            })
            .to(flyTime, { position: v3(0, 0, 0) })
            .union()
            .repeat(2)
            .start();
    }

    protected onLoad(): void {
        this.initEvent();
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    start() {
        this.schedule(() => {
            this.bStart = true;
            this.walk_time = this.total_time;
            this.playBroadCast();
        }, this.total_time, macro.REPEAT_FOREVER, 2);
    }

    update(dt: number) {
        /* if (!this.bStart) {
             return;
         }
         this.walk_time += dt;
         if (this.walk_time >= this.total_time) {
 
         }*/
    }
}


