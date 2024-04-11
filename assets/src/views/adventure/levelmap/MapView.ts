import { _decorator, Component, instantiate, Node, Sprite, SpriteAtlas, SpriteFrame, v3 } from 'cc';
import CCUtil from '../../../util/CCUtil';
import { EventType } from '../../../config/EventType';
import EventManager from '../../../util/EventManager';
const { ccclass, property } = _decorator;

@ccclass('map')
export class MapView extends Component {
    @property({ type: Node, tooltip: "默认图片" })
    public defaultImg: Node = null;
    @property({ type: [SpriteFrame], tooltip: "关卡图片" })
    public imgArray: SpriteFrame[] = [];

    @property({ type: [Node], tooltip: "关卡类型" })
    public levelType: Node[] = [];
    start() {

    }

    update(deltaTime: number) {

    }


    public setimg(id: number) {

        this.defaultImg.getComponent(Sprite).spriteFrame = this.imgArray[id];

    }
    onLoad(): void {
        this.initUI()
        this.initEvent();
    }
    /**
     * 初始化UI
     */
    initUI() {

    }
    initEvent() {
        for (let i in this.levelType) {
            let node: Node[] = this.levelType[i].children
            for (let j in node) {
                CCUtil.onTouch(node[j], this.onBtnClick.bind(this, [i, j]), this);
            }
        }
    }
    private onBtnClick(param: any[]) {
        console.log(param);
        EventManager.emit(EventType.Expand_the_level_page, param);
    }

    removeEvent() {
        for (let i in this.levelType) {
            let node: Node[] = this.levelType[i].children
            for (let j in node) {
                CCUtil.offTouch(node[j], this.onBtnClick.bind(this, [i, j]), this);
            }
        }
    }
    onDestroy(): void {
        this.removeEvent()
    }

}


