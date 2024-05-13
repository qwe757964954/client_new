import { _decorator, Color, Component, EventTouch, Label, Node } from 'cc';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
const { ccclass, property } = _decorator;

/**卡的简单信息 */
export interface CardSimpleInfo {
    name: string,  //上牌名字
    level: string | number, //等级
    lock: boolean, //是否加锁
}

@ccclass('WordMonestTabItem')
export class WordMonestTabItem extends Component {
    @property({ type: Label, tooltip: "Tab页标题" })
    public typeTxt: Label = null;

    @property({ type: Node, tooltip: "Lock图标" })
    public lockIcon: Node = null;

    @property({ type: Node, tooltip: "底部图标" })
    public focusImg: Node = null;

    @property({ type: Node, tooltip: "Tab页按钮" })
    public btnTab: Node = null;

    data: CardSimpleInfo = null;

    public Init(data: CardSimpleInfo, selectType) { // { name: "S级卡", level: "S", lock: false }
        this.data = data;
        this.lockIcon.active = false;
        this.typeTxt.string = data.name;
        if (data.level === 5) {
            this.lockIcon.active = true;
        }
        else {
            this.lockIcon.active = false;
        }
        let bSelected: boolean = (data.level === selectType);
        if (bSelected) {
            this.focusImg.active = true;
            this.typeTxt.color = new Color("#ffffff");
        }
        else {
            this.focusImg.active = false;
            this.typeTxt.color = new Color("#53bf22");
        }

        this.initEvent();

    }

    initEvent() {
        CCUtil.onTouch(this.btnTab, this.onTypeSelect, this);//
    }

    removeEvent() {
        CCUtil.offTouch(this.btnTab, this.onTypeSelect, this);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    onTypeSelect(e: EventTouch) {
        EventManager.emit("CardBookView_TypeSelect", this.data);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


