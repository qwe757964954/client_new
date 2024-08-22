import { _decorator, Node, Sprite, SpriteFrame } from 'cc';
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

    private currentPageIndex: number = 0;
    private zoomScale: number = 1;

    protected initUI(): void {
        this.updatePage();
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.nextPageButton,this.nextPage.bind(this));
        CCUtil.onBtnClick(this.previousPageButton,this.previousPage.bind(this));
        CCUtil.onBtnClick(this.zoomInButton,this.zoomIn.bind(this));
        CCUtil.onBtnClick(this.zoomOutButton,this.zoomOut.bind(this));
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
        this.zoomScale += 0.1;
        this.updateScale();
    }

    zoomOut() {
        this.zoomScale = Math.max(0.1, this.zoomScale - 0.1);
        this.updateScale();
    }

    private updatePage() {
        const sprite = this.pageSprite.getComponent(Sprite);
        sprite.spriteFrame = this.pages[this.currentPageIndex];
        this.updateScale();
    }

    private updateScale() {
        this.pageSprite.setScale(this.zoomScale, this.zoomScale);
    }
}
