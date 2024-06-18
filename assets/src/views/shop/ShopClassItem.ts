import { _decorator, Component, EventTouch, instantiate, Label, Node, Sprite, SpriteFrame, tween, UITransform, Vec3 } from 'cc';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('ShopClassItem')
export class ShopClassItem extends Component {
    @property(Sprite)
    public btnSprite: Sprite = null;//按钮
    @property(Label)
    public labelTitle: Label = null;//标题
    @property(Node)
    public imgTip: Node = null;//提示
    @property(Node)
    public nodeMask: Node = null;//遮罩
    @property(Node)
    public nodeMenu: Node = null;//菜单
    @property(Node)
    public nodeMenuItem: Node = null;//菜单项
    @property([SpriteFrame])
    public spriteFrames: SpriteFrame[] = [];

    private _classClick: Function = null;//类别点击
    private _subclassClick: Function = null;//子类点击
    private _data: { name: string, subclass: string[] } = null;//数据
    private _lastSubclass: string = "";//上一次选中的子类
    private _slideSpeed: number = 1600; //滑动速度
    private _isSlide: boolean = false; //是否正在滑动

    onLoad() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }

    initEvent() {
        CCUtil.onTouch(this.btnSprite.node, this.onClassClick, this);
    }
    removeEvent() {
        CCUtil.offTouch(this.btnSprite.node, this.onClassClick, this);
    }
    /**初始化 */
    init(data: { name: string, subclass: string[] }, classClick?: Function, subclassClick?: Function) {
        this.labelTitle.string = data.name;
        this._data = data;
        this._classClick = classClick;
        this._subclassClick = subclassClick;

        for (let i = 0; i < data.subclass.length; i++) {
            const subclass = data.subclass[i];
            let item;
            if (0 == i) {
                item = this.nodeMenuItem;
            } else {
                item = instantiate(this.nodeMenuItem);
                this.nodeMenu.addChild(item);
            }
            item.getChildByName("tile").getComponent(Label).string = subclass;
            item.name = subclass;
            CCUtil.onTouch(item, this.onSubClassClick, this);
            if (i == data.subclass.length - 1) {
                item.getChildByName("line").active = false;
            }
        }
    }
    /**按钮点击 */
    onClassClick() {
        if (this._isSlide) return;
        if (this._classClick) {
            this._classClick(this.node);
        }
    }
    /**子类点击 */
    onSubClassClick(event: EventTouch) {
        if (this._isSlide) return;
        let name = event.currentTarget.name;
        if (name == this._lastSubclass) return;
        this.showSubClass(name);
    }
    /**显示类别按钮 */
    showClassBtn() {
        this.imgTip.active = true;
        this.btnSprite.spriteFrame = this.spriteFrames[0];
    }
    /**隐藏类别按钮 */
    hideClassBtn() {
        this.imgTip.active = false;
        this.btnSprite.spriteFrame = this.spriteFrames[1];
    }
    /**显示子类 */
    showSubClass(name?: string) {
        if (null == name) name = this._data.subclass[0];
        this.nodeMenu.children.forEach(child => {
            child.getChildByName("glow").active = child.name == name;
        });
        this._lastSubclass = name;
        if (this._subclassClick) {
            this._subclassClick(this.node, name);
        }
    }
    /**获取滑动距离 */
    getSlideDistance() {
        return this.nodeMenu.getComponent(UITransform).height;
    }
    /**显示类别 */
    showClass(callback?: Function) {
        let height = this.getSlideDistance();
        this.menuSlideDistance(-height, callback);
    }
    /**隐藏类别 */
    hideClass(callback?: Function) {
        let height = this.getSlideDistance();
        this.menuSlideDistance(height, callback);
    }
    /**滑动距离 */
    menuSlideDistance(distance: number, callback?: Function) {
        if (this._isSlide) {
            if (callback) callback();
            return;
        }
        this._isSlide = true;
        let t = Math.abs(distance / this._slideSpeed);
        let angle = distance > 0 ? 180 : -180;
        tween(this.imgTip).by(t, { angle: angle }).start();
        tween(this.nodeMenu).by(t, { position: new Vec3(0, distance, 0) }).call(() => {
            this._isSlide = false;
            if (callback) callback();
        }).start();
    }
    classSlideDistance(distance: number, callback?: Function) {
        if (this._isSlide) {
            if (callback) callback();
            return;
        }
        this._isSlide = true;
        tween(this.node).by(Math.abs(distance / this._slideSpeed), { position: new Vec3(0, distance, 0) }).call(() => {
            this._isSlide = false;
            if (callback) callback();
        }).start();
    }
}


