import {
    _decorator,
    Button,
    Label,
    misc,
    Node,
    ScrollView,
    Sprite,
    SpriteFrame,
    UITransform,
    Vec3
} from 'cc';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';

const { ccclass, property } = _decorator;

@ccclass('ComicController')
export class ComicController extends BaseView {
    @property(Node)
    private pageSprite: Node = null!;

    @property(Node)
    private nextPageButton: Node = null!;

    @property(Node)
    private previousPageButton: Node = null!;

    @property(Node)
    private zoomInButton: Node = null!;

    @property(Node)
    private zoomOutButton: Node = null!;

    @property([SpriteFrame])
    private pages: SpriteFrame[] = [];

    @property(Label)
    private pageLabel: Label = null!;

    @property
    private defaultScaling: number = 1;

    @property
    private minScale: number = 1;

    @property
    private maxScale: number = 2;

    @property
    private zoomStep: number = 0.1;

    @property
    private zoomSpeed: number = 0.1;
    @property(ScrollView)
    private scrollView: ScrollView = null;

    private currentPageIndex: number = 0;
    private zoomScale: number = 1;

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
        // Listen to system events
        this.node.on(Node.EventType.MOUSE_WHEEL, this.onMouseScroll, this);
    }

    private onMouseScroll(event: Event) {
        // if (this.locked) return;

        const deltaY = event['wheelDeltaY'] || event['deltaY']; // 获取滚轮垂直方向的滚动量
        let scrollDelta = deltaY > 0 ? this.zoomSpeed : -this.zoomSpeed;
        this.zoomScale += scrollDelta;

        // Clamp scale between minScale and maxScale
        this.zoomScale = misc.clampf(this.zoomScale, this.minScale, this.maxScale);

        // Update scale
        const transform = this.pageSprite.getComponent(UITransform);
        const newScale = Vec3.ONE.multiplyScalar(this.zoomScale);
        this.pageSprite.setScale(newScale);

        this.updateScale();
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
        spriteTransform.width = 470;
        spriteTransform.height = 700;
        // Adjust the content size of the scroll view based on the new scale
        const scaledWidth = spriteTransform.width * this.zoomScale;
        const scaledHeight = spriteTransform.height * this.zoomScale;
        // Set new content size (assuming you have a ScrollView component)
        // If you don't have a ScrollView, you can adjust the size and position directly
        // this.scrollView.content.setContentSize(scaledWidth, scaledHeight);
        const scrollViewContentTransform = this.scrollView.content.getComponent(UITransform);
        this.pageSprite.setScale(this.zoomScale, this.zoomScale);
        scrollViewContentTransform.setContentSize(scaledWidth, scaledHeight);

        // Center the page sprite
        const scrollViewSize = this.scrollView.node.getComponent(UITransform);
        this.pageSprite.setPosition(
            scrollViewSize.width / 2 - scaledWidth / 2,
            scrollViewSize.height / 2 - scaledHeight / 2
        );

    }

    private nextPage() {
        if (this.currentPageIndex < this.pages.length - 1) {
            this.currentPageIndex++;
            this.updatePage();
        }
    }

    private previousPage() {
        if (this.currentPageIndex > 0) {
            this.currentPageIndex--;
            this.updatePage();
        }
    }

    private zoomIn() {
        this.zoomScale = Math.min(this.maxScale, this.zoomScale + this.zoomStep);
        this.updateScale();
    }

    private zoomOut() {
        this.zoomScale = Math.max(this.minScale, this.zoomScale - this.zoomStep);
        this.updateScale();
    }
}
