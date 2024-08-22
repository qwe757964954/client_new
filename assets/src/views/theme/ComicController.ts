import { _decorator, Button, EventMouse, Label, misc, Node, ScrollView, Sprite, SpriteFrame, UITransform, v3, Vec3 } from 'cc';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

@ccclass('ComicController')
export class ComicController extends BaseView {
    @property(Node)
    private pageSprite: Node = null;

    @property(Node)
    private nextPageButton: Node = null;

    @property(Node)
    private previousPageButton: Node = null;

    @property(Node)
    private zoomInButton: Node = null;

    @property(Node)
    private zoomOutButton: Node = null;

    @property([SpriteFrame])
    private pages: SpriteFrame[] = [];

    @property(ScrollView)
    private scrollView: ScrollView = null;

    @property(Label)
    private pageLabel: Label = null;

    @property({
        tooltip: '滚轮缩放比率'
    })
    public increaseRate: number = 10000;

    private currentPageIndex: number = 0;
    private zoomScale: number = 1;
    private readonly MAX_ZOOM: number = 2.0;
    private readonly MIN_ZOOM: number = 1.0;
    private readonly ZOOM_STEP: number = 0.1;

    protected initUI(): void {
        this.updatePage();
        this.setupMouseWheelEvent();
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.nextPageButton, this.nextPage.bind(this));
        CCUtil.onBtnClick(this.previousPageButton, this.previousPage.bind(this));
        CCUtil.onBtnClick(this.zoomInButton, this.zoomIn.bind(this));
        CCUtil.onBtnClick(this.zoomOutButton, this.zoomOut.bind(this));
    }

    private setupMouseWheelEvent() {
        this.node.on(Node.EventType.MOUSE_WHEEL, (event: EventMouse) => {
            let scrollDelta: number = event.getScrollY();
            let scale: number = (this.zoomScale + (scrollDelta / this.increaseRate));
            let target: Node = this.pageSprite;
            let transform = <UITransform>this.node.getComponent(UITransform);
            let pos: Vec3 = transform.convertToNodeSpaceAR(v3(event.getUILocation().x, event.getUILocation().y));
            // pos = v3(50,50)
            this.smoothOperate(target, pos, scale);
            event.propagationStopped = true;
        }, this);
    }

    public smoothOperate(target: Node, pos: Vec3, scale: number): void {
        // 放大缩小
        if (this.MIN_ZOOM <= scale && scale <= this.MAX_ZOOM) {
            // 获取速率的小数后几位，防止速率过小时取整直接舍弃掉了变化
            scale = Number(scale.toFixed(2));
            // let deltaScale: number = scale - target.getScale().x;
            let uiScaleVec3: Vec3 = v3(target.getScale().x, target.getScale().y, 1);
            let uiTouchPos: Vec3 = (pos.clone().subtract(target.position.clone())).divide(uiScaleVec3);
            let mapPos: Vec3 = pos.clone().subtract(uiTouchPos.multiplyScalar(scale));
            //UI setScale z 必须为非0
            target.setScale(v3(scale, scale, 1));
            this.dealScalePos(v3(mapPos.x, mapPos.y), target);
        } else {
            scale = misc.clampf(scale, this.MIN_ZOOM, this.MAX_ZOOM);
        }
    }

    private dealScalePos(pos: Vec3, target: Node): void {
        let transform = <UITransform>this.node.getComponent(UITransform);
        let worldPos: Vec3 = transform.convertToWorldSpaceAR(pos);
        let nodePos: Vec3 = transform.convertToNodeSpaceAR(worldPos);
        let edge: any = this.calculateEdge(target, this.node, nodePos);
        if (edge.left > 0) {
            pos.x -= edge.left;
        }
        if (edge.right > 0) {
            pos.x += edge.right;
        }
        if (edge.top > 0) {
            pos.y += edge.top;
        }
        if (edge.bottom > 0) {
            pos.y -= edge.bottom;
        }
        target.setPosition(v3(pos.x, pos.y, 0));
    }
    // 计算map的四条边距离容器的距离，为负代表超出去
    public calculateEdge(target: Node, container: Node, nodePos: Vec3): any {
        // distance to the edge when anchor is (0.5, 0.5)

        let containerTransform: UITransform = <UITransform>container.getComponent(UITransform);
        let targetTransform: UITransform = <UITransform>target.getComponent(UITransform);
        let targetScale: Vec3 = target.scale;

        let horizontalDistance: number = (containerTransform.width - targetTransform.width * targetScale.x) / 2;
        let verticalDistance: number = (containerTransform.height - targetTransform.height * targetScale.y) / 2;

        let left: number = horizontalDistance + nodePos.x;
        let right: number = horizontalDistance - nodePos.x;
        let top: number = verticalDistance - nodePos.y;
        let bottom: number = verticalDistance + nodePos.y;

        return {left, right, top, bottom};
    }
    private onMouseScroll(event: EventMouse) {
        const delta = event.getScrollY();
        if (delta > 0) {
            // Scroll up: Zoom in
            this.zoomIn();
        } else if (delta < 0) {
            // Scroll down: Zoom out
            this.zoomOut();
        }
    }

    private updatePage() {
        const sprite = this.pageSprite.getComponent(Sprite);
        this.nextPageButton.getComponent(Button).interactable = this.currentPageIndex < this.pages.length - 1;
        this.previousPageButton.getComponent(Button).interactable = this.currentPageIndex > 0;
        sprite.spriteFrame = this.pages[this.currentPageIndex];
        this.pageLabel.string = `${this.currentPageIndex + 1}/${this.pages.length}`;
        this.updateScale();
    }

    private updateScale() {
        const spriteTransform = this.pageSprite.getComponent(UITransform);
        const scrollViewContentTransform = this.scrollView.content.getComponent(UITransform);
        
        this.pageSprite.setScale(this.zoomScale, this.zoomScale);
        
        const scaledWidth = spriteTransform.width * this.zoomScale;
        const scaledHeight = spriteTransform.height * this.zoomScale;

        scrollViewContentTransform.setContentSize(scaledWidth, scaledHeight);

        const scrollViewSize = this.scrollView.node.getComponent(UITransform);
        this.pageSprite.setPosition(
            scrollViewSize.width / 2 - scaledWidth / 2,
            scrollViewSize.height / 2 - scaledHeight / 2
        );
    }

    nextPage() {
        if (this.currentPageIndex < this.pages.length - 1) {
            this.currentPageIndex++;
            this.updatePage();
        }
    }

    previousPage() {
        if (this.currentPageIndex > 0) {
            this.currentPageIndex--;
            this.updatePage();
        }
    }

    zoomIn() {
        this.zoomScale = Math.min(this.MAX_ZOOM, this.zoomScale + this.ZOOM_STEP);
        this.updateScale();
    }

    zoomOut() {
        this.zoomScale = Math.max(this.MIN_ZOOM, this.zoomScale - this.ZOOM_STEP);
        this.updateScale();
    }
}
