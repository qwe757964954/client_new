import { _decorator, Button, Label, Node, ScrollView, Sprite, SpriteFrame, UITransform } from 'cc';
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

    private currentPageIndex: number = 0;
    private zoomScale: number = 1;
    private readonly MAX_ZOOM: number = 2.0;
    private readonly MIN_ZOOM: number = 1.0;
    private readonly ZOOM_STEP: number = 0.1;

    protected initUI(): void {
        this.updatePage();
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.nextPageButton, this.nextPage.bind(this));
        CCUtil.onBtnClick(this.previousPageButton, this.previousPage.bind(this));
        CCUtil.onBtnClick(this.zoomInButton, this.zoomIn.bind(this));
        CCUtil.onBtnClick(this.zoomOutButton, this.zoomOut.bind(this));
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
