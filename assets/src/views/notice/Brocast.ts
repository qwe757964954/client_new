import { _decorator, Component, Label, Node, tween, Tween, UITransform, v3, Widget } from 'cc';
import { EventType } from '../../config/EventType';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { LabelUtils } from '../../util/LabelUtils';
import { ToolUtil } from '../../util/ToolUtil';
const { ccclass, property } = _decorator;
/**公告内容 */
export interface NoticeContentData {
    id: string;
    content: string;
}

@ccclass('Brocast')
export class Brocast extends Component {
    @property({ type: Node, tooltip: "内容节点" }) //内容结点
    contentNd: Node;

    @property
    speed: number = 100;

    // @property
    // bPlayLoop: boolean = false; //播放完是否再重新循环播放

    contentLen: number = 0;

    lblContent: Label = null; //内容
    icon: Node = null;

    bShowNew: boolean = false; //播放完是否再重新播放

    strContent: string = '';

    contentList: Array<string> = []; //广播内容
    curIdx: number = 0; //当前显示的跑马灯条目

    tweenAnim: Tween<Node> = null;

    onLoad() {
        this.curIdx = 0;
        this.lblContent = this.contentNd.getChildByName("txtContent").getComponent(Label);
        let maskNd: Node = this.contentNd.parent;
        let width = maskNd.getComponent(UITransform).width;
        this.contentNd.setPosition(v3(width / 2 + 5, 0, 0));

        this.initEvent();
    }

    initEvent() {
        CCUtil.onTouch(this.node, this.onClickNotice, this);
    }

    removeEvent() {
        CCUtil.offTouch(this.node, this.onClickNotice, this);
    }

    start() {

    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    onClickNotice() {
        EventManager.emit(EventType.Notice_ShowNotice);
    }

    setContent(content: Array<string>) {
        //测试
        //content = ["嘻嘻哈哈",'双喜临门'];
        if (content.length === 0) {
            return;
        }
        this.bShowNew = true;
        this.curIdx = 0;
        this.contentList = content;
        /* let strContent:string = "";
         for(let i = 0; i< content.length; i++) {
             strContent = strContent + content[i] + "                                      ";
         }
         strContent = strContent.trim(); //去掉尾部空格
 
         this.strContent = strContent;
 
         this.bShowNew = true;*/

        //this.lblContent = this.contentNd.getComponent(Label);
        //this.lblContent.string = strContent;

    }

    /**播放跑马灯 */
    playBroadCast() {
        if (!this.contentNd) {
            console.log("this.contentNd is null");
            return;
        }
        if (!this.lblContent) {
            this.lblContent = this.contentNd.getChildByName("txtContent").getComponent(Label);
            if (!this.lblContent) {
                console.log("can't get this.lblContent");
                return;
            }
        }

        let widget = this.lblContent.getComponent(Widget);
        let maskNd: Node = this.contentNd.parent;
        let width = maskNd.getComponent(UITransform).width;
        if (this.curIdx >= this.contentList.length) {
            this.curIdx = 0;
        }
        let curText: string = this.contentList[this.curIdx];
        if (!curText || curText === "") {
            console.log("current broadcastMgr is null");
            curText = "Welcome";
        }
        this.lblContent.string = curText;
        // 获取字符串宽度
        let contentWidth: number = LabelUtils.measureSize(this.lblContent.string, 20, 40);
        let iconWidth: number = this.contentNd.getComponent(UITransform).width;
        contentWidth = contentWidth + iconWidth; //内容宽度 = 文字长度 + 图标宽度
        let totalLen: number = width + contentWidth;
        let flyTime: number = totalLen / this.speed; //跑马灯飞行时间
        ToolUtil.toggleOpacity(this.node, 0.5, 255).call(() => {
            this.tweenAnim = tween(this.contentNd)
                .to(flyTime, { position: v3(-width / 2 - contentWidth, 0, 0) })
                .to(0, { position: v3(width / 2 + 5, 0, 0) })
                .call(() => {
                    if (this.bShowNew) {
                        this.curIdx = 0;
                        this.tweenAnim.stop();
                        this.bShowNew = false;
                        this.showNewBroadcast();
                    }
                    else {
                        this.curIdx++;
                        if (this.curIdx >= this.contentList.length) {
                            this.curIdx = 0;
                        }
                        this.tweenAnim.stop();
                        ToolUtil.toggleOpacity(this.node, 0.5, 0).call(() => {
                            this.node.destroy();
                        }).start();
                    }
                })
                //.union()
                //.repeatForever().start();
                .start();
        }).start();
    }

    private showNewBroadcast() {
        let maskNd: Node = this.contentNd.parent;
        let width = maskNd.getComponent(UITransform).width;
        this.contentNd.setPosition(v3(width / 2 + 5, 0, 0));
        //this.lblContent = this.contentNd.getComponent(Label); //重新设置文字
        if (this.curIdx >= this.contentList.length) {
            this.curIdx = 0;
        }
        let curText: string = this.contentList[this.curIdx];
        if (!curText || curText === "") {
            console.log("current broadcastMgr is null");
            curText = "Welcome";
        }
        this.lblContent.string = curText;
        //this.lblContent.string = this.strContent;
        let contentWidth: number = LabelUtils.measureSize(this.lblContent.string, 20, 40);
        let iconWidth: number = this.contentNd.getComponent(UITransform).width;
        contentWidth = contentWidth + iconWidth; //内容宽度 = 文字长度 + 图标宽度
        let totalLen: number = width + contentWidth;
        //let speed:number = 100;
        let flyTime = totalLen / this.speed;
        this.tweenAnim = tween(this.contentNd)
            .to(flyTime, { position: v3(-width / 2 - contentWidth, 0, 0) })
            .to(0, { position: v3(width / 2 + 5, 0, 0) })
            .call(() => {
                if (this.bShowNew) {
                    this.curIdx = 0;
                    this.tweenAnim.stop();
                    this.bShowNew = false;
                    this.showNewBroadcast();
                }
                else {
                    this.curIdx++;
                    if (this.curIdx >= this.contentList.length) {
                        this.curIdx = 0;
                    }
                    this.tweenAnim.stop();
                    //this.showNewBroadcast();
                    ToolUtil.toggleOpacity(this.node, 0.5, 0).call(() => {
                        this.node.destroy();
                    }).start();
                }
            })
            //.union()
            //.repeatForever()
            .start();
    }

    update(deltaTime: number) {

    }
}


