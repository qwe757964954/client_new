import { _decorator, Button, Label, Node, Sprite } from 'cc';
import CCUtil from '../../util/CCUtil';
import ListItem from '../../util/list/ListItem';
import { BuyStoreInfo, ShopClothingMap } from './ShopInfo';

const { ccclass, property } = _decorator;

@ccclass('ShopItemBase')
export abstract class ShopItemBase extends ListItem {
    @property({ type: Label, tooltip: "标题" })
    public lblName: Label = null;

    @property({ type: Label, tooltip: "价格" })
    public lblPrice: Label = null;

    @property({ type: Node, tooltip: "可以点击的商品结点" })
    public ndGoods: Node = null;

    @property({ type: Node, tooltip: "购买按钮" })
    public btnBuy: Node = null;

    @property({ type: Node, tooltip: "icon" })
    public rightIcon: Node = null;

    @property({ type: Node, tooltip: "商品图标" })
    public icon: Node = null;

    @property(Node)
    public goldLayout: Node = null;

    protected btnBuyComponent: Button = null;
    protected btnBuySprite: Sprite = null;
    protected _shopClothing: ShopClothingMap = {};

    protected abstract getPrice(): number;
    protected abstract getItemName(): string;
    protected abstract gotoBuy(): void;
    protected abstract prepareBuyInfo(): BuyStoreInfo;

    onLoad(): void {
        this.initializeComponents();
        this.initEvent();
    }

    private initializeComponents(): void {
        this.btnBuyComponent = this.btnBuy.getComponent(Button);
        this.btnBuySprite = this.btnBuy.getComponent(Sprite);
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.btnBuy, this.onBuyClick.bind(this));
    }

    private async onBuyClick(): Promise<void> {
        this.gotoBuy();
    }

    updateRightActive(show: boolean): void {
        this.rightIcon.active = show;
    }

    changeRightActive(): void {
        this.rightIcon.active = !this.rightIcon.active;
    }

    getRightStatus(): boolean {
        return this.rightIcon.active;
    }
}
