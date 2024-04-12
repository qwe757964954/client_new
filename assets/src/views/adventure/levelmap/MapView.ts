import { _decorator, Component, instantiate, Label, Node, Sprite, SpriteAtlas, SpriteFrame, v3 } from 'cc';
import CCUtil from '../../../util/CCUtil';
import { EventType } from '../../../config/EventType';
import EventManager from '../../../util/EventManager';
const { ccclass, property } = _decorator;

@ccclass('map')
export class MapView extends Component {
    @property({ type: Node, tooltip: "默认图片" })
    public defaultImg: Node = null;
    @property({ type: Node, tooltip: "关卡数量" })
    public labelLevel: Node = null;
    @property({ type: [SpriteFrame], tooltip: "关卡图片" })
    public imgArray: SpriteFrame[] = [];

    @property({ type: [Node], tooltip: "关卡类型" })
    public levelType: Node[] = [];
    start() {

    }

    update(deltaTime: number) {

    }

    /** 初始化地图数据 */
    setMapData(id: number = 0) {
        this._mapid = id;
        this.initUI()
        this.initEvent();
    }
    private _mapid: number = 0

    public setimg(id: number) {

        this.defaultImg.getComponent(Sprite).spriteFrame = this.imgArray[id];

    }
    /**
     * 加载
     */
    onLoad(): void {
    }
    /**
     * 初始化UI
     */
    initUI() {
        this.labelLevel.getComponent(Label).string = (this._mapid + 1) + ''
    }
    /**
     * 初始化事件
     */
    initEvent() {
        for (let i in this.levelType) {
            let node: Node[] = this.levelType[i].children
            for (let j in node) {
                CCUtil.onTouch(node[j], this.onBtnClick.bind(this, [this._mapid, j]), this);
            }
        }
    }
    /**
     * 点击事件
     */
    private onBtnClick(param: any[]) {
        EventManager.emit(EventType.Expand_the_level_page, param);
    }
    /**
     * 移除事件
     */
    removeEvent() {
        for (let i in this.levelType) {
            let node: Node[] = this.levelType[i].children
            for (let j in node) {
                CCUtil.offTouch(node[j], this.onBtnClick.bind(this, [this._mapid, j]), this);
            }
        }
    }
    

    /**
     * 销毁
     */
    onDestroy(): void {
        this.removeEvent()
    }

}


