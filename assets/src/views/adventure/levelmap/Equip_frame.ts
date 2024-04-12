import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Equip_frame')
export class Equip_frame extends Component {
    @property({ type: Node, tooltip: "是否显示" })
    public isShow: Node = null;
    @property({ type: Label, tooltip: "标题" })
    public titile: Label = null;
    @property({ type: Node, tooltip: "礼物图标" })
    public giftIcon: Node = null;
    @property({ type: Node, tooltip: "星星图标" })
    public starIcon: Node = null;
    @property({ type: [SpriteFrame], tooltip: "星星图标资源" })
    public starIconRes: SpriteFrame[] = [];
    @property({ type: Node, tooltip: "pass图标" })
    public passIcon: Node = null;

    start() {

    }

    update(deltaTime: number) {

    }
    /**设置标题 */
    settitle(name: string) {
        this.titile.string = name;
    }

    isshow(isShow: boolean = true) {
        this.isShow.active = isShow;
    }
    ispass(ispass: boolean = false) {
        this.passIcon.active = ispass;

    }
    /**设置礼物图标 */
    isshowgift(isShow: boolean = false) {
        this.giftIcon.active = isShow;
    }
    /**设置星星图标 */
    setstar(star: number | boolean = 0) {
        if (typeof (star) == "number") {
            this.starIcon.active = true;
            this.starIcon.getComponent(Sprite).spriteFrame = this.starIconRes[star];
        } else {
            this.starIcon.active = false;
        }
    }
}


